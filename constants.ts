import { ApiEndpoint } from './types';

export const API_DEFINITIONS: ApiEndpoint[] = [
  // Products
  {
    method: 'GET',
    path: '/products',
    summary: 'List all products',
    tags: ['Products'],
    responseExample: [
      { id: 1, name: "Apple", price: 0.5, category: "Fruits", inventory: 100 },
      { id: 2, name: "Milk", price: 3.5, category: "Dairy", inventory: 50 }
    ]
  },
  {
    method: 'POST',
    path: '/products',
    summary: 'Create a new product',
    tags: ['Products'],
    parameters: [{ name: 'body', in: 'body', required: true, type: 'ProductCreate' }],
    responseExample: { id: 3, name: "Bread", price: 2.0, category: "Bakery", inventory: 20 }
  },
  {
    method: 'GET',
    path: '/products/{product_id}',
    summary: 'Get product by ID',
    tags: ['Products'],
    parameters: [{ name: 'product_id', in: 'path', required: true, type: 'integer' }],
    responseExample: { id: 1, name: "Apple", price: 0.5, category: "Fruits", inventory: 100 }
  },
  {
    method: 'PATCH',
    path: '/products/{product_id}',
    summary: 'Partially update a product',
    tags: ['Products'],
    parameters: [
      { name: 'product_id', in: 'path', required: true, type: 'integer' },
      { name: 'body', in: 'body', required: true, type: 'ProductUpdate' }
    ],
    responseExample: { id: 1, name: "Apple", price: 0.75, category: "Fruits", inventory: 100, message: "Product updated" }
  },
  {
    method: 'DELETE',
    path: '/products/{product_id}',
    summary: 'Delete a product',
    tags: ['Products'],
    parameters: [{ name: 'product_id', in: 'path', required: true, type: 'integer' }],
    responseExample: { message: "Product deleted successfully", id: 1 }
  },
  // Inventory
  {
    method: 'GET',
    path: '/inventory',
    summary: 'Get current inventory status',
    tags: ['Inventory'],
    responseExample: [{ product_id: 1, inventory: 100 }, { product_id: 2, inventory: 50 }]
  },
  {
    method: 'PUT',
    path: '/inventory/{product_id}',
    summary: 'Update inventory for a product',
    tags: ['Inventory'],
    parameters: [
      { name: 'product_id', in: 'path', required: true, type: 'integer' },
      { name: 'quantity', in: 'body', required: true, type: 'integer' }
    ],
    responseExample: { product_id: 1, inventory: 120, message: "Inventory updated" }
  },
  // Orders
  {
    method: 'POST',
    path: '/orders',
    summary: 'Place a new order',
    tags: ['Orders'],
    parameters: [{ name: 'body', in: 'body', required: true, type: 'OrderCreate' }],
    responseExample: { id: 101, total_price: 15.5, status: "pending" }
  },
  {
    method: 'GET',
    path: '/orders/{order_id}',
    summary: 'Get order details',
    tags: ['Orders'],
    parameters: [{ name: 'order_id', in: 'path', required: true, type: 'integer' }],
    responseExample: { id: 101, items: [{ product_id: 1, quantity: 5 }], status: "completed" }
  },
  {
    method: 'PATCH',
    path: '/orders/{order_id}/status',
    summary: 'Update order status',
    tags: ['Orders'],
    parameters: [
      { name: 'order_id', in: 'path', required: true, type: 'integer' },
      { name: 'status', in: 'body', required: true, type: 'string' }
    ],
    responseExample: { id: 101, status: "completed", message: "Order status updated" }
  },
  {
    method: 'DELETE',
    path: '/orders/{order_id}',
    summary: 'Cancel an order',
    tags: ['Orders'],
    parameters: [{ name: 'order_id', in: 'path', required: true, type: 'integer' }],
    responseExample: { message: "Order cancelled successfully", id: 101 }
  },
  // Customers
  {
    method: 'GET',
    path: '/customers',
    summary: 'List all customers',
    tags: ['Customers'],
    responseExample: [
      { id: 1, name: "John Doe", email: "john@example.com" },
      { id: 2, name: "Jane Smith", email: "jane@example.com" }
    ]
  },
  {
    method: 'GET',
    path: '/customers/{customer_id}',
    summary: 'Get customer by ID',
    tags: ['Customers'],
    parameters: [{ name: 'customer_id', in: 'path', required: true, type: 'integer' }],
    responseExample: { id: 1, name: "John Doe", email: "john@example.com" }
  },
  {
    method: 'PATCH',
    path: '/customers/{customer_id}',
    summary: 'Update customer details',
    tags: ['Customers'],
    parameters: [
      { name: 'customer_id', in: 'path', required: true, type: 'integer' },
      { name: 'body', in: 'body', required: true, type: 'CustomerUpdate' }
    ],
    responseExample: { id: 1, name: "John Doe", email: "newemail@example.com", message: "Customer updated" }
  },
  {
    method: 'DELETE',
    path: '/customers/{customer_id}',
    summary: 'Delete a customer',
    tags: ['Customers'],
    parameters: [{ name: 'customer_id', in: 'path', required: true, type: 'integer' }],
    responseExample: { message: "Customer deleted successfully", id: 1 }
  },
  // Auth
  {
    method: 'POST',
    path: '/auth/login',
    summary: 'Authenticate user',
    tags: ['Authentication'],
    parameters: [{ name: 'body', in: 'body', required: true, type: 'LoginRequest' }],
    responseExample: { access_token: "eyJhbGciOiJIUz...", token_type: "bearer" }
  }
];

