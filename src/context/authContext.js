import { useState, createContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAxiosWrapper from "../helpers/axiosWrapper";
export const AuthContext = createContext({});
export const AuthContextProvider = (props) => {
  const { axiosWrapper } = useAxiosWrapper();
  const [user, setUser] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location?.state?.from?.pathname;

  const onLogin = async (payload) => {
    try {
      setLoading(true);

      const { status, error, data } = await axiosWrapper(
        "/auth/login",
        "post",
        payload
      );
      if (status === 200) {
        setUser(data);
        setIsLoggedIn(true);
        navigate(from ? from : "/cars");
      } else {
        setError(error);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await axiosWrapper("/auth/logout");
    setUser({});
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        setIsLoggedIn,
        onLogin,
        logout,
        isLoggedIn,
        user,
        setUser,
        error,
        setError,
        loading,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
