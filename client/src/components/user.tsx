// components/User.tsx

import { useEffect } from "react";
import { BsPerson } from "react-icons/bs";
import "./styles/style-user.css";
import { useGetUsers } from "../hooks/useGetUsers";

interface UserProps {
  onUserClick: (userID: string) => void;
}

export const User: React.FC<UserProps> = ({ onUserClick }) => {
  const { users, isLoading, error, fetchUsers } = useGetUsers();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div className="users">
      {isLoading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {users.length > 0
        ? users.map((user) => (
            <div key={user._id} className="user-card" onClick={() => onUserClick(user._id)}>
              {user.imgURL && <img src={user.imgURL} alt={`${user.fullName}'s profile`} className="user-image" />}
              <div className="user-details">
                <h2 className="user-name">{user.fullName}</h2>
                <p>
                  <BsPerson /> {user.email}
                </p>
              </div>
            </div>
          ))
        : !isLoading && <p>No users found.</p>}
    </div>
  );
};
