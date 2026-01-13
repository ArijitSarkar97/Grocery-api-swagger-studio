# Grocery Store API - Production Ready
# Version: 2.0.0

import logging
from datetime import timedelta
from typing import List, Optional, Literal
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from config import settings
from database import get_db, init_db, ProductDB, CustomerDB, OrderDB, OrderItemDB
from auth import (
    get_password_hash, 
    verify_password, 
    create_access_token,
    get_current_user,
    get_current_user_optional
)

# Logging configuration
logging.basicConfig(
    level=logging.INFO if settings.is_production else logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Lifespan context manager for startup/shutdown events
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info(f"🚀 Starting Grocery Store API in {settings.environment} mode")
    init_db()
    yield
    # Shutdown
    logger.info("👋 Shutting down Grocery Store API")

# Initialize FastAPI app
app = FastAPI(
    title="Grocery Store API",
    description="Production-ready REST API for grocery store management",
    version="2.0.0",
    docs_url="/docs" if not settings.is_production else None,
    redoc_url="/redoc" if not settings.is_production else None,
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Trusted Host Middleware (security)
if settings.is_production:
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=["*"]  # Configure based on your domain
    )

# ============================================================================
# Pydantic Models (Request/Response Schemas)
# ============================================================================

class ProductBase(BaseModel):
    name: str
    price: float
    category: str
    inventory: int = 0

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    inventory: Optional[int] = None

class Product(ProductBase):
    id: int
    class Config:
        from_attributes = True

class OrderItemCreate(BaseModel):
    productId: int
    quantity: int

class OrderItem(BaseModel):
    product_id: int
    quantity: int
    price_at_purchase: float
    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    customer_id: int = 1
    items: List[OrderItemCreate]

class Order(BaseModel):
    id: int
    customer_id: int
    items: List[OrderItem]
    total_price: float
    status: Literal["pending", "completed", "cancelled"] = "pending"
    created_at: str
    class Config:
        from_attributes = True

class OrderStatusUpdate(BaseModel):
    status: Literal["pending", "completed", "cancelled"]

class CustomerBase(BaseModel):
    name: str
    email: EmailStr

class CustomerCreate(CustomerBase):
    password: str

class CustomerUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None

class Customer(CustomerBase):
    id: int
    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Customer

class Token(BaseModel):
    access_token: str
    token_type: str

# ============================================================================
# Exception Handlers
# ============================================================================

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Global exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal server error" if settings.is_production else str(exc)}
    )

# ============================================================================
# API Endpoints - Authentication
# ============================================================================

