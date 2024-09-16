import React, { useState, useEffect } from "react";
import axios from "axios";
import { useGetToken } from "../hooks/useGetToken";
import { useGetProducts } from "../hooks/useGetProducts";
import { IOrder } from "../models/interfaces";
import { OrderDetails } from "./orderDetails";
import "./styles/order.css";

export const Order = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { headers } = useGetToken();
  const { products, isLoading: productsLoading, getProductById } = useGetProducts();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:3001/order", { headers });
        setOrders(response.data.orders || []);
      } catch (err) {
        setError("ERROR: Unable to fetch orders.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [headers.Authorization]);

  if (isLoading || productsLoading) {
    return <div className="loading-message">Loading orders...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedOrders(new Set(orders.map((order) => order._id)));
    } else {
      setSelectedOrders(new Set());
    }
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all([...selectedOrders].map((orderId) => axios.delete(`http://localhost:3001/order/${orderId}`, { headers })));
      setOrders((prevOrders) => prevOrders.filter((order) => !selectedOrders.has(order._id)));
      setSelectedOrders(new Set());
    } catch (err) {
      setError("ERROR: Unable to delete orders.");
    }
  };

  const filteredOrders = orders.filter((order) => order.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || order.email.toLowerCase().includes(searchTerm.toLowerCase()));

  if (selectedOrderId) {
    const selectedOrder = orders.find((order) => order._id === selectedOrderId);
    if (selectedOrder) {
      return <OrderDetails order={selectedOrder} getProductById={getProductById} onBack={() => setSelectedOrderId(null)} />;
    }
  }

  return (
    <div className="orders-container">
      <div className="orders-header">
        <input type="text" placeholder="Search orders..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <button onClick={handleDeleteSelected} disabled={selectedOrders.size === 0}>
          Delete Selected
        </button>
      </div>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <>
          <table className="orders-table">
            <thead>
              <tr>
                <th>
                  <input type="checkbox" onChange={handleSelectAll} checked={orders.length > 0 && selectedOrders.size === orders.length} />
                </th>
                <th>ID</th>
                <th>Customer Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Total</th>
                <th>Date</th>
                <th>Items</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

                return (
                  <tr key={order._id} onClick={() => handleSelectOrder(order._id)} className="clickable-row">
                    <td>
                      <input type="checkbox" checked={selectedOrders.has(order._id)} onChange={() => handleSelectOrder(order._id)} />
                    </td>
                    <td>{order._id}</td>
                    <td>{order.fullName}</td>
                    <td>{order.email}</td>
                    <td>{order.phone}</td>
                    <td>{order.address}</td>
                    <td>${order.total.toFixed(2)}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>{totalItems} items</td>
                    <td>View Details</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};
