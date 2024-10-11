import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Button, TextField } from '@mui/material';
import { MobileTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import io from 'socket.io-client';
import { ws } from "../../utils/endpoints";
import { useStatus } from '../../context/status';

const ForcefullyRestartSettings = ({ currentEmployee }) => {
  const [socket, setSocket] = useState(null);
  const [restartSettings, setRestartSettings] = useState({
    enabled: false,
    dayInterval: "1",
    time: dayjs(),
  });
  
  const { statusData } = useStatus();
  const employeeStatus = statusData[currentEmployee.employeeId]?.status || "deactivated";
  
  const showUI = employeeStatus === "active" || employeeStatus === "idle";
  
  useEffect(() => {
    if (currentEmployee?.featureSettings?.forcefullyRestart) {
      const settings = currentEmployee.featureSettings.forcefullyRestart;
      setRestartSettings({
        enabled: settings.enabled ,
        dayInterval: settings.dayInterval || 1,
        time: settings.time ? dayjs(settings.time, "HH:mm") : dayjs(),
      });
    }
  }, [currentEmployee]);

  useEffect(() => {
    const newSocket = io(ws, {
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    newSocket.on("connect", () => {
      console.log("Connected to websocket");
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from websocket");
    });

    newSocket.on("intervalRestart", (...data) => {
      console.log("Received restart configuration:", data);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const handleSaveSettings = () => {
    if (socket && socket.connected) {
      console.log("Emitting restart settings with empId", currentEmployee?.employeeId || "NA");
      socket.emit("restart", {
        employeeId: currentEmployee?.employeeId || null,
        enabled: restartSettings.enabled,
        dayInterval: Number(restartSettings.dayInterval),
        time: restartSettings.time.format("HH:mm"),
      });

      console.log("Emitted data", {
        employeeId: currentEmployee?.employeeId,
        enabled: restartSettings.enabled,
        dayInterval: restartSettings.dayInterval,
        time: restartSettings.time.format("HH:mm"),
      });
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

  const handleTimeChange = (newValue) => {
    setRestartSettings((prevSettings) => ({
      ...prevSettings,
      time: dayjs(newValue),
    }));
  };

  if (!showUI) {
    return <Typography variant="h6">Employee is not active or idle.</Typography>;
  }

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
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileTimePicker
              label="Time"
              value={restartSettings.time}
              onChange={handleTimeChange}
              openTo="minutes"
              views={["hours", "minutes"]}
              format="HH:mm"
            />
          </LocalizationProvider>
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
