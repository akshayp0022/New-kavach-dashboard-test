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
import { toast } from "react-toastify";
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

  const EXPIRATION_TIME = 2 * 60 * 60 * 1000;
  const LOCAL_STORAGE_KEY = "browserHistory";
  const TWO_HOURS = 2 * 60 * 60 * 1000;

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

  const normalizeUrl = (url) => {
    try {
      const hostname = new URL(url).hostname;
      return hostname.replace("www.", "");
    } catch {
      return url; // Return the original URL if it cannot be parsed
    }
  };

  useEffect(() => {
    if (currentEmployee?.employeeId) {
      console.log("Employee ID:", currentEmployee.employeeId);
    }
  }, [currentEmployee]);

  const saveToLocalStorage = (key, data) => {
    const expiryTime = Date.now() + TWO_HOURS;
    const dataToStore = { data, expiryTime };
    localStorage.setItem(key, JSON.stringify(dataToStore));
  };

  const getFromLocalStorage = (key) => {
    const storedData = localStorage.getItem(key);
    if (!storedData) return null;

    const parsedData = JSON.parse(storedData);
    if (Date.now() > parsedData.expiryTime) {
      localStorage.removeItem(key);
      return null;
    }
    return parsedData.data;
  };

  useEffect(() => {
    const localKey = `browserHistory-${currentEmployee?.employeeId}`;
    const localData = getFromLocalStorage(localKey);

    if (localData) {
      setBrowserHistory(localData);
      setLoading(false);
      return;
    }

    if (currentEmployee?.employeeId && socket) {
      setLoading(true);

      // Emit event to fetch browser history
      socket.emit("getBrowserHistory", currentEmployee.employeeId);

      // Handle timeout for socket response
      const timeoutId = setTimeout(() => {
        if (!error) {
          toast.error("Failed to load browser history: Timeout");
          setLoading(false);
          setError(true);
        }
      }, 15000);

      // Listen for browser history data
      socket.on("sendBrowserHistory", (data) => {
        if (data?.employeeId === currentEmployee.employeeId) {
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

          const consolidatedHistory = combinedHistory.reduce((acc, curr) => {
            const normalizedUrl = normalizeUrl(curr.url);
            const existing = acc[normalizedUrl];

            if (existing) {
              existing.visit_count += curr.visit_count;
            } else {
              acc[normalizedUrl] = {
                ...curr,
                url: normalizedUrl,
              };
            }
            return acc;
          }, {});

          const consolidatedArray = Object.values(consolidatedHistory);

          setBrowserHistory(consolidatedArray);
          saveToLocalStorage(localKey, consolidatedArray);
          setLoading(false);
          clearTimeout(timeoutId);
        }
      });

      // Handle errors
      socket.on("fetchBrowserHistoryError", (errorInfo) => {
        toast.error(
          `Error fetching browser history: ${
            errorInfo?.error || "Unknown error"
          }`
        );
        setLoading(false);
        setError(true);
        clearTimeout(timeoutId);
      });

      return () => {
        socket.off("sendBrowserHistory");
        socket.off("fetchBrowserHistoryError");
      };
    }
  }, [currentEmployee, socket, error]);

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
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="400px"
        >
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
                    try {
                      // Prepend "https://" if no protocol is present
                      const formattedUrl =
                        url.startsWith("http://") || url.startsWith("https://")
                          ? url
                          : `https://${url}`;
                      const hostname = new URL(formattedUrl).hostname;
                      return hostname.replace("www.", "").split(".")[0]; // Extract domain name
                    } catch (error) {
                      console.error(`Invalid URL encountered: ${url}`, error);
                      return url; // Use the original URL as a fallback
                    }
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
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      ticks: {
                        font: {
                          size: 14,
                          weight: "bold",
                        },
                        color: "#333",
                      },
                      title: {
                        display: true,
                        text: "URLs",
                        font: {
                          size: 16,
                          weight: "bold",
                        },
                        color: "#000",
                      },
                    },
                    y: {
                      beginAtZero: true,
                      ticks: {
                        font: {
                          size: 14,
                        },
                        color: "#333",
                      },
                      title: {
                        display: true,
                        text: "Visit Count",
                        font: {
                          size: 16,
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
                          size: 14,
                        },
                        color: "#333",
                      },
                    },
                  },
                }}
                height={400}
                width={800}
              />
            </Box>
          )}
        </div>
      )}
    </div>
  );
};

export default InternetHistory;
