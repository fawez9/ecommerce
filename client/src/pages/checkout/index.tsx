import React, { useState, useEffect } from "react";
import axios from "axios";
import { useGetToken } from "../../hooks/useGetToken";
import { useCart } from "../../context/cartContext";
import { useGetProducts } from "../../hooks/useGetProducts";
import "./style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
}

const formDataInitialValues: FormData = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
};

export const CheckoutPage = ({ isAuth }: { isAuth: boolean }) => {
  const { cartItems, clearCart } = useCart();
  const [formData, setFormData] = useState<FormData>({ ...formDataInitialValues });
  const [loading, setLoading] = useState(isAuth);
  const [error, setError] = useState<string | null>(null);
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  const { headers } = useGetToken();
  const userID = localStorage.getItem("userID");

  // Use the updated hook
  const { products, isLoading: productsLoading, getProductById } = useGetProducts();

  useEffect(() => {
    const fetchUserData = async () => {
      if (isAuth && userID) {
        try {
          const response = await axios.get(`http://localhost:3001/user/profile/${userID}`, { headers });
          const userData = response.data.user;
          setFormData({
            fullName: userData.fullName,
            email: userData.email,
            phone: userData.phone,
            address: userData.address,
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
          setError("Failed to load user data. Please try again.");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isAuth, userID, headers]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Calculate total price using the fetched product prices
    const totalPrice = Object.entries(cartItems).reduce((acc, [productId, quantity]) => {
      const product = getProductById(productId);
      const price = product?.salePrice || product?.regularPrice || 0;
      return acc + price * quantity;
    }, 0);

    // Prepare cart items
    const transformedCartItems = Object.entries(cartItems).map(([productId, quantity]) => ({
      productId,
      quantity,
    }));

    try {
      const response = await axios.post(
        "http://localhost:3001/order/", // Ensure this is the correct endpoint for orders
        {
          ...formData,
          items: transformedCartItems,
          total: totalPrice,
        },
        { headers }
      );
      console.log("Order submitted successfully:", response.data);
      setOrderSubmitted(true);
    } catch (error) {
      console.error("Error submitting order:", error);
      setError("Failed to submit order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading || productsLoading) {
    return <div>Loading...</div>;
  }

  if (orderSubmitted) {
    clearCart();
    return (
      <div className="order-submitted">
        Thank you for your order! It has been successfully submitted <FontAwesomeIcon icon={faCheck} />
      </div>
    );
  }

  return (
    <div className="checkout-form">
      <h2>{isAuth ? "Confirm Your Details" : "Enter Your Details"}</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fullName">Full Name:</label>
          <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone:</label>
          <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="address">Address:</label>
          <input type="text" id="address" name="address" value={formData.address} onChange={handleInputChange} required />
        </div>
        <button type="submit" className="submit-form" disabled={loading}>
          {loading ? "Submitting..." : "Submit Order"}
        </button>
        <button type="reset" className="reset-form" onClick={() => setFormData({ ...formDataInitialValues })}>
          Reset
        </button>
        <button type="button" className="reset-form" onClick={() => window.history.back()} disabled={loading}>
          Cancel
        </button>
      </form>
    </div>
  );
};
