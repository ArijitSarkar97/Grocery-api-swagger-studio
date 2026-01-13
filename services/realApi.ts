// Real API service for calling the FastAPI backend
const API_BASE_URL = 'http://localhost:8000/api/v1';

export interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
    inventory: number;
}

export interface OrderItem {
    product_id: number;
    quantity: number;
    price_at_purchase: number;
}

export interface Order {
    id: number;
    customer_id: number;
    items: OrderItem[];
    total_price: number;
    status: 'pending' | 'completed' | 'cancelled';
    created_at: string;
}

export const realApi = {
    // Products
    getProducts: async (): Promise<Product[]> => {
        const response = await fetch(`${API_BASE_URL}/products`);
        if (!response.ok) throw new Error('Failed to fetch products');
        return response.json();
    },

    getProduct: async (id: number): Promise<Product> => {
        const response = await fetch(`${API_BASE_URL}/products/${id}`);
        if (!response.ok) throw new Error('Product not found');
        return response.json();
    },

    deleteProduct: async (id: number): Promise<{ message: string; id: number }> => {
        const response = await fetch(`${API_BASE_URL}/products/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete product');
        return response.json();
    },

    patchProduct: async (id: number, updates: Partial<Product>): Promise<Product> => {
        const response = await fetch(`${API_BASE_URL}/products/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updates),
        });
        if (!response.ok) throw new Error('Failed to update product');
        return response.json();
    },

    // Orders
    createOrder: async (items: { productId: number, quantity: number }[]): Promise<Order> => {
        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                customer_id: 1,
                items: items
            }),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to create order');
        }
        return response.json();
    },

    getOrders: async (): Promise<Order[]> => {
        // Note: The backend doesn't have a "list all orders" endpoint
        // For demo purposes, we'll return an empty array
        // In production, you'd add this endpoint to the backend
        return [];
    },

    deleteOrder: async (id: number): Promise<{ message: string; id: number }> => {
        const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to cancel order');
        return response.json();
    },

    patchOrderStatus: async (id: number, status: 'pending' | 'completed' | 'cancelled'): Promise<Order> => {
        const response = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        });
        if (!response.ok) throw new Error('Failed to update order status');
        return response.json();
    },

    // Customers
    getCustomers: async (): Promise<any[]> => {
        const response = await fetch(`${API_BASE_URL}/customers`);
        if (!response.ok) throw new Error('Failed to fetch customers');
        return response.json();
    },

    getCustomer: async (id: number): Promise<any> => {
        const response = await fetch(`${API_BASE_URL}/customers/${id}`);
        if (!response.ok) throw new Error('Customer not found');
        return response.json();
    },

    patchCustomer: async (id: number, updates: any): Promise<any> => {
        const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updates),
        });
        if (!response.ok) throw new Error('Failed to update customer');
        return response.json();
    },

    deleteCustomer: async (id: number): Promise<{ message: string; id: number }> => {
        const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete customer');
        return response.json();
    },
};
