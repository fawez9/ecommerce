import { useState, useEffect } from "react";
import axios from "axios";
import { useGetToken } from "../../hooks/useGetToken";
import "./style.css"; // Import the CSS file
import { UserErrors } from "../../errors";
import { IOrder, IProduct, IUser } from "../../models/interfaces";
import { useGetProducts } from "../../hooks/useGetProducts"; // Assuming you have this hook
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";

interface ProfilePageProps {
  isAdmin: boolean;
}

export const ProfilePage = ({ isAdmin }: ProfilePageProps) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrderId((prevId) => (prevId === orderId ? null : orderId));
  };
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    currentPassword: "",
    newPassword: "",
  });
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"info" | "history">("info");
  const [ordersList, setOrdersList] = useState<IOrder[]>([]);
  const { headers } = useGetToken();
  const userID = localStorage.getItem("userID");

  // Hook to get all products
  const { products } = useGetProducts();

  const fetchUser = async () => {
    if (!userID) return;

    try {
      const response = await axios.get(`http://localhost:3001/user/profile/${userID}`, { headers });
      setUser(response.data.user);
      setFormData({
        fullName: response.data.user.fullName,
        email: response.data.user.email,
        phone: response.data.user.phone,
        address: response.data.user.address,
        currentPassword: "",
        newPassword: "",
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchOrderList = async () => {
    if (!userID) {
      console.error("User ID not found.");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3001/user/orders-list/${userID}`, { headers });
      setOrdersList(response.data.orders);
    } catch (error) {
      console.error("Error fetching order list:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userID]);

  useEffect(() => {
    if (activeTab === "history") {
      fetchOrderList();
    }
  }, [activeTab]);

  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => setAlertMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlertMessage(null);
    try {
      if (userID) {
        const dataToSend = {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          ...(passwordMode && {
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
          }),
        };

        await axios.put(`http://localhost:3001/user/profile/${userID}`, dataToSend, { headers });
        await fetchUser();
        setEditMode(false);
        setPasswordMode(false);
        setAlertMessage("Profile updated successfully!");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        const errorType = error.response.data.type;
        if (errorType === UserErrors.WRONG_CREDENTIALS) {
          setAlertMessage("Current password is incorrect.");
        } else {
          setAlertMessage("An error occurred while updating your profile.");
        }
      } else {
        console.error("Error updating user data:", error);
        setAlertMessage("An unexpected error occurred.");
      }
    }
  };

  const getProductById = (productId: string): IProduct | undefined => {
    return products.find((product) => product._id === productId);
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="profile-page">
      <div className="sidebar-profile">
        <button onClick={() => setActiveTab("info")} className={activeTab === "info" ? "active" : ""}>
          User Info
        </button>
        {!isAdmin && (
          <button onClick={() => setActiveTab("history")} className={activeTab === "history" ? "active" : ""}>
            Order History
          </button>
        )}
      </div>
      <div className="main-content">
        {alertMessage && (
          <div className="alert">
            {alertMessage}
            <button onClick={() => setAlertMessage(null)}>Dismiss</button>
          </div>
        )}
        {activeTab === "info" ? (
          <div className="profile-info">
            {editMode ? (
              <form onSubmit={handleUpdate}>
                <div className="form-group">
                  <label>
                    Full Name:
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required />
                  </label>
                </div>
                <div className="form-group">
                  <label>
                    Email:
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                  </label>
                </div>
                <div className="form-group">
                  <label>
                    Phone:
                    <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} required />
                  </label>
                </div>
                <div className="form-group">
                  <label>
                    Address:
                    <input type="text" name="address" value={formData.address} onChange={handleInputChange} required />
                  </label>
                </div>
                {passwordMode && (
                  <>
                    <div className="form-group">
                      <label>
                        Current Password:
                        <input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleInputChange} required />
                      </label>
                    </div>
                    <div className="form-group">
                      <label>
                        New Password:
                        <input type="password" name="newPassword" value={formData.newPassword} onChange={handleInputChange} required />
                      </label>
                    </div>
                  </>
                )}
                <div className="update-button-group">
                  <button type="submit">Update</button>
                  <button type="button" className="cancel" onClick={() => setEditMode(false)}>
                    Cancel
                  </button>
                  {!passwordMode && (
                    <button type="button" onClick={() => setPasswordMode(true)}>
                      Change Password
                    </button>
                  )}
                </div>
              </form>
            ) : (
              <div>
                <h1>{user.fullName}</h1>
                <p>Email: {user.email}</p>
                <p>Phone: {user.phone}</p>
                <p>Address: {user.address}</p>
                <button onClick={() => setEditMode(true)} id="edit-button">
                  Edit
                </button>
              </div>
            )}
          </div>
        ) : activeTab === "history" ? (
          <div className="order-history">
            {ordersList.length === 0 ? (
              <p>No orders found.</p>
            ) : (
              <ul>
                {ordersList.map((order) => (
                  <li key={order._id} className="order-item">
                    <div className="order-summary">
                      <span className="order-id">Order ID: {order._id}</span>
                      <span className="item-count">{order.items.length} items</span>
                      <span className="total-price">Total: ${order.total.toFixed(2)}</span>
                      <span className="order-toggle" onClick={() => toggleOrderDetails(order._id)}>
                        {expandedOrderId === order._id ? <FontAwesomeIcon icon={faAngleUp} /> : <FontAwesomeIcon icon={faAngleDown} />}
                      </span>
                    </div>
                    <div className={`order-status ${order.status.replace(/\s+/g, "-").toLowerCase()}`}>{order.status}</div>
                    {order.createdAt && <span className="order-date">Date: {new Date(order.createdAt).toLocaleDateString()}</span>}
                    {expandedOrderId === order._id && (
                      <div className="order-details">
                        {order.items.map((item) => {
                          const product = getProductById(item.productId);
                          return product ? (
                            <div key={item.productId} className="product-details">
                              <h4>{product.productName}</h4>
                              {product.img1 && (
                                <div className="product-image-container">
                                  <img src={product.img1} alt={product.productName} className="product-image" />
                                </div>
                              )}
                              <div className="product-info">
                                <p className="price">${product.salePrice ? product.salePrice.toFixed(2) : product.regularPrice.toFixed(2)}</p>
                                <p>Quantity: {item.quantity}</p>
                              </div>
                            </div>
                          ) : null;
                        })}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};
