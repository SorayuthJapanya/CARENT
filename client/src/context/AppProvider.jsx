// AppProvider.jsx
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { toast } from "react-hot-toast";
import { AppContext } from "./AppContext";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY;

  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [cars, setCars] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/user/me");
      if (data.success) {
        setUser(data.user);
        setIsOwner(data.user.role === "owner");
      } else {
        setUser(null);
        setIsOwner(false);
        navigate("/");
      }
    } catch (error) {
      toast.error(error?.message);
      setUser(null);
      setIsOwner(false);
      navigate("/");
    } finally {
      setLoadingUser(false);
    }
  }, [navigate]);

  const fetchCars = async () => {
    try {
      const { data } = await axios.get("/api/user/cars");
      if (data.success) {
        setCars(data.cars || []);
      } else {
        setCars([]);
      }
    } catch (error) {
      toast.error(error.message);
      setCars([]);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsOwner(false);
    delete axios.defaults.headers.common["Authorization"];
    toast.success("You have been logged out");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token);
    fetchCars();
  }, []);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `${token}`;
      fetchUser();
    }
  }, [token, fetchUser]);


  const value = {
    navigate,
    currency,
    axios,
    user,
    setUser,
    token,
    setToken,
    isOwner,
    setIsOwner,
    fetchUser,
    showLogin,
    setShowLogin,
    logout,
    cars,
    setCars,
    fetchCars,
    pickupDate,
    setPickupDate,
    returnDate,
    setReturnDate,
    loadingUser,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppProvider;
