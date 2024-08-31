import { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useGetToken } from "../../hooks/useGetToken";
import "./style.css"; // Import the CSS file
import { UserErrors } from "../../errors";

export const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
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
  const { headers } = useGetToken();
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

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

  useEffect(() => {
    fetchUser();
  }, [userID]);

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
      {alertMessage && (
        <div className="alert">
          {alertMessage}
          <button onClick={() => setAlertMessage(null)}>Dismiss</button>
        </div>
      )}
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
  );
};
