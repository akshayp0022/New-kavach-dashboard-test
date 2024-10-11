import React, { useState, useEffect } from "react";
import { createContext, useContext } from "react";
import endpoints from "../endpoints";
import { fireEvent } from "@testing-library/react";
const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [open, setOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [downloadHistory, setDownloadHistory] = useState([]);
  const [internetHistory, setInternetHitory] = useState([]);
  const [tokenExpired, setTokenExpired] = useState();

  const token = sessionStorage.getItem("jwtToken");
  useEffect(() => {
    if (token) {
      setLoggedIn(true);
    }
  }, [token]);

  const handleScreenWidth = () => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  };

  const handleHistory = async () => {
    const req = await fetch(
      "${endpoints.serverBaseUrl}/api/downloadHistory/INT0006"
    );

    const data = await req.json();
    console.log(data);

    const { Chrome } = data.downloadHistory.downloads[0];
    const { Firefox } = data.downloadHistory.downloads[0];
    const { Edge } = data.downloadHistory.downloads[0];

    setDownloadHistory({ Chrome, Firefox, Edge });
  };

  useEffect(() => {
    handleScreenWidth();
    handleHistory();
  }, []);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        setLoggedIn,
        open,
        setOpen,
        toggleDrawer,
        windowWidth,
        downloadHistory,
        tokenExpired,
        setTokenExpired,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
