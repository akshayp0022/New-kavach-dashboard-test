import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  FormControlLabel,
  Switch,
  Typography,
  Box,
} from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

import io from 'socket.io-client';

const ForcefullyRestartSettings = ({ employeeId, currentEmployee }) => {
  const [socket, setSocket] = useState(null);
  const [restartSettings, setRestartSettings] = useState({
    enabled: false,
    dayInterval: "1",
    time: dayjs(),
  });

  useEffect(() => {
    if (currentEmployee?.featureSettings?.forcefullyRestart) {
      setRestartSettings({
        enabled: currentEmployee.featureSettings.forcefullyRestart.enabled || false,
        dayInterval: currentEmployee.featureSettings.forcefullyRestart.dayInterval || "1",
        time: currentEmployee.featureSettings.forcefullyRestart.time ? dayjs(currentEmployee.featureSettings.forcefullyRestart.time, 'HH:mm') : dayjs(),
      });
    }
  }, [currentEmployee]);

  // Set up the socket connection on component mount
  useEffect(() => {
    const newSocket = io('http://localhost:5001', {
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    newSocket.on('connect', () => {
      console.log('Connected to websocket');
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from websocket');
    });

    newSocket.on('intervalRestart', (...data) => {
      console.log('Received restart configuration:', data);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [employeeId]);

  // Emit restart settings when they change, only if the socket is connected
  useEffect(() => {
    if (socket && socket.connected) {
      console.log('Emitting restart settings with empId', employeeId);

      socket.emit('restart', {
        employeeId,
        enabled: restartSettings.enabled,
        dayInterval: restartSettings.dayInterval,
        time: restartSettings.time.format('HH:mm'),
      });

      console.log("Emitted data", employeeId);
    }
  }, [restartSettings, socket, employeeId]);

  const handleRestartToggle = () => {
    setRestartSettings((prevSettings) => ({
      ...prevSettings,
      enabled: !prevSettings.enabled,
    }));
  };

  const handleRestartChange = (field) => (event) => {
    let value = event.target.value;
    if (field === "dayInterval") {
      value = Math.max(1, parseInt(value, 10) || 1); // Ensure value is at least 1
    }
    setRestartSettings((prevSettings) => ({
      ...prevSettings,
      [field]: value,
    }));
  };

  const handleTimeChange = (newValue) => {
    const formattedTime = dayjs(newValue).format('HH:mm'); // Format to HH:mm
    setRestartSettings((prevSettings) => ({
      ...prevSettings,
      time: formattedTime,
    }));
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6}>
          <Typography variant="h6">Enable To Set Settings</Typography>
        </Grid>
        <Grid item xs={12} sm={6} container justifyContent="flex-end">
          <FormControlLabel
            control={
              <Switch
                checked={restartSettings.enabled}
                onChange={handleRestartToggle}
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: "#2689ff",
                  },
                  "& .MuiSwitch-track": {
                    backgroundColor: "#b0d1d1",
                  },
                }}
              />
            }
          />
        </Grid>

        <>
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
                value={dayjs(restartSettings.time, 'HH:mm')}
                onChange={handleTimeChange}
                openTo="minutes"
                views={['hours', 'minutes']}
                format="HH:mm"
              />
            </LocalizationProvider>
          </Grid>
        </>
      </Grid>
    </Box>
  );
};

export default ForcefullyRestartSettings;
