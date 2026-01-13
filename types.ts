export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  inventory: number;
}

export interface Category {
  id: number;
  name: string;
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

export interface Customer {
  id: number;
  name: string;
  email: string;
}

export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  summary: string;
  tags: string[];
  description?: string;
  parameters?: Array<{
    name: string;
    in: 'path' | 'query' | 'body';
    required: boolean;
    type: string;
  }>;
  responseExample?: any;
}

export enum ViewMode {
  HOME = 'HOME',
  DOCS = 'DOCS',
  CODE = 'CODE',
  DEMO = 'DEMO',
  SCHEMA = 'SCHEMA'
}
