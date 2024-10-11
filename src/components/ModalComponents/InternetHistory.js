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
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { ws } from "../../utils/endpoints"
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const InternetHistory = ({ currentEmployee }) => {
  const [browserHistory, setBrowserHistory] = useState([]);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState({ labels: [], dataCounts: [] });
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
      socketRef.current = io(ws, {
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 2000,
      });

      socketRef.current.on("connect", () => {
        console.log("Connected to WebSocket");

        if (currentEmployee?.employeeId) {
          handleGetBrowserHistory();
        }
      });

      socketRef.current.on("disconnect", () => {
        console.log("Disconnected from WebSocket");
      });

      socketRef.current.on("sendBrowserHistory", (data) => {
        if (data.error) {
          setError(data.error);
          setBrowserHistory([]);
        } else if (data && data.employeeId) {
          console.log("Received data from server:", data);

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
              setError(null);
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

  useEffect(() => {
    if (browserHistory.length > 0) {
      const labels = browserHistory.map(item => item.url);
      const dataCounts = browserHistory.map(item => item.visit_count);

      setChartData({
        labels,
        dataCounts,
      });
    }
  }, [browserHistory]);

  return (
    <div>
      {error ? (
        <div>
          <Typography color="error">Error: {error}</Typography>
        </div>
      ) : (
        <div>
          <Typography variant="h6">
            Browser History for Employee{" "}
            {currentEmployee?.employeeId || "Unknown"}
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

          {/* Display browser history chart */}
          <div>
                <Bar
              data={{
                labels: chartData.labels,
                datasets: [{
                  label: 'Visit Count',
                  data: chartData.dataCounts,
                  backgroundColor: 'rgba(75, 192, 192, 0.6)',
                  borderColor: 'rgba(75, 192, 192, 1)',
                  borderWidth: 1,
                }],
              }}
              options={{
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default InternetHistory;
