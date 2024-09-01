import { useState, useEffect } from "react";
import axios from "axios";
import { useGetToken } from "../../hooks/useGetToken";
import "./style.css"; // Import the CSS file
import { UserErrors } from "../../errors";

// Define the structure for Product
export interface IProduct {
  _id: string;
  productName: string;
  regularPrice: number;
  salePrice?: number;
  stockQuantity: number;
  img1: string;
  img2: string;
  img3?: string;
  description: string;
}

export interface IUser {
  _id?: string;
  fullName: string;
  password: string;
  imgURL?: string;
  email: string;
  phone: string;
  address: string;
  isAdmin: boolean;
  purchasedItems: string[]; // Assuming purchasedItems is an array of product IDs
}

export const ProfilePage = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
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
  const [purchasedItems, setPurchasedItems] = useState<IProduct[]>([]);

  const { headers } = useGetToken();
  const userID = localStorage.getItem("userID");

  const fetchUser = async () => {
    if (!userID) return;

    try {
      const response = await axios.get(`http://localhost:3001/user/profile/${userID}`, {
        headers,
      });
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

  const fetchPurchasedItems = async () => {
    if (!userID) {
      console.error("User ID not found.");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3001/user/purchased-items/${userID}`, {
        headers,
      });

      // Assuming response.data.products is an array of products
      const products: IProduct[] = response.data.products;
      setPurchasedItems(products);
    } catch (error) {
      console.error("Error fetching purchased items:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userID]);

  useEffect(() => {
    if (activeTab === "history") {
      fetchPurchasedItems();
    }
  }, [activeTab]);

  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => setAlertMessage(null), 5000);

      // Clear the timer if the component unmounts
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

        await axios.put(`http://localhost:3001/user/profile/${userID}`, dataToSend, {
          headers,
        });

        await fetchUser();
        setEditMode(false);
        setPasswordMode(false);
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

  if (!user) return <p>Loading...</p>;

  return (
    <div className="profile-container">
      <div className="sidebar">
        <button onClick={() => setActiveTab("info")} className={activeTab === "info" ? "active" : ""}>
          User Info
        </button>
        <button onClick={() => setActiveTab("history")} className={activeTab === "history" ? "active" : ""}>
          Purchase History
        </button>
      </div>
      <div className="content">
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
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} />
                  </label>
                </div>
                <div className="form-group">
                  <label>
                    Email:
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
                  </label>
                </div>
                <div className="form-group">
                  <label>
                    Phone:
                    <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} />
                  </label>
                </div>
                <div className="form-group">
                  <label>
                    Address:
                    <input type="text" name="address" value={formData.address} onChange={handleInputChange} />
                  </label>
                </div>
                {passwordMode && (
                  <>
                    <div className="form-group">
                      <label>
                        Current Password:
                        <input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleInputChange} />
                      </label>
                    </div>
                    <div className="form-group">
                      <label>
                        New Password:
                        <input type="password" name="newPassword" value={formData.newPassword} onChange={handleInputChange} />
                      </label>
                    </div>
                  </>
                )}
                <button type="submit">Update</button>
                <button type="button" className="cancel" onClick={() => setEditMode(false)}>
                  Cancel
                </button>
                {!passwordMode && (
                  <button type="button" onClick={() => setPasswordMode(true)}>
                    Change Password
                  </button>
                )}
              </form>
            ) : (
              <div>
                <h1>{user.fullName}</h1>
                <p>Email: {user.email}</p>
                <p>Phone: {user.phone}</p>
                <p>Address: {user.address}</p>
                <button onClick={() => setEditMode(true)}>Edit</button>
              </div>
            )}
          </div>
        ) : (
          <div className="purchase-history">
            {purchasedItems.length === 0 ? (
              <p>No purchased items found.</p>
            ) : (
              <ul>
                {purchasedItems.map((item) => (
                  <li key={item._id}>
                    {/* <img src={item.img1} alt={item.productName} />  // Display product image here TODO*/}
                    <div className="product-details">
                      <h3>{item.productName}</h3>
                      <p className="price">{item.salePrice ? `$${item.salePrice.toFixed(2)}` : `$${item.regularPrice.toFixed(2)}`}</p>
                      <p className="description">{item.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
