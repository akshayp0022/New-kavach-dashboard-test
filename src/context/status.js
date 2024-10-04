import React, { createContext, useState, useContext, useEffect, useRef } from "react";
import io from "socket.io-client";
import { useAuth } from "./auth";

const StatusContext = createContext();

export const StatusProvider = ({ children }) => {
  const { token } = useAuth();
  const [statusData, setStatusData] = useState({});
  const socketRef = useRef(null); 

  useEffect(() => {
    if (token && !socketRef.current) {
      socketRef.current = io("http://10.0.0.31:5001", {
        transports: ["websocket"],  
        reconnection: true,         
        reconnectionAttempts: 5,    
        reconnectionDelay: 2000,    
      });
  
      socketRef.current.on("sendEmployeeStatus", (data) => {
        console.log("Received message from server:", data);
        if (data.employeeId && data.status) {
          setStatusData((prevData) => ({
            ...prevData,
            [data.employeeId]: { status: data.status },
          }));
        } else {
          console.warn("Invalid status data received:", data);
        }
      });
  
      socketRef.current.on("connect", () => {
        console.log("Connected to WebSocket server.");
      });
  
      socketRef.current.on("disconnect", () => {
        console.log("Disconnected from WebSocket server.");
      });
    }
  
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [token]);
  

  return (
    <StatusContext.Provider value={{ statusData, setStatusData }}>
      {children}
    </StatusContext.Provider>
  );
};

export const useStatus = () => {
  return useContext(StatusContext);
};
