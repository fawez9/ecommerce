import React from "react";
import { IOrder, IProduct } from "../models/interfaces";
import "./styles/orderDetails.css";

interface OrderDetailsProps {
  order: IOrder;
  getProductById: (productId: string) => IProduct | undefined;
  onBack: () => void;
}

export const OrderDetails: React.FC<OrderDetailsProps> = ({ order, getProductById, onBack }) => {
  return (
    <div className="order-details-container">
      <button onClick={onBack} className="back-button">
        Back
      </button>
      <h2>Order Details</h2>
      <div className="order-details">
        <p>
          <strong>Order ID:</strong> {order._id}
        </p>
        <p>
          <strong>Customer Name:</strong> {order.fullName}
        </p>
        <p>
          <strong>Email:</strong> {order.email}
        </p>
        <p>
          <strong>Phone:</strong> {order.phone}
        </p>
        <p>
          <strong>Address:</strong> {order.address}
        </p>
        <p>
          <strong>Total:</strong> ${order.total.toFixed(2)}
        </p>
        <p>
          <strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
        </p>
        <h3>Items</h3>
        <ul>
          {order.items.map((item, index) => {
            const product = getProductById(item.productId);
            return (
              <li key={index}>
                {item.quantity} x {product ? product.productName : "Unknown Product"}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
