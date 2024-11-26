import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, CircularProgress, Container, Typography } from "@mui/material";
import { useStatus } from "../../context/status";
import { toast } from "react-toastify";

const TWO_HOURS = 2 * 60 * 60 * 1000;

const DownloadHistoryTable = ({ downloadHistory }) => {
  const extractDomain = (url) => {
    if (!url) return "Unknown";
    const domain = url.replace(/^(https?:\/\/)?/, "");
    return domain.split("/")[0];
  };

  const convertSizeToMB = (sizeInBytes) => {
    if (!sizeInBytes || isNaN(sizeInBytes)) return "N/A";
    const sizeInMB = sizeInBytes / (1024 * 1024);
    return `${sizeInMB.toFixed(2)} MB`;
  };

  const combinedHistory = [
    ...(downloadHistory.Chrome || []).map((item, index) => ({
      id: `chrome-${item[1]}-${index}`,
      nameWebsite: extractDomain(item[1]),
      fileName: item[0]?.trim().split("\\").pop() || "N/A",
      size: convertSizeToMB(item[2]),
      dateTime: item[4],
    })),
    ...(downloadHistory.FireFox || []).map((item, index) => ({
      id: `firefox-${item[1]}-${index}`,
      nameWebsite: extractDomain(item[1]),
      fileName: item[0]?.trim().split("\\").pop() || "N/A",
      size: convertSizeToMB(item[2]),
      dateTime: item[4],
    })),
    ...(downloadHistory.Edge || []).map((item, index) => ({
      id: `edge-${item[1]}-${index}`,
      nameWebsite: extractDomain(item[1]),
      fileName: item[0]?.trim().split("\\").pop() || "N/A",
      size: convertSizeToMB(item[2]),
      dateTime: item[4],
    })),
  ];

  const columns = [
    { field: "nameWebsite", headerName: "Website Name", flex: 1 },
    {
      field: "fileName",
      headerName: "File Name",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "size",
      headerName: "Size (MB)",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "dateTime",
      headerName: "Date & Time",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
  ];

  return (
    <div style={{ height: "90vh", width: "100%" }}>
      <DataGrid
        rows={combinedHistory}
        columns={columns}
        pageSize={20}
        pagination
      />
    </div>
  );
};

const DownloadHistory = ({ currentEmployee }) => {
  const [downloadHistory, setDownloadHistory] = useState({
    Chrome: [],
    FireFox: [],
    Edge: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { socket } = useStatus();

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
    const localData = getFromLocalStorage(`downloadHistory-${currentEmployee?.employeeId}`);
    if (localData) {
      setDownloadHistory(localData);
      setLoading(false);
      return;
    }

    if (currentEmployee?.employeeId && socket) {
      socket.emit("getDownloadHistory", currentEmployee.employeeId);

      const timeoutId = setTimeout(() => {
        if (!error) {
          toast.error("Failed to load download history: Timeout");
          setLoading(false);
          setError(true);
        }
      }, 15000);

      socket.on("sendDownloadHistory", (data) => {
        if (data?.employeeId === currentEmployee.employeeId) {
          setDownloadHistory(data.data);
          saveToLocalStorage(`downloadHistory-${currentEmployee.employeeId}`, data.data);
          setLoading(false);
          clearTimeout(timeoutId);
        }
      });

      socket.on("fetchDownloadHistoryError", (errorInfo) => {
        toast.error(
          `Error fetching download history: ${
            errorInfo?.error || "Unknown error"
          }`
        );
        setLoading(false);
        setError(true);
        clearTimeout(timeoutId);
      });

      return () => {
        socket.off("sendDownloadHistory");
        socket.off("fetchDownloadHistoryError");
      };
    }
  }, [currentEmployee, socket, error]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="90vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="90vh"
      >
        <Typography variant="h6" color="error">
          Failed to load download history. Please try again later.
        </Typography>
      </Box>
    );
  }

  return (
    <Container sx={{ mt: 2 }}>
      <DownloadHistoryTable downloadHistory={downloadHistory} />
    </Container>
  );
};

export default DownloadHistory;
