import React, { useMemo } from "react";
import { useGetOrders } from "../hooks/useGetOrders";
import { useGetProducts } from "../hooks/useGetProducts";
import { useGetUsers } from "../hooks/useGetUsers";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import "./styles/dashboard.css";

// Define the interface outside the component
interface OrderData {
  date: string;
  count: number;
}

// Define the shape of an order
interface Order {
  createdAt: string | number | Date;
  // Add other properties of your order object here
}

export const Dashboard: React.FC = () => {
  const { orders, isLoading: ordersLoading, error: ordersError } = useGetOrders(5000); // Poll every 5 seconds
  const { products, isLoading: productsLoading, error: productsError } = useGetProducts();
  const { users, isLoading: usersLoading, error: usersError } = useGetUsers();

  const ordersByDay = useMemo(() => {
    if (!orders || !Array.isArray(orders)) return [];

    const grouped = orders.reduce<Record<string, number>>((acc, order: Order) => {
      let date: string;
      try {
        date = new Date(order.createdAt).toISOString().split("T")[0];
      } catch (error) {
        console.error("Invalid date encountered:", order.createdAt);
        return acc; // Skip this order if the date is invalid
      }

      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date]++;
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([date, count]): OrderData => ({ date, count }))
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateA - dateB;
      });
  }, [orders]);

  if (ordersLoading || productsLoading || usersLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (ordersError || productsError || usersError) {
    return <div className="error">{ordersError || productsError || usersError}</div>;
  }

  const totalProducts = products ? products.length : 0;
  const totalOrders = orders ? orders.length : 0;
  const totalUsers = users ? users.length : 0;

  return (
    <div className="dashboard">
      <div className="dashboard-stats">
        <div className="stat-card">
          <h2 className="stat-title">Total Products</h2>
          <p className="stat-value">{totalProducts}</p>
        </div>
        <div className="stat-card">
          <h2 className="stat-title">Total Orders</h2>
          <p className="stat-value">{totalOrders}</p>
        </div>
        <div className="stat-card">
          <h2 className="stat-title">Total Users</h2>
          <p className="stat-value">{totalUsers}</p>
        </div>
      </div>
      <div className="dashboard-charts">
        <h2>Real Time Orders tracking per day</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={ordersByDay}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
