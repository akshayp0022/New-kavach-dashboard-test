import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useStatus } from "../../context/status";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const getISTTime = () => {
  const currentTime = new Date();
  const istTime = new Date(currentTime.getTime());
  return istTime.toTimeString().slice(0, 5);
};

const ForcefullyRestartSettings = ({ currentEmployee }) => {
  const [restartSettings, setRestartSettings] = useState({
    enabled: true,
    dayInterval: "1",
    time: getISTTime(),
  });

  const { statusData, socket } = useStatus();
  const [isSaving, setIsSaving] = useState(false); 
  const employeeStatus =
    statusData[currentEmployee.employeeId]?.status || "deactivated";

  const showUI = employeeStatus === "active" || employeeStatus === "idle";

  useEffect(() => {
    if (currentEmployee?.featureSettings?.forcefullyRestart) {
      const settings = currentEmployee.featureSettings.forcefullyRestart;
      setRestartSettings({
        enabled: settings.enabled,
        dayInterval: settings.dayInterval || 1,
        time: getISTTime(),
      });
    }
  }, [currentEmployee]);

  useEffect(() => {
    if (socket) {
      socket.on("intervalRestart", (...data) => {
        console.log("Received restart configuration:", data);
      });

      return () => {
        socket.off("intervalRestart");
      };
    }
  }, [socket]);

  const handleSaveSettings = () => {
    if (socket && socket.connected) {
      setIsSaving(true); 

      console.log(
        "Emitting restart settings with empId",
        currentEmployee?.employeeId || "NA"
      );

      socket.emit("restart", {
        employeeId: currentEmployee?.employeeId || null,
        enabled: restartSettings.enabled,
        dayInterval: Number(restartSettings.dayInterval),
        time: restartSettings.time,
      });

      console.log("Emitted data", {
        employeeId: currentEmployee?.employeeId,
        enabled: restartSettings.enabled,
        dayInterval: restartSettings.dayInterval,
        time: restartSettings.time,
      });

      setTimeout(() => {
        if (isSaving) {
          setIsSaving(false);
          toast.error("Failed to save settings, try again later.");
        }
      }, 5000); 
    }
  };

  const handleRestartChange = (field) => (event) => {
    let value = event.target.value;
    if (field === "dayInterval") {
      value = Math.max(1, parseInt(value, 10) || 1);
    }
    setRestartSettings((prevSettings) => ({
      ...prevSettings,
      [field]: value,
    }));
  };

  const handleTimeChange = (event) => {
    setRestartSettings((prevState) => ({
      ...prevState,
      time: event.target.value,
    }));
  };

  useEffect(() => {
    if (isSaving) {
      toast.success("Settings saved successfully!");
      setIsSaving(false); 
    }
  }, [isSaving]);

  return (
    <Box sx={{ padding: 2 }}>
      <Grid container spacing={2} alignItems="center" marginTop={0}>
        {/* <Grid item xs={12}>
          <Typography variant="h6">Forcefully Restart Settings</Typography>
        </Grid> */}

        {/* <Grid item xs={6}>
          <TextField
            fullWidth
            label="Day Interval"
            variant="outlined"
            type="number"
            value={restartSettings.dayInterval}
            onChange={handleRestartChange("dayInterval")}
            inputProps={{ min: 1 }}
          />
        </Grid> */}

        <Grid item xs={6}>
          <TextField
            label="Time"
            variant="outlined"
            type="time"
            value={restartSettings.time}
            onChange={handleTimeChange}
            InputLabelProps={{ shrink: true }}

          />
        </Grid>

        <Grid item xs={12} container justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveSettings}
            disabled={isSaving}
            sx={{
              position: "absolute",
              bottom: 16,
              right: 16,
              display: "flex",
              alignItems: "center",
            }}
          >
            {isSaving && <CircularProgress size={24} sx={{ mr: 2 }} />}
            Save
          </Button>
        </Grid>
      </Grid>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </Box>
  );
};

export default ForcefullyRestartSettings;