@app.post("/api/v1/auth/register", response_model=Customer, status_code=status.HTTP_201_CREATED, tags=["Authentication"])
async def register(customer: CustomerCreate, db: Session = Depends(get_db)):
    """Register a new customer account."""
    # Check if email already exists
    existing = db.query(CustomerDB).filter(CustomerDB.email == customer.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new customer
    hashed_password = get_password_hash(customer.password)
    db_customer = CustomerDB(
        name=customer.name,
        email=customer.email,
        hashed_password=hashed_password
    )
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    
    logger.info(f"New customer registered: {customer.email}")
    return db_customer

@app.post("/api/v1/auth/login", response_model=LoginResponse, tags=["Authentication"])
async def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate user and return JWT token."""
    customer = db.query(CustomerDB).filter(CustomerDB.email == credentials.email).first()
    
    if not customer or not customer.hashed_password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not verify_password(credentials.password, customer.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create access token
    access_token = create_access_token(data={"sub": customer.id})
    
    logger.info(f"User logged in: {customer.email}")
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": customer
    }

# ============================================================================
# API Endpoints - Products
# ============================================================================

@app.get("/api/v1/products", response_model=List[Product], tags=["Products"])
async def list_products(db: Session = Depends(get_db)):
    """List all products in the grocery store."""
    products = db.query(ProductDB).all()
    return products

@app.post("/api/v1/products", response_model=Product, status_code=status.HTTP_201_CREATED, tags=["Products"])
async def create_product(
    product: ProductCreate, 
    db: Session = Depends(get_db),
    current_user: CustomerDB = Depends(get_current_user_optional)
):
    """Create a new product."""
    db_product = ProductDB(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    logger.info(f"Product created: {product.name}")
    return db_product

@app.get("/api/v1/products/{product_id}", response_model=Product, tags=["Products"])
async def get_product(product_id: int, db: Session = Depends(get_db)):
    """Get a specific product by ID."""
    product = db.query(ProductDB).filter(ProductDB.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@app.patch("/api/v1/products/{product_id}", response_model=Product, tags=["Products"])
async def update_product(
    product_id: int, 
    product_update: ProductUpdate, 
    db: Session = Depends(get_db),
    current_user: CustomerDB = Depends(get_current_user_optional)
):
    """Partially update a product."""
    product = db.query(ProductDB).filter(ProductDB.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    update_data = product_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(product, key, value)
    
    db.commit()
    db.refresh(product)
    logger.info(f"Product updated: {product.name}")
    return product

@app.delete("/api/v1/products/{product_id}", tags=["Products"])
async def delete_product(
    product_id: int, 
    db: Session = Depends(get_db),
    current_user: CustomerDB = Depends(get_current_user_optional)
):
    """Delete a product."""
    product = db.query(ProductDB).filter(ProductDB.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    db.delete(product)
    db.commit()
    logger.info(f"Product deleted: ID {product_id}")
    return {"message": "Product deleted successfully", "id": product_id}

# ============================================================================
# API Endpoints - Inventory
# ============================================================================

@app.get("/api/v1/inventory", tags=["Inventory"])
async def get_inventory(db: Session = Depends(get_db)):
    """Get current inventory status for all products."""
    products = db.query(ProductDB).all()
    return [{"product_id": p.id, "inventory": p.inventory} for p in products]

@app.put("/api/v1/inventory/{product_id}", tags=["Inventory"])
async def update_inventory(
    product_id: int, 
    quantity: int, 
    db: Session = Depends(get_db),
    current_user: CustomerDB = Depends(get_current_user_optional)
):
    """Update inventory for a specific product."""
    product = db.query(ProductDB).filter(ProductDB.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    product.inventory = quantity
    db.commit()
    logger.info(f"Inventory updated: Product {product_id} -> {quantity}")
    return {"product_id": product_id, "inventory": quantity, "message": "Inventory updated"}

# ============================================================================
# API Endpoints - Orders
# ============================================================================

@app.post("/api/v1/orders", response_model=Order, status_code=status.HTTP_201_CREATED, tags=["Orders"])
async def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    """Place a new order."""
    total_price = 0.0
    order_items_data = []
    
    for item in order.items:
        product = db.query(ProductDB).filter(ProductDB.id == item.productId).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item.productId} not found")
        
        if product.inventory < item.quantity:
            raise HTTPException(status_code=400, detail=f"Insufficient stock for {product.name}")
        
        product.inventory -= item.quantity
        item_total = product.price * item.quantity
        total_price += item_total
        
        order_items_data.append({
            "product_id": item.productId,
            "quantity": item.quantity,
            "price_at_purchase": product.price
        })
    
    db_order = OrderDB(
        customer_id=order.customer_id,
        total_price=round(total_price, 2),
        status="pending"
    )
    db.add(db_order)
    db.flush()
    
    for item_data in order_items_data:
        db_item = OrderItemDB(order_id=db_order.id, **item_data)
        db.add(db_item)
    
    db.commit()
    db.refresh(db_order)
    logger.info(f"Order created: ID {db_order.id}, Total: ${db_order.total_price}")
    return db_order

@app.get("/api/v1/orders/{order_id}", response_model=Order, tags=["Orders"])
async def get_order(order_id: int, db: Session = Depends(get_db)):
    """Get order details by ID."""
    order = db.query(OrderDB).filter(OrderDB.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@app.patch("/api/v1/orders/{order_id}/status", response_model=Order, tags=["Orders"])
async def update_order_status(
    order_id: int, 
    status_update: OrderStatusUpdate, 
    db: Session = Depends(get_db),
    current_user: CustomerDB = Depends(get_current_user_optional)
):
    """Update order status."""
    order = db.query(OrderDB).filter(OrderDB.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    order.status = status_update.status
    db.commit()
    db.refresh(order)
    logger.info(f"Order {order_id} status updated to: {status_update.status}")
    return order

@app.delete("/api/v1/orders/{order_id}", tags=["Orders"])
async def cancel_order(
    order_id: int, 
    db: Session = Depends(get_db),
    current_user: CustomerDB = Depends(get_current_user_optional)
):
    """Cancel an order and restore inventory."""
    order = db.query(OrderDB).filter(OrderDB.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    for item in order.items:
        product = db.query(ProductDB).filter(ProductDB.id == item.product_id).first()
        if product:
            product.inventory += item.quantity
    
    db.delete(order)
    db.commit()
    logger.info(f"Order cancelled: ID {order_id}")
    return {"message": "Order cancelled successfully", "id": order_id}

# ============================================================================
# API Endpoints - Customers
# ============================================================================

@app.get("/api/v1/customers", response_model=List[Customer], tags=["Customers"])
async def list_customers(db: Session = Depends(get_db)):
    """List all customers."""
    customers = db.query(CustomerDB).all()
    return customers

@app.get("/api/v1/customers/{customer_id}", response_model=Customer, tags=["Customers"])
async def get_customer(customer_id: int, db: Session = Depends(get_db)):
    """Get customer by ID."""
    customer = db.query(CustomerDB).filter(CustomerDB.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer

@app.patch("/api/v1/customers/{customer_id}", response_model=Customer, tags=["Customers"])
async def update_customer(
    customer_id: int, 
    customer_update: CustomerUpdate, 
    db: Session = Depends(get_db),
    current_user: CustomerDB = Depends(get_current_user)
):
    """Update customer details."""
    if current_user.id != customer_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    customer = db.query(CustomerDB).filter(CustomerDB.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    update_data = customer_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(customer, key, value)
    
    db.commit()
    db.refresh(customer)
    logger.info(f"Customer updated: {customer.email}")
    return customer

@app.delete("/api/v1/customers/{customer_id}", tags=["Customers"])
async def delete_customer(
    customer_id: int, 
    db: Session = Depends(get_db),
    current_user: CustomerDB = Depends(get_current_user)
):
    """Delete a customer."""
    if current_user.id != customer_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    customer = db.query(CustomerDB).filter(CustomerDB.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    db.delete(customer)
    db.commit()
    logger.info(f"Customer deleted: ID {customer_id}")
    return {"message": "Customer deleted successfully", "id": customer_id}

# ============================================================================
# Root & Health Endpoints
# ============================================================================

@app.get("/", tags=["Root"])
async def root():
    """API root endpoint."""
    return {
        "message": "Welcome to the Grocery Store API",
        "version": "2.0.0",
        "environment": settings.environment,
        "docs": "/docs" if not settings.is_production else "disabled",
        "database": "PostgreSQL" if "postgresql" in settings.database_url else "SQLite"
    }

@app.get("/health", tags=["Health"])
async def health_check(db: Session = Depends(get_db)):
    """Health check endpoint."""
    try:
        products_count = db.query(ProductDB).count()
        orders_count = db.query(OrderDB).count()
        customers_count = db.query(CustomerDB).count()
        
        return {
            "status": "healthy",
            "environment": settings.environment,
            "database": "connected",
            "products_count": products_count,
            "orders_count": orders_count,
            "customers_count": customers_count
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(status_code=503, detail="Service unavailable")
