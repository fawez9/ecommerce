// components/User.tsx

import { useEffect, useState } from "react";
import "./styles/user.css";
import { useGetUsers } from "../hooks/useGetUsers";
import { UserDetails } from "./userDetails";

export const User: React.FC = () => {
  const { users, isLoading, error, fetchUsers } = useGetUsers();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [selectedUserID, setSelectedUserID] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleCheckboxChange = (userId: string) => {
    setSelectedUsers((prev) => {
      const newSelection = new Set(prev);
      if (newSelection.has(userId)) {
        newSelection.delete(userId);
      } else {
        newSelection.add(userId);
      }
      return newSelection;
    });
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(Array.from(selectedUsers).map((userId) => fetch(`http://localhost:3001/admin/users/${userId}`, { method: "DELETE" })));
      fetchUsers(); // Refresh the user list
      setSelectedUsers(new Set()); // Clear selection
    } catch (err) {
      console.error("Error deleting users:", err);
    }
  };

  const filteredUsers = users.filter((user) => user.fullName.toLowerCase().includes(searchTerm) || user.email.toLowerCase().includes(searchTerm));

  return (
    <div className="user-container">
      {selectedUserID ? (
        <div>
          <button onClick={() => setSelectedUserID(null)} className="back-button">
            Back to User List
          </button>
          <UserDetails userID={selectedUserID} />
        </div>
      ) : (
        <>
          <div className="user-header">
            <input type="text" placeholder="Search by name or email..." value={searchTerm} onChange={handleSearch} />
            <button onClick={handleDeleteSelected} disabled={selectedUsers.size === 0}>
              Delete Selected
            </button>
          </div>
          {isLoading && <p>Loading...</p>}
          {error && <p>{error}</p>}
          {filteredUsers.length > 0 ? (
            <table className="user-table">
              <thead>
                <tr>
                  <th>Select</th>
                  <th>USER_ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <input type="checkbox" checked={selectedUsers.has(user._id || "")} onChange={() => handleCheckboxChange(user._id || "")} />
                    </td>
                    <td>{user._id}</td>
                    <td>{user.fullName}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>
                      <button onClick={() => setSelectedUserID(user._id || "")} className="view-details-button">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            !isLoading && <p>No users found.</p>
          )}
        </>
      )}
    </div>
  );
};
