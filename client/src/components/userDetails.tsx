// components/UserDetails.tsx

import { useEffect, useState } from "react";
import axios from "axios";
import { IUser } from "../models/interfaces";
import { useGetToken } from "../hooks/useGetToken";
import "./styles/style-userDetails.css";
import { User } from "./user";

interface UserDetailsProps {
  userID: string | null;
}

export const UserDetails: React.FC<UserDetailsProps> = ({ userID }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { headers } = useGetToken();

  const fetchUser = async (id: string) => {
    try {
      const response = await axios.get(`http://localhost:3001/admin/users/${id}`, { headers });
      setUser(response.data.user);
    } catch (err) {
      console.error("Error fetching user details:", err);
      setError("ERROR: Could not fetch user details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userID) {
      fetchUser(userID);
    }
  }, [userID, headers.Authorization]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!user) return <p>No user found</p>;

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3001/admin/users/${id}`, { headers });
      // alert("User deleted successfully");
      window.location.reload();
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  return (
    <div className="user-details">
      <h1>
        <strong></strong> {user.fullName}
      </h1>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Phone:</strong> {user.phone}
      </p>
      <p>
        <strong>Address:</strong> {user.address}
      </p>
      {/* <p>
        <strong>Purchased Items:</strong> {user.purchasedItems.map((item) => item).join(", ")}
        </p> */}
      {/*  TODO add order ID here */}
      <button onClick={() => handleDelete(user._id)}>Delete</button>
    </div>
  );
};
