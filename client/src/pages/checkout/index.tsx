import React, { useState, useEffect } from "react";
import axios from "axios";
import { useGetToken } from "../../hooks/useGetToken";
import "./style.css";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
}

export const CheckoutPage = ({ isAuth }: { isAuth: boolean }) => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(isAuth);
  const [error, setError] = useState<string | null>(null);
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  const { headers } = useGetToken();
  const userID = localStorage.getItem("userID");

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
  }, [isAuth, userID, headers.Authorization]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:3001/product/order", formData, { headers });
      console.log("Order submitted successfully:", response.data);
      setOrderSubmitted(true);
    } catch (error) {
      console.error("Error submitting order:", error);
      setError("Failed to submit order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (orderSubmitted) {
    return <div>Thank you for your order! It has been successfully submitted.</div>;
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
        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Order"}
        </button>
        <button type="button" onClick={() => window.history.back()} disabled={loading}>
          Cancel
        </button>
      </form>
    </div>
  );
};
