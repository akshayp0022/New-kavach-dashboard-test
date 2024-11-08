import React, { createContext, useState, useContext, useEffect } from "react";
import io from "socket.io-client";
import { useAuth } from "./auth";
import { ws } from "../utils/endpoints";

const StatusContext = createContext();

export const StatusProvider = ({ children }) => {
  const { token } = useAuth();
  const [statusData, setStatusData] = useState({});
  const [socket, setSocket] = useState(null);
  // const now = new Date();
  // const timeString = now.toLocaleTimeString();
  // console.log(timeString);

  useEffect(() => {
    console.log("token available---->", token);
    if (token) {
      const socketConnection = io(ws, {
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 500,
      });

      socketConnection.on("connection", () => {
        console.log("Connected to WebSocket server.");
      });

      socketConnection.on("sendEmployeeStatus", (data) => {
        console.log("Received statuses from server :", data);
        if (data && data.employeeId && data.status) {
          setStatusData((prevData) => ({
            ...prevData,
            [data.employeeId]: { status: data.status },
          }));
        } else {
          console.warn("Invalid status data received:", data);
        }
      });

      socketConnection.on("disconnect", () => {
        console.log("Disconnected from WebSocket server.");
      });

      setSocket(socketConnection);

      return () => {
        socketConnection.disconnect();
        console.log("WebSocket connection closed.");
      };
    }
  }, [token]);

  return (
    <StatusContext.Provider value={{ statusData, setStatusData, socket }}>
      {children}
    </StatusContext.Provider>
  );
};

export const useStatus = () => {
  return useContext(StatusContext);
};
