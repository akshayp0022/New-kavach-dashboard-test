import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, CircularProgress, Container, Typography } from "@mui/material";
import { useStatus } from "../../context/status";

const DownloadHistoryTable = ({ downloadHistory }) => {
  const [loading, setLoading] = useState(true);

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
      nameWebsite: extractDomain(item[1]), // Trim the website URL
      fileName: item[0]?.trim().split("\\").pop() || "N/A",
      size: convertSizeToMB(item[2]), // Convert file size to MB
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

  useEffect(() => {
    setLoading(false);
  }, [downloadHistory]);

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
  // eslint-disable-next-line
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { socket } = useStatus();

  useEffect(() => {
    console.log("empid: >>", currentEmployee?.employeeId);
    console.log("websocket: >>", socket);

    if (currentEmployee?.employeeId && socket) {
      setSelectedEmployee(currentEmployee.employeeId);

      socket.emit("getDownloadHistory", currentEmployee.employeeId);

      const timeoutId = setTimeout(() => {
        setLoading(false);
        setError(true);
      }, 10000);

      socket.on("sendDownloadHistory", (data) => {
        console.log("Received data from server:", data);
        if (data?.employeeId === currentEmployee.employeeId) {
          console.log("History matched, updating state");
          setDownloadHistory(data.data);
          setLoading(false);
          clearTimeout(timeoutId); 
        } else {
          console.log("Employee ID does not match.");
        }
      });

      return () => {
        socket.off("sendDownloadHistory");
      };
    }
  }, [currentEmployee, socket]);

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
    <>
      <Container sx={{ mt: 2 }}>
        <DownloadHistoryTable downloadHistory={downloadHistory} />
      </Container>
    </>
  );
};

export default DownloadHistory;
