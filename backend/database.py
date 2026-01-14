from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
from config import settings

# Create engine with database URL from settings
engine = create_engine(
    settings.database_url,
    connect_args={"check_same_thread": False} if "sqlite" in settings.database_url else {},
    pool_pre_ping=True,  # Verify connections before using
    echo=not settings.is_production  # Log SQL in development only
)

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create Base class
Base = declarative_base()

# Database Models
class ProductDB(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True, nullable=False)
    price = Column(Float, nullable=False)
    category = Column(String(100), index=True)
    inventory = Column(Integer, default=0)

class CustomerDB(Base):
    __tablename__ = "customers"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255))  # For authentication

class OrderDB(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)
    total_price = Column(Float, nullable=False)
    status = Column(String(50), default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    items = relationship("OrderItemDB", back_populates="order", cascade="all, delete-orphan")
    customer = relationship("CustomerDB")

class OrderItemDB(Base):
    __tablename__ = "order_items"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    price_at_purchase = Column(Float, nullable=False)
    
    order = relationship("OrderDB", back_populates="items")
    product = relationship("ProductDB")

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Initialize database
def init_db():
    """Create all tables and seed initial data."""
    import logging
    from sqlalchemy import text
    logger = logging.getLogger(__name__)
    
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("✅ Database tables created")
        
        # Seed initial data if database is empty
        db = SessionLocal()
        try:
            # Check if data already exists
            if db.query(ProductDB).count() == 0:
                # Add initial products (let DB assign IDs)
                products = [
                    ProductDB(name="Honeycrisp Apple", price=1.25, category="Fruits", inventory=50),
                    ProductDB(name="Organic Banana", price=0.35, category="Fruits", inventory=120),
                    ProductDB(name="Whole Milk", price=3.99, category="Dairy", inventory=30),
                    ProductDB(name="Sourdough Bread", price=5.50, category="Bakery", inventory=15),
                    ProductDB(name="Eggs (Dozen)", price=4.25, category="Dairy", inventory=40),
                    ProductDB(name="Chicken Breast", price=8.99, category="Meat", inventory=25),
                ]
                db.add_all(products)
                logger.info("✅ Seeded products")
            
            if db.query(CustomerDB).count() == 0:
                # Add initial customers (without passwords for now)
                customers = [
                    CustomerDB(name="John Doe", email="john@example.com"),
                    CustomerDB(name="Jane Smith", email="jane@example.com"),
                ]
                db.add_all(customers)
                logger.info("✅ Seeded customers")
            
            db.commit()
            
            # Sync sequences if using PostgreSQL (fixes 500 ID error)
            if "postgresql" in settings.database_url:
                try:
                    logger.info("🔄 Syncing PostgreSQL sequences...")
                    db.execute(text("SELECT setval('products_id_seq', (SELECT MAX(id) FROM products))"))
                    db.execute(text("SELECT setval('customers_id_seq', (SELECT MAX(id) FROM customers))"))
                    db.commit()
                    logger.info("✅ Sequences synced")
                except Exception as seq_err:
                    logger.warning(f"⚠️ Could not sync sequences (might be first run): {seq_err}")
            
            logger.info("✅ Database initialized with seed data")
        except Exception as e:
            logger.error(f"❌ Error seeding database: {e}")
            db.rollback()
        finally:
            db.close()
    except Exception as e:
        logger.error(f"❌ Error initializing database: {e}")
        raise
