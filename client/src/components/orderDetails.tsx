import React, { useState } from "react";
import { IOrder, IProduct } from "../models/interfaces";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "./styles/orderDetails.css";

interface OrderDetailsProps {
  order: IOrder;
  getProductById: (productId: string) => IProduct | undefined;
  onBack: () => void;
  onOrderStatusChange: (orderId: string, newStatus: string) => void;
}

export const OrderDetails = ({ order, getProductById, onBack, onOrderStatusChange }: OrderDetailsProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleClosePopup = () => {
    setSelectedImage(null);
  };

  const handleConfirm = async () => {
    try {
      await onOrderStatusChange(order._id, "confirmed");
    } catch (error) {
      console.error("Error confirming order:", error);
    }
  };

  const handleDecline = async () => {
    try {
      await onOrderStatusChange(order._id, "declined");
    } catch (error) {
      console.error("Error declining order:", error);
    }
  };

  const renderStatusBanner = () => {
    if (order.status === "confirmed") {
      return <div className="status-banner confirmed">Order Confirmed</div>;
    } else if (order.status === "declined") {
      return <div className="status-banner declined">Order Declined</div>;
    }
    return null;
  };

  return (
    <div className="order-details">
      <button onClick={onBack} className="back-button">
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
      <div className="order-header">
        <p>
          <strong>Order ID:</strong> {order._id}
        </p>
      </div>
      <div className="order-info">
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
          <strong>Total:</strong> {order.total.toFixed(2)} DT
        </p>
        <p>
          <strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
        </p>
      </div>
      <h3>Items</h3>
      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item, index) => {
            const product = getProductById(item.productId);
            return (
              <tr key={index}>
                <td>{product ? <img src={product.img1} alt={product.productName} onClick={() => handleImageClick(product.img1)} /> : "Unknown Product"}</td>
                <td>{product ? product.productName : "Unknown Product"}</td>
                <td>{item.quantity}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {order.status === "in progress" && (
        <div className="order-actions">
          <button onClick={handleConfirm} className="confirm-button">
            Confirm Order
          </button>
          <button onClick={handleDecline} className="delete-button">
            Decline Order
          </button>
        </div>
      )}
      {renderStatusBanner()}
      {selectedImage && (
        <div className="popup active" onClick={handleClosePopup}>
          <div className="popup-content">
            <span className="popup-close" onClick={handleClosePopup}>
              ×
            </span>
            <img src={selectedImage} alt="Product" />
          </div>
        </div>
      )}
    </div>
  );
};
