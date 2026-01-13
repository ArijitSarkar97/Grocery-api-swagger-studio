#!/bin/bash

echo "🚀 Starting Grocery Store API..."

# Activate virtual environment
source venv/bin/activate

# Run the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
