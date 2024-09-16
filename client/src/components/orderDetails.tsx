import React, { useState } from "react";
import { IOrder, IProduct } from "../models/interfaces";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "./styles/orderDetails.css";

interface OrderDetailsProps {
  order: IOrder;
  getProductById: (productId: string) => IProduct | undefined;
  onBack: () => void;
  onConfirm: () => void;
  onDelete: () => void;
}

export const OrderDetails: React.FC<OrderDetailsProps> = ({ order, getProductById, onBack, onConfirm, onDelete }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleClosePopup = () => {
    setSelectedImage(null);
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
      <div className="order-actions">
        <button onClick={onConfirm} className="confirm-button">
          Confirm Order
        </button>
        <button onClick={onDelete} className="delete-button">
          Delete Order
        </button>
      </div>
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
