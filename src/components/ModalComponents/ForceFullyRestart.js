import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Button,
  TextField,
  CircularProgress,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useStatus } from "../../context/status";

const getISTTime12HourFormat = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  const istTime = new Date(now.getTime() + offset + 19800000);

  let hours = istTime.getHours();
  const minutes = istTime.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12;
  return { hours: hours.toString().padStart(2, "0"), minutes, ampm };
};

const ForcefullyRestartSettings = ({ currentEmployee }) => {
  const currentISTTime = getISTTime12HourFormat();
  const [restartSettings, setRestartSettings] = useState({
    hours: currentISTTime.hours,
    minutes: currentISTTime.minutes,
    ampm: currentISTTime.ampm,
  });
  const [isSaving, setIsSaving] = useState(false);

  const { statusData, socket } = useStatus();
  // const showUI = employeeStatus === "active" || employeeStatus === "idle";
  

  const handleTimeChange = (field) => (event) => {
    let value = event.target.value;

    // Validation for hours and minutes
    if (field === "hours") {
      value = Math.max(1, Math.min(12, Number(value) || 1));
    } else if (field === "minutes") {
      value = Math.max(0, Math.min(60, Number(value) || 0));
    }

    setRestartSettings((prevState) => ({
      ...prevState,
      [field]: value.toString().padStart(2, "0"),
    }));
  };

  // useEffect(() => {
  //   if (socket) {
  //     socket.on("intervalRestart", (...data) => {
  //       console.log("Received restart configuration:", data);
  //     });

  //     return () => {
  //       socket.off("intervalRestart");
  //     };
  //   }
  // }, [socket]);

  const handleSaveSettings = () => {
    // Convert time to 24-hour format
    const time24Hour = convertTo24HourFormat(
      `${restartSettings.hours}:${restartSettings.minutes}`,
      restartSettings.ampm
    );   

    // Ensure socket connection is available
    if (socket) {
      // setIsSaving(true); // Set saving state

      // console.log("Emitting restart settings ", {
      //   employeeId: currentEmployee?.employeeId || null,
      //   enabled: currentEmployee.featureSettings.forcefullyRestart.enabled,
      //   dayInterval: Number(
      //     currentEmployee.featureSettings.forcefullyRestart.dayInterval
      //   ),
      //   time: time24Hour,
      // });

      // Emit settings data via socket
      socket.emit("restart", {
        employeeId: currentEmployee?.employeeId || null,
        enabled: currentEmployee.featureSettings.forcefullyRestart.enabled,
        dayInterval: Number(
          currentEmployee.featureSettings.forcefullyRestart.dayInterval
        ),
        time: time24Hour, // converted 24-hour format time
      });

      console.log("Emitted data", {
        employeeId: currentEmployee?.employeeId || null,
        enabled: currentEmployee.featureSettings.forcefullyRestart.enabled,
        dayInterval: Number(
          currentEmployee.featureSettings.forcefullyRestart.dayInterval
        ),
        time: time24Hour,
      });

      toast.success("Settings saved successfully!");

      // Handle potential timeout
      setTimeout(() => {
        if (isSaving) {
          setIsSaving(false);
          toast.error("Failed to save settings, try again later.");
        }
      }, 5000);
    } else {
      toast.error("Socket connection not available. Please try again.");
    }
  };

  const convertTo24HourFormat = (time, ampm) => {
    const [hours, minutes] = time.split(":").map(Number);
    let convertedHours = hours;

    if (ampm === "PM" && hours !== 12) convertedHours += 12;
    if (ampm === "AM" && hours === 12) convertedHours = 0;

    return `${convertedHours.toString().padStart(2, "0")}:${minutes}`;
  };

  return (
    <Box
      sx={{
        padding: 2,
        maxWidth: 500,
        margin: "0 auto",
        backgroundColor: "#fff",
        borderRadius: "8px",
      }}
    >
      {/* Title and Description */}
      {/* <Typography variant="h6" sx={{ fontWeight: 600, marginBottom: 1 }}>
      Force Restart Settings
    </Typography> */}
      <Typography variant="body2" sx={{ color: "#666", marginBottom: 2 }}>
        Configure the time for automatic system restarts. Ensure the settings
        are accurate to avoid interruptions during working hours.
      </Typography>

      <Grid container spacing={2} alignItems="center">
        {/* Hours Field */}
        <Grid item xs={4}>
          <TextField
            label="Hours"
            value={restartSettings.hours}
            onChange={handleTimeChange("hours")}
            type="number"
            inputProps={{ min: 1, max: 12 }}
            fullWidth
            sx={{
              "& input": {
                textAlign: "center",
                fontWeight: 500,
                fontSize: "16px",
              },
              "& .MuiInputLabel-root": { fontSize: "14px", color: "#666" },
              "& .MuiFormHelperText-root": { fontSize: "12px", color: "#888" },
            }}
          />
        </Grid>

        {/* Minutes Field */}
        <Grid item xs={4}>
          <TextField
            label="Minutes"
            value={restartSettings.minutes}
            onChange={handleTimeChange("minutes")}
            type="number"
            inputProps={{ min: 0, max: 60 }}
            fullWidth
            sx={{
              "& input": {
                textAlign: "center",
                fontWeight: 500,
                fontSize: "16px",
              },
              "& .MuiInputLabel-root": { fontSize: "14px", color: "#666" },
              "& .MuiFormHelperText-root": { fontSize: "12px", color: "#888" },
            }}
          />
        </Grid>

        {/* AM/PM Dropdown */}
        <Grid item xs={4}>
  <FormControl fullWidth>
    <InputLabel
      id="ampm-select-label"
      sx={{
        fontSize: "14px",
        color: "#666",
        "&.Mui-focused": { color: "#333" }, 
      }}
    >
      AM/PM
    </InputLabel>
    <Select
      labelId="ampm-select-label"
      value={restartSettings.ampm}
      onChange={handleTimeChange("ampm")}
      label="AM/PM"
      variant="outlined"
      sx={{
        "& .MuiSelect-select": {
          textAlign: "center",
          fontWeight: 500,
          fontSize: "16px",
          display: "flex",
          alignItems: "center",
          padding: "16px", 
          justifyContent: "center", 
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "#ccc",
        },
      }}
    >
      <MenuItem value="AM">AM</MenuItem>
      <MenuItem value="PM">PM</MenuItem>
    </Select>
  </FormControl>
</Grid>

      </Grid>

      {/* Save Button */}
      <Grid
        item
        xs={12}
        container
        justifyContent="flex-end"
        sx={{
          marginTop: 3,
          position: "absolute",
          bottom: 16,
          right: 16,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveSettings}
        >
          Save
        </Button>
      </Grid>
    </Box>
  );
};

export default ForcefullyRestartSettings;
