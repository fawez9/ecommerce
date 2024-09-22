import { useState, useEffect } from "react";
import { useGetToken } from "./useGetToken";

export const useGetOrders = (pollingInterval = 5000) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { headers } = useGetToken();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:3001/order", {
          headers,
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const ordersWithTimestamps = data.orders.map((order) => ({
          ...order,
          createdAt: new Date(order.createdAt).getTime(),
        }));
        setOrders(ordersWithTimestamps);
        setError(null);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();

    const intervalId = setInterval(fetchOrders, pollingInterval);

    return () => clearInterval(intervalId);
  }, [pollingInterval, headers]);

  return { orders, isLoading, error };
};