export const PYTHON_CODE_MAIN = `
from fastapi import FastAPI, HTTPException, Depends, status
from sqlalchemy.orm import Session
from typing import List
import models, schemas, crud
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Grocery Store API",
    description="A comprehensive REST API for managing a grocery store.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# --- Products ---
@app.post("/api/v1/products", response_model=schemas.Product, tags=["Products"])
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    return crud.create_product(db=db, product=product)

@app.get("/api/v1/products", response_model=List[schemas.Product], tags=["Products"])
def read_products(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_products(db, skip=skip, limit=limit)

@app.get("/api/v1/products/{product_id}", response_model=schemas.Product, tags=["Products"])
def read_product(product_id: int, db: Session = Depends(get_db)):
    db_product = crud.get_product(db, product_id=product_id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

# --- Orders ---
@app.post("/api/v1/orders", response_model=schemas.Order, tags=["Orders"])
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    return crud.create_order(db=db, order=order)

@app.get("/api/v1/orders/{order_id}", response_model=schemas.Order, tags=["Orders"])
def read_order(order_id: int, db: Session = Depends(get_db)):
    db_order = crud.get_order(db, order_id=order_id)
    if db_order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return db_order
`.trim();

export const PYTHON_CODE_MODELS = `
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, DateTime
from sqlalchemy.orm import relationship
from database import Base
import datetime

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    price = Column(Float)
    category = Column(String, index=True)
    inventory = Column(Integer, default=0)

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"))
    total_price = Column(Float)
    status = Column(String, default="pending")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    items = relationship("OrderItem", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer)
    price_at_purchase = Column(Float)
    order = relationship("Order", back_populates="items")
`.trim();

export const SCHEMA_SQL = `
CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    price REAL NOT NULL,
    category VARCHAR(100),
    inventory INTEGER DEFAULT 0
);

CREATE TABLE customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER,
    total_price REAL NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(customer_id) REFERENCES customers(id)
);

CREATE TABLE order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    product_id INTEGER,
    quantity INTEGER NOT NULL,
    price_at_purchase REAL NOT NULL,
    FOREIGN KEY(order_id) REFERENCES orders(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
);
`.trim();
