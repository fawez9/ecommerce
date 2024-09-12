import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { IUser } from "../models/interfaces";
import { useGetToken } from "./useGetToken";

interface UseGetUsersReturn {
  users: IUser[];
  isLoading: boolean;
  error: string | null;
  fetchUsers: () => void;
}

export const useGetUsers = (): UseGetUsersReturn => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { headers } = useGetToken();

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:3001/admin/users", { headers });
      setUsers(response.data.users || []);
    } catch (err) {
      setError("ERROR: Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, [headers.Authorization]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, isLoading, error, fetchUsers };
};
