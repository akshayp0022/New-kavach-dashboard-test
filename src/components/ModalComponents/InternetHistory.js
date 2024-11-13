import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Tab,
  Tabs,
  CircularProgress,
} from "@mui/material";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useStatus } from "../../context/status";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const InternetHistory = ({ currentEmployee }) => {
  const [browserHistory, setBrowserHistory] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({ labels: [], dataCounts: [] });
  const socketRef = useRef(null);
  const [activeTab, setActiveTab] = useState(0);
  const { socket } = useStatus();
  console.log("socket",socket);
  

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

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
    if (currentEmployee?.employeeId) {
      console.log("Employee ID:", currentEmployee.employeeId);
    }
  }, [currentEmployee]);

  useEffect(() => {
    if (socket && currentEmployee?.employeeId) {
      setLoading(true); // Show loader
      socket.emit("getBrowserHistory", currentEmployee.employeeId);

      socket.on("sendBrowserHistory", (data) => {
        if (data.error) {
          setError(data.error);
          setBrowserHistory([]);
          setLoading(false); // Hide loader
        } else if (data && data.employeeId) {
          if (
            String(data.employeeId).trim() ===
            String(currentEmployee?.employeeId).trim()
          ) {
            const chromeHistory = (data.data.Chrome || []).filter(
              (item) => item !== "No data found"
            );
            const edgeHistory = (data.data.Edge || []).filter(
              (item) => item !== "No data found"
            );
            const firefoxHistory = (data.data.Firefox || []).filter(
              (item) => item !== "No data found"
            );

            const combinedHistory = [
              ...chromeHistory,
              ...edgeHistory,
              ...firefoxHistory,
            ];

            setBrowserHistory(combinedHistory);
            setError(null);
            setLoading(false); // Hide loader
          }
        }
      });

      return () => {
        socket.off("sendBrowserHistory");
      };
    }
  }, [socket, currentEmployee]);

  useEffect(() => {
    if (browserHistory.length > 0) {
      const labels = browserHistory.map((item) => item.url);
      const dataCounts = browserHistory.map((item) => item.visit_count);

      setChartData({
        labels,
        dataCounts,
      });
    }
  }, [browserHistory]);

  return (
    <div>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="400px">
          <CircularProgress />
        </Box>
      ) : error ? (
        <div>
          <Typography color="error">Error: {error}</Typography>
        </div>
      ) : (
        <div>
          <Typography variant="h6">
            Browser History for Employee{" "}
            {currentEmployee?.employeeId || "Unknown"}
          </Typography>

          {/* Tabs for switching views */}
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="browser history tabs"
          >
            <Tab label="List" />
            <Tab label="Analyticals" />
          </Tabs>

          {/* List View */}
          {activeTab === 0 && (
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
                    backgroundColor: "#f9f9f9",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Typography variant="h6" fontWeight="bold">
                    Browser History
                  </Typography>
                  <List>
                    {browserHistory.map((item, index) => (
                      <React.Fragment key={index}>
                        <ListItem
                          sx={{
                            padding: "10px 0",
                            "&:hover": {
                              backgroundColor: "#f5f5f5",
                            },
                          }}
                        >
                          <ListItemText
                            primary={
                              <Typography fontWeight="bold">{`URL: ${item.url}`}</Typography>
                            }
                            secondary={`Title: ${item.title} - Visit Count: ${item.visit_count}`}
                          />
                        </ListItem>
                        <Divider
                          sx={{ marginY: "4px", backgroundColor: "#e0e0e0" }}
                        />
                      </React.Fragment>
                    ))}
                  </List>
                </Box>
              ) : (
                <Typography variant="body1">
                  No browser history available.
                </Typography>
              )}
            </div>
          )}

          {/* Analytical View */}
          {activeTab === 1 && (
            <Box
              p={3}
              sx={{
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
                boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <Bar
                data={{
                  labels: chartData.labels.map((url) => {
                    const hostname = new URL(url).hostname;
                    return hostname.replace("www.", "").split(".")[0];
                  }),
                  datasets: [
                    {
                      label: "Visit Count",
                      data: chartData.dataCounts,
                      backgroundColor: "rgba(75, 192, 192, 0.6)",
                      borderColor: "rgba(75, 192, 192, 1)",
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false, // Allows you to set a custom height and width
                  scales: {
                    x: {
                      ticks: {
                        font: {
                          size: 14, // Larger font for the URL labels
                          weight: "bold",
                        },
                        color: "#333", // Darker color for better readability
                      },
                      title: {
                        display: true,
                        text: "URLs",
                        font: {
                          size: 16, // Axis title font size
                          weight: "bold",
                        },
                        color: "#000",
                      },
                    },
                    y: {
                      beginAtZero: true,
                      ticks: {
                        font: {
                          size: 14, // Larger font for Y-axis labels
                        },
                        color: "#333",
                      },
                      title: {
                        display: true,
                        text: "Visit Count",
                        font: {
                          size: 16, // Axis title font size
                          weight: "bold",
                        },
                        color: "#000",
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      labels: {
                        font: {
                          size: 14, // Legend font size
                        },
                        color: "#333",
                      },
                    },
                  },
                }}
                height={400} // Set the height of the chart
                width={800} // Set the width of the chart
              />
            </Box>
          )}
        </div>
      )}
    </div>
  );
};

export default InternetHistory;
