import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  TextField,
  Snackbar,
} from "@mui/material";
import { useStatus } from "../../context/status";

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
  const [snackbarOpen, setSnackbarOpen] = useState(false);
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

      setSnackbarOpen(true);
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

  // if (!showUI) {
  //   return <Typography variant="h6">Employee is not active or idle.</Typography>;
  // }

  return (
    <Box sx={{ padding: 2 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <Typography variant="h6">Forcefully Restart Settings</Typography>
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Day Interval"
            variant="outlined"
            type="number"
            value={restartSettings.dayInterval}
            onChange={handleRestartChange("dayInterval")}
            inputProps={{ min: 1 }}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
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
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ForcefullyRestartSettings;
