"use client"
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import React, { useEffect, useState } from 'react';

// Define interfaces for the data structure
interface Product {
  _id: string;
  name: string;
  price: number; // Assuming the price is stored as a number (in cents or dollars)
}

interface OrderItem {
  product: Product;
  quantity: number;
  color: string;
}

interface Order {
  _id: string;
  user: string;
  items: OrderItem[];
  totalAmount: number; // Assuming totalAmount is in cents
  address: string;
  addressType: string;
  paymentId: string;
  createdAt: string; // ISO string format for dates
  updatedAt: string;
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/order'); // Assuming the backend endpoint is '/api/orders'
        const data = await response.json();

        if (data.success) {
          setOrders(data.orders);
        } else {
          setError(data.message || 'Failed to fetch orders');
        }
      } catch (err) {
        setError('Error fetching orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="max-w-4xl mx-auto p-6">
          <h1 className="text-3xl font-semibold text-gray-800 mb-6">Your Orders</h1>
          <p>Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="max-w-4xl mx-auto p-6">
          <h1 className="text-3xl font-semibold text-gray-800 mb-6">Your Orders</h1>
          <p className="text-red-600">{error}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Your Orders</h1>

        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="flex justify-between items-center border-b pb-4 mb-4">
                <div>
                  <h2 className="text-lg font-medium text-gray-700">Order ID: {order._id}</h2>
                  <p className="text-sm text-gray-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-500">Shipping to: {order.address} ({order.addressType})</p>
                </div>
              </div>

              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b last:border-none">
                  <div>
                    <p className="text-gray-700 font-medium">{item.product.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    <p className="text-sm text-gray-500">Color: {item.color}</p>
                  </div>
                  <p className="font-medium text-gray-800">${(item.product.price * item.quantity / 100).toFixed(2)}</p> {/* Assuming price is in cents */}
                </div>
              ))}

              <div className="flex justify-between items-center mt-4">
                <p className="text-gray-700 font-medium">Total:</p>
                <p className="text-xl font-semibold text-gray-900">${(order.totalAmount / 100).toFixed(2)}</p> {/* Total in dollars */}
              </div>
            </div>
          ))
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Orders;


