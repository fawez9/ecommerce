import { useGetOrders } from "../hooks/useGetOrders";
import { useGetProducts } from "../hooks/useGetProducts";
import { useGetUsers } from "../hooks/useGetUsers";

import "./styles/dashboard.css";

export const Dashboard = () => {
  const { orders, isLoading: ordersLoading, error: ordersError } = useGetOrders();
  const { products, isLoading: productsLoading, error: productsError } = useGetProducts();
  const { users, isLoading: usersLoading, error: usersError } = useGetUsers();

  if (productsLoading || ordersLoading || usersLoading) {
    return <div className="loading">Loading...</div>;
  }
  if (productsError || ordersError || usersError) {
    return <div className="error">{productsError || ordersError || usersError}</div>;
  }

  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalUsers = users.length;

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
      <div className="dashboard-charts">{/* <OrdersOverTimeGraph orders={orders} /> */}</div>
    </div>
  );
};
