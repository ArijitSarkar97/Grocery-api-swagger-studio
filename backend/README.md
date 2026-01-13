# Grocery Store API - FastAPI Backend

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)

### Installation

1. **Navigate to the backend directory:**
```bash
cd backend
```

2. **Create a virtual environment (recommended):**
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Run the server:**
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- **API:** http://localhost:8000
- **Interactive Docs (Swagger):** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

---

## 📝 API Endpoints

### Products
- `GET /api/v1/products` - List all products
- `POST /api/v1/products` - Create a new product
- `GET /api/v1/products/{product_id}` - Get product by ID
- `PATCH /api/v1/products/{product_id}` - Update product
- `DELETE /api/v1/products/{product_id}` - Delete product

### Inventory
- `GET /api/v1/inventory` - Get inventory status
- `PUT /api/v1/inventory/{product_id}` - Update inventory

### Orders
- `POST /api/v1/orders` - Place a new order
- `GET /api/v1/orders/{order_id}` - Get order details
- `PATCH /api/v1/orders/{order_id}/status` - Update order status
- `DELETE /api/v1/orders/{order_id}` - Cancel order

### Customers
- `GET /api/v1/customers` - List all customers
- `GET /api/v1/customers/{customer_id}` - Get customer by ID
- `PATCH /api/v1/customers/{customer_id}` - Update customer
- `DELETE /api/v1/customers/{customer_id}` - Delete customer

### Authentication
- `POST /api/v1/auth/login` - Authenticate user

---

## 🧪 Testing with Postman

### Example Requests:

**Get all products:**
```
GET http://localhost:8000/api/v1/products
```

**Create a new product:**
```
POST http://localhost:8000/api/v1/products
Content-Type: application/json

{
  "name": "Fresh Tomatoes",
  "price": 2.99,
  "category": "Vegetables",
  "inventory": 75
}
```

**Update a product:**
```
PATCH http://localhost:8000/api/v1/products/1
Content-Type: application/json

{
  "price": 1.50
}
```

**Delete a product:**
```
DELETE http://localhost:8000/api/v1/products/1
```

**Place an order:**
```
POST http://localhost:8000/api/v1/orders
Content-Type: application/json

{
  "customer_id": 1,
  "items": [
    {
      "productId": 1,
      "quantity": 3
    },
    {
      "productId": 2,
      "quantity": 5
    }
  ]
}
```

---

## 🔧 Configuration

### CORS Settings
The API allows requests from:
- `http://localhost:3000` (Frontend dev server)
- `http://localhost:5173` (Vite dev server)

To add more origins, edit `main.py`:
```python
allow_origins=["http://localhost:3000", "your-domain.com"],
```

### Change Port
To run on a different port:
```bash
uvicorn main:app --reload --port 8080
```

---

## 📚 Features

✅ **FastAPI Framework** - Modern, fast, high-performance  
✅ **Auto Documentation** - Swagger UI and ReDoc  
✅ **Pydantic Validation** - Request/response validation  
✅ **CORS Enabled** - Works with frontend  
✅ **Type Safety** - Full Python type hints  
✅ **RESTful Design** - Standard HTTP methods  
✅ **Error Handling** - Proper HTTP status codes

---

## 🗄️ Database

Currently using **in-memory storage** (data resets on restart).

For production, replace with:
- **PostgreSQL** (recommended)
- **MySQL**
- **SQLite** (file-based)
- **MongoDB**

---

## 🔐 Security Notes

> **⚠️ IMPORTANT:** This is a demo/development server!

For production deployment:
- Add real authentication (JWT, OAuth)
- Use a proper database
- Add input sanitization
- Enable HTTPS
- Add rate limiting
- Implement proper logging

---

## 📦 Dependencies

- `fastapi` - Web framework
- `uvicorn` - ASGI server
- `pydantic` - Data validation
- `python-multipart` - Form data support

---

## 🐛 Troubleshooting

### Port already in use:
```bash
# Find and kill process on port 8000
lsof -ti:8000 | xargs kill -9
```

### Module not found:
```bash
# Ensure virtual environment is activated
source venv/bin/activate
pip install -r requirements.txt
```

### CORS errors:
- Check that frontend is running on `http://localhost:3000`
- Verify CORS origins in `main.py`

---

## 📈 Next Steps

1. ✅ Backend is running on port 8000
2. ✅ Test with Postman
3. Update frontend to call real API
4. Deploy to production (Heroku, Railway, Render)

---

## 📞 Support

For issues or questions, check:
- FastAPI Docs: https://fastapi.tiangolo.com/
- GitHub Issues: (your repo)
