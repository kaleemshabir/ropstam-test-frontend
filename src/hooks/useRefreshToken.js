import { axiosPrivate } from "../api/axios";
import useAuth from "./useAuth";
import { useNavigate } from "react-router-dom";

const useRefreshToken = () => {
  const { setUser, setIsLoggedIn, user } = useAuth();

  const navigate = useNavigate();

  const refresh = async () => {
    try {
      const response = await axiosPrivate.get("/auth/refresh");
      setUser(response.data);
      setIsLoggedIn(true);
      return response.data.accessToken;
    } catch (error) {
      if (error?.response?.status === 401) {
        setIsLoggedIn(false);
        navigate("/", { replace: true });
      }
    }
  };
  return refresh;
};

export default useRefreshToken;
