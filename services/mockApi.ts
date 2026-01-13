import { Product, Order, OrderItem } from '../types';

// Initial Mock Data
let PRODUCTS: Product[] = [
  { id: 1, name: "Honeycrisp Apple", price: 1.25, category: "Fruits", inventory: 50 },
  { id: 2, name: "Organic Banana", price: 0.35, category: "Fruits", inventory: 120 },
  { id: 3, name: "Whole Milk", price: 3.99, category: "Dairy", inventory: 30 },
  { id: 4, name: "Sourdough Bread", price: 5.50, category: "Bakery", inventory: 15 },
  { id: 5, name: "Eggs (Dozen)", price: 4.25, category: "Dairy", inventory: 40 },
  { id: 6, name: "Chicken Breast", price: 8.99, category: "Meat", inventory: 25 },
];

let ORDERS: Order[] = [];

// Simulate Async API Latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  getProducts: async (): Promise<Product[]> => {
    await delay(300);
    return [...PRODUCTS];
  },

  getProduct: async (id: number): Promise<Product | undefined> => {
    await delay(200);
    return PRODUCTS.find(p => p.id === id);
  },

  updateInventory: async (id: number, quantity: number): Promise<Product> => {
    await delay(300);
    const product = PRODUCTS.find(p => p.id === id);
    if (!product) throw new Error("Product not found");
    product.inventory = quantity;
    return { ...product };
  },

  createOrder: async (items: { productId: number, quantity: number }[]): Promise<Order> => {
    await delay(800);
    let total = 0;
    const orderItems: OrderItem[] = [];

    // Validate stock and calculate total
    for (const item of items) {
      const product = PRODUCTS.find(p => p.id === item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);
      if (product.inventory < item.quantity) throw new Error(`Insufficient stock for ${product.name}`);

      product.inventory -= item.quantity; // Deduct stock
      total += product.price * item.quantity;
      orderItems.push({
        product_id: product.id,
        quantity: item.quantity,
        price_at_purchase: product.price
      });
    }

    const newOrder: Order = {
      id: 1000 + ORDERS.length + 1,
      customer_id: 1, // Mock user
      items: orderItems,
      total_price: total,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    ORDERS.push(newOrder);
    return newOrder;
  },

  getOrders: async (): Promise<Order[]> => {
    await delay(400);
    return [...ORDERS];
  },

  // Product DELETE and PATCH
  deleteProduct: async (id: number): Promise<{ message: string; id: number }> => {
    await delay(300);
    const index = PRODUCTS.findIndex(p => p.id === id);
    if (index === -1) throw new Error("Product not found");
    PRODUCTS.splice(index, 1);
    return { message: "Product deleted successfully", id };
  },

  patchProduct: async (id: number, updates: Partial<Product>): Promise<Product> => {
    await delay(300);
    const product = PRODUCTS.find(p => p.id === id);
    if (!product) throw new Error("Product not found");
    Object.assign(product, updates);
    return { ...product };
  },

  // Order DELETE and PATCH
  deleteOrder: async (id: number): Promise<{ message: string; id: number }> => {
    await delay(300);
    const index = ORDERS.findIndex(o => o.id === id);
    if (index === -1) throw new Error("Order not found");
    const order = ORDERS[index];

    // Restore inventory
    for (const item of order.items) {
      const product = PRODUCTS.find(p => p.id === item.product_id);
      if (product) {
        product.inventory += item.quantity;
      }
    }

    ORDERS.splice(index, 1);
    return { message: "Order cancelled successfully", id };
  },

  patchOrderStatus: async (id: number, status: 'pending' | 'completed' | 'cancelled'): Promise<Order> => {
    await delay(300);
    const order = ORDERS.find(o => o.id === id);
    if (!order) throw new Error("Order not found");
    order.status = status;
    return { ...order };
  },

  // Customer CRUD
  getCustomers: async (): Promise<any[]> => {
    await delay(300);
    return [
      { id: 1, name: "John Doe", email: "john@example.com" },
      { id: 2, name: "Jane Smith", email: "jane@example.com" }
    ];
  },

  getCustomer: async (id: number): Promise<any> => {
    await delay(200);
    const customers = [
      { id: 1, name: "John Doe", email: "john@example.com" },
      { id: 2, name: "Jane Smith", email: "jane@example.com" }
    ];
    const customer = customers.find(c => c.id === id);
    if (!customer) throw new Error("Customer not found");
    return customer;
  },

  patchCustomer: async (id: number, updates: any): Promise<any> => {
    await delay(300);
    const customer = { id, name: "John Doe", email: "john@example.com", ...updates };
    return customer;
  },

  deleteCustomer: async (id: number): Promise<{ message: string; id: number }> => {
    await delay(300);
    return { message: "Customer deleted successfully", id };
  }
};
