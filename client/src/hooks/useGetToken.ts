import { useCookies } from "react-cookie";

interface UseGetTokenReturn {
  headers: {
    Authorization?: string;
  };
}

export const useGetToken = (): UseGetTokenReturn => {
  const [cookies] = useCookies(["access_token"]);
  const token = cookies.access_token;

  // Construct the headers object
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  return { headers };
};
