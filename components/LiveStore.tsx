import React, { useEffect, useState } from 'react';
import { realApi as mockApi } from '../services/realApi'; // Using real API now!
import { generateRecipeSuggestion } from '../services/gemini';
import { Product, Order } from '../types';

export const LiveStore: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<{ product: Product, qty: number }[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<string>("");
  const [aiLoading, setAiLoading] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [p, o] = await Promise.all([mockApi.getProducts(), mockApi.getOrders()]);
    setProducts(p);
    setOrders(o);
    setLoading(false);
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { product, qty: 1 }];
    });
  };

  const placeOrder = async () => {
    if (cart.length === 0) return;
    setLoading(true);
    try {
      await mockApi.createOrder(cart.map(i => ({ productId: i.product.id, quantity: i.qty })));
      setCart([]);
      await loadData();
      alert("Order placed successfully!");
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    setLoading(true);
    try {
      await mockApi.deleteProduct(productId);
      await loadData();
      alert("Product deleted successfully!");
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId: number) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    setLoading(true);
    try {
      await mockApi.deleteOrder(orderId);
      await loadData();
      alert("Order cancelled successfully! Inventory restored.");
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  const askChef = async () => {
    setAiLoading(true);
    // Use environment variable if available, else warn
    const apiKey = process.env.API_KEY;
    const result = await generateRecipeSuggestion(products, apiKey);
    setRecipe(result);
    setAiLoading(false);
  };

  return (
    <div className="flex h-full flex-col md:flex-row bg-gray-50">
      {/* Products Panel */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Fresh Inventory</h2>
          <button
            onClick={() => { setShowAiModal(true); askChef(); }}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            <i className="fas fa-magic"></i> AI Chef
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center p-12"><i className="fas fa-spinner fa-spin text-3xl text-primary"></i></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-4 border border-gray-100 flex flex-col">
                <div className="h-32 bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-4xl text-gray-300">
                  <i className={`fas fa-${product.category === 'Fruits' ? 'apple-alt' : product.category === 'Dairy' ? 'cow' : 'bread-slice'}`}></i>
                </div>
                <h3 className="font-bold text-lg text-gray-800">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                <div className="flex justify-between items-center mt-auto">
                  <span className="font-bold text-primary">${product.price.toFixed(2)}</span>
                  <div className="text-xs text-gray-500">Stock: {product.inventory}</div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.inventory <= 0}
                    className="flex-1 bg-secondary text-white py-2 rounded-lg text-sm font-medium hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteProduct(product.id); }}
                    className="px-3 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition"
                    title="Delete product"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sidebar: Cart & Orders */}
      <div className="w-full md:w-96 bg-white border-l border-gray-200 flex flex-col h-full">
        {/* Cart Section */}
        <div className="p-6 flex-1 overflow-y-auto border-b">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <i className="fas fa-shopping-cart text-gray-400"></i> Shopping Cart
          </h3>
          {cart.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Your cart is empty</p>
          ) : (
            <div className="space-y-3">
              {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm">
                  <span>{item.product.name} <span className="text-gray-400">x{item.qty}</span></span>
                  <span className="font-mono">${(item.product.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-3 mt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${cart.reduce((acc, i) => acc + (i.product.price * i.qty), 0).toFixed(2)}</span>
              </div>
              <button
                onClick={placeOrder}
                className="w-full mt-4 bg-primary text-white py-3 rounded-lg font-bold hover:bg-green-600 transition shadow-lg shadow-green-200"
              >
                Checkout
              </button>
            </div>
          )}
        </div>

        {/* Recent Orders Section */}
        <div className="p-6 bg-gray-50 h-1/3 overflow-y-auto">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Recent Orders (Simulated)</h3>
          <div className="space-y-3">
            {orders.slice().reverse().map(order => (
              <div key={order.id} className="bg-white p-3 rounded border text-sm shadow-sm">
                <div className="flex justify-between font-medium">
                  <span>Order #{order.id}</span>
                  <div className="flex gap-2 items-center">
                    <span className={`px-2 rounded text-xs ${order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{order.status}</span>
                    <button
                      onClick={() => cancelOrder(order.id)}
                      className="text-red-600 hover:text-red-800 transition"
                      title="Cancel order"
                    >
                      <i className="fas fa-times-circle"></i>
                    </button>
                  </div>
                </div>
                <div className="flex justify-between text-gray-500 mt-1 text-xs">
                  <span>{new Date(order.created_at).toLocaleTimeString()}</span>
                  <span>${order.total_price.toFixed(2)}</span>
                </div>
              </div>
            ))}
            {orders.length === 0 && <p className="text-xs text-gray-400">No orders yet.</p>}
          </div>
        </div>
      </div>

      {/* AI Modal */}
      {showAiModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
            <button onClick={() => setShowAiModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <i className="fas fa-times"></i>
            </button>
            <h3 className="text-xl font-bold mb-4 text-purple-700 flex items-center gap-2">
              <i className="fas fa-robot"></i> AI Chef Suggestion
            </h3>
            {aiLoading ? (
              <div className="py-8 text-center text-gray-500">
                <i className="fas fa-circle-notch fa-spin text-2xl mb-2"></i>
                <p>Analyzing ingredients...</p>
              </div>
            ) : (
              <div className="prose prose-sm text-gray-700">
                <p className="whitespace-pre-wrap">{recipe}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
