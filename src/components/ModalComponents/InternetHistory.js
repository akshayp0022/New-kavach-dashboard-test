import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
} from "@mui/material";
import io from "socket.io-client";

const InternetHistory = ({ currentEmployee }) => {
  const [browserHistory, setBrowserHistory] = useState([]);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);

  const handleGetBrowserHistory = () => {
    if (
      socketRef.current &&
      socketRef.current.connected &&
      currentEmployee?.employeeId
    ) {
      socketRef.current.emit("getBrowserHistory", currentEmployee.employeeId);
    } else {
      console.log("WebSocket is not open or employee ID is not available.");
    }
  };

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io("http://10.0.0.31:5001", {
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 2000,
      });

      socketRef.current.on("connect", () => {
        console.log("Connected to WebSocket");

        // Automatically fetch browser history once connected and employee is available
        if (currentEmployee?.employeeId) {
          handleGetBrowserHistory();
        }
      });

      socketRef.current.on("disconnect", () => {
        console.log("Disconnected from WebSocket");
      });

      socketRef.current.on("sendBrowserHistory", (data) => {
        if (data.error) {
          // Handle error, such as 'Employee not connected'
          setError(data.error);
          setBrowserHistory([]);
        } else if (data && data.employeeId) {
          console.log("Received data from server:", data);

          // Only proceed if there's valid history data and employee is connected
          if (
            String(data.employeeId).trim() ===
            String(currentEmployee?.employeeId).trim()
          ) {
            console.log("Employee ID matches");

            if (
              data.data &&
              (Array.isArray(data.data.Chrome) ||
                Array.isArray(data.data.Edge) ||
                Array.isArray(data.data.Firefox))
            ) {
              const combinedHistory = [
                ...(data.data.Chrome || []),
                ...(data.data.Edge || []),
                ...(data.data.Firefox || []),
              ];
              setBrowserHistory(combinedHistory);
              setError(null); // Clear error if history is fetched successfully
            } else {
              console.log("No valid browser history data.");
              setBrowserHistory([]);
            }
          } else {
            console.log("Employee ID does not match.");
            setBrowserHistory([]);
          }
        }
      });

      socketRef.current.on("error", (message) => {
        console.error("Socket error:", message);
        setError(message);
        setBrowserHistory([]);
      });
    }

    if (currentEmployee?.employeeId) {
      handleGetBrowserHistory(); 
    }

    return () => {
      if (socketRef.current) {
        console.log("Disconnecting WebSocket");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [currentEmployee]);

  return (
    <div>
      {error ? (
        <div>
          <Typography color="error">Error: {error}</Typography>
        </div>
      ) : (
        <div>
          <Typography variant="h6">
            Browser History for Employee {currentEmployee?.employeeId || "Unknown"}
          </Typography>
  
          {/* Display browser history */}
          <div>
            {browserHistory.length > 0 ? (
              <Box
                sx={{
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  padding: "10px",
                  marginTop: "10px",
                  maxHeight: "400px",
                  overflowY: "auto",
                }}
              >
                <Typography variant="h6">Browser History</Typography>
                <List>
                  {browserHistory.map((item, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemText
                          primary={`URL: ${item.url}`}
                          secondary={`Title: ${item.title} - Visit Count: ${item.visit_count}`}
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
              </Box>
            ) : (
              <Typography>No browser history available.</Typography>
            )}
          </div>
        </div>
      )}
    </div>
  );
  
};

export default InternetHistory;
