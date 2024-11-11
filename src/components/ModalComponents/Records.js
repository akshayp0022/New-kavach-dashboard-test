import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Container,
  Grid,
  Snackbar,
  Paper,
} from "@mui/material";
import { useStatus } from "../../context/status"; 

function Records({ currentEmployee }) {
  const [receiverEmail, setReceiverEmail] = useState("");
  const [time, setTime] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { socket } = useStatus(); 

  useEffect(() => {
    if (currentEmployee?.employeeId && socket) {
      console.log("Employee ID:", currentEmployee.employeeId);
      
      const timeoutId = setTimeout(() => {
        setLoading(false);
        setSnackbarMessage("Request timed out.");
        setSnackbarOpen(true);
      }, 10000); 

      socket.on("sendDownloadHistory", (data) => {
        console.log("Received data from server:", data);
        if (data?.employeeId === currentEmployee.employeeId) {
          setSnackbarMessage("Records retrieved successfully!");
          setLoading(false);
          clearTimeout(timeoutId);
          setSnackbarOpen(true);
        } else {
          console.log("Employee ID does not match.");
        }
      });

      return () => {
        socket.off("sendDownloadHistory");
      };
    }
  }, [currentEmployee, socket]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (loading) return;

    if (!receiverEmail || !time) {
      setSnackbarMessage("Please fill in all fields.");
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);
    const payload = {
      receiverEmail,
      time,
      employeeId: currentEmployee?.employeeId,
    };

    if (socket) {
      socket.emit("sendRecords", payload, (response) => {
        console.log("Payload sent:", payload);
        console.log("Response from server:", response);

        if (response && response.status === "success") {
          setSnackbarMessage("Records sent successfully!");
        } else {
          setSnackbarMessage("Failed to send records.");
        }

        setLoading(false);
        setSnackbarOpen(true);
      });
    } else {
      console.error("Socket.IO is not initialized");
      setSnackbarMessage(
        "Failed to send records, Socket.IO is not initialized."
      );
      setLoading(false);
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: "20px", borderRadius: "10px", marginTop: "20px" }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Receiver Email"
                variant="outlined"
                value={receiverEmail}
                onChange={(e) => setReceiverEmail(e.target.value)}
                required
                InputProps={{
                  style: { borderRadius: "8px" },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Time"
                type="text"
                variant="outlined"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                InputProps={{
                  style: { borderRadius: "8px" },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
                style={{ borderRadius: "8px" }}
              >
                {loading ? "Saving..." : "Save"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />
    </Container>
  );
}

export default Records;
