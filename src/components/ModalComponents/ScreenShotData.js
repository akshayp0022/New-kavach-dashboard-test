import React, { useEffect, useState } from "react";
import {
  Grid,
  TextField,
  Button,
  Tab,
  Tabs,
  Typography,
  CircularProgress,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useStatus } from "../../context/status";
import axios from "../../utils/endpoints";
import { useAuth } from "../../context/auth";
import { toast } from "react-toastify";

const EmailSettings = ({ currentEmployee }) => {
  const { statusData, socket } = useStatus();
  const employeeStatus =
    statusData[currentEmployee.employeeId]?.status || "deactivated";
  const showUI = employeeStatus === "active" || employeeStatus === "idle";

  const [liveScreenshot, setLiveScreenshot] = useState({
    senderEmail: "",
    receiverEmail: "",
    ccEmail: "",
    password: "",
  });

  const [scheduleScreenshot, setScheduleScreenshot] = useState({
    senderEmail: "",
    receiverEmail: "",
    ccEmail: "",
    password: "",
    screenshotInterval: "",
    screenshotDays: "",
    date: null,
    startTime: null,
    endTime: null,
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [selectedTab, setSelectedTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleScreenshotClick = async () => {
    setIsLoading(true); 
    await handleTakeScreenshot(); 
    setIsLoading(false); 
  };

  const handleChange = (e, settingType) => {
    const { name, value } = e.target;
    if (settingType === "liveScreenshot") {
      setLiveScreenshot((prevSettings) => ({
        ...prevSettings,
        [name]: value,
      }));
    } else if (settingType === "scheduleScreenshot") {
      setScheduleScreenshot((prevSettings) => ({
        ...prevSettings,
        [name]:
          name === "date" || name === "startTime" || name === "endTime"
            ? value
              ? value.toISOString()
              : null
            : value,
      }));
    }
  };

  const handleSendToWebSocket = () => {
    if (socket) {
      const dataToSend = {
        ...liveScreenshot,
        employeeId: currentEmployee?.employeeId,
      };
      console.log("Data to send to WS live: ", dataToSend);
      socket.emit("takeScreenshot", dataToSend);

      toast.success("Screenshot request sent successfully!");

      // setTimeout(() => {
      //   toast.error("Screenshot request took too long. Please try again.");
      // }, 5000);
    }
  };

  useEffect(() => {
    if (socket) {
      // Listen for screenshot error from the server
      socket.on('screenshotError', (errorMessage) => {
        toast.error(errorMessage || "An error occurred while processing the screenshot.");
      });
    }
  
    return () => {
      if (socket) {
        socket.off('screenshotError'); // Clean up the event listener on component unmount
      }
    };
  }, [socket]);

  const handleTakeScreenshot = () => {
    handleSendToWebSocket();
  };

  const handleSendScheduleToWebSocket = () => {
    if (socket) {
      const dataToSend = {
        ...scheduleScreenshot,
        date: scheduleScreenshot.date
          ? dayjs(scheduleScreenshot.date).format("DD-MM-YYYY")
          : null,
        startTime: scheduleScreenshot.startTime
          ? dayjs(scheduleScreenshot.startTime).format("HH:mm:ss")
          : null,
        endTime: scheduleScreenshot.endTime
          ? dayjs(scheduleScreenshot.endTime).format("HH:mm:ss")
          : null,
        employeeId: currentEmployee?.employeeId,
      };
      console.log("Data sent to WebSocket: ", dataToSend);

      socket.emit("sendEmailSettings", dataToSend);
      setSnackbarMessage("Scheduled data sent to WebSocket");
      setSnackbarOpen(true);
    }
  };

  const getEmailSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(
        `/email/${currentEmployee?.employeeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLiveScreenshot({
        senderEmail: data.data.senderEmail || "",
        receiverEmail: data.data.receiverEmail || "",
        ccEmail: data.data.ccEmail || "",
        password: data.data.password || "",
      });

      setScheduleScreenshot({
        senderEmail: data.data.senderEmail || "",
        receiverEmail: data.data.receiverEmail || "",
        ccEmail: data.data.ccEmail || "",
        password: data.data.password || "",
        screenshotInterval: data.data.screenshotInterval || "",
        screenshotDays: data.data.screenshotDays || "",
        date: data.data.date ? dayjs(data.data.date) : null,
        startTime: data.data.startTime ? dayjs(data.data.startTime) : null,
        endTime: data.data.endTime ? dayjs(data.data.endTime) : null,
      });
    } catch (err) {
      console.error("Error fetching email settings: ", err);
      toast.error(err.response.data.message)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && currentEmployee?.employeeId) {
      getEmailSettings();
    } else if (!token) {
      toast.error("Token not found");
    }
  }, [token, currentEmployee?.employeeId]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid
        container
        direction="column"
        spacing={2}
        sx={{ marginTop: 0, padding: { xs: 2, sm: 4, md: 6 } }}
      >
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Live Screenshot" />
          <Tab label="Schedule Screenshot" />
        </Tabs>

        {/* Live Screenshot Tab Content */}
        {selectedTab === 0 && (
          <Grid container spacing={2} item>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Sender Email"
                sx={{ width: "100%" }}
                name="senderEmail"
                value={liveScreenshot.senderEmail}
                onChange={(e) => handleChange(e, "liveScreenshot")}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Receiver Email"
                sx={{ width: "100%" }}
                name="receiverEmail"
                value={liveScreenshot.receiverEmail}
                onChange={(e) => handleChange(e, "liveScreenshot")}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="CC Email"
                sx={{ width: "100%" }}
                name="ccEmail"
                value={liveScreenshot.ccEmail}
                onChange={(e) => handleChange(e, "liveScreenshot")}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Password"
                sx={{ width: "100%" }}
                name="password"
                type="password"
                value={liveScreenshot.password}
                onChange={(e) => handleChange(e, "liveScreenshot")}
              />
            </Grid>

            {/* Take Screenshot Button */}
            <Grid
              item
              xs={12}
              sm={6}
              md={3}
              sx={{
                position: "absolute",
                bottom: 16,
                right: 16,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleScreenshotClick} 
                disabled={isLoading} 
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" /> 
                ) : (
                  "Take Screenshot"
                )}
              </Button>
            </Grid>
          </Grid>
        )}

        {/* Schedule Screenshot Tab Content */}
        {selectedTab === 1 && (
          <Grid container spacing={2} item>
            {/* 
    // TODO: Uncomment and complete the feature implementation once ready
    
    {/* Screenshot Interval */}
            {/* <Grid item xs={12} sm={6} md={4}>
      <TextField
        label="Screenshot Interval"
        sx={{ width: "100%" }}
        name="screenshotInterval"
        value={scheduleScreenshot.screenshotInterval}
        onChange={(e) => handleChange(e, "scheduleScreenshot")}
      />
    </Grid> */}

            {/* Screenshot Days */}
            {/* <Grid item xs={12} sm={6} md={4}>
      <TextField
        label="Screenshot Days"
        sx={{ width: "100%" }}
        name="screenshotDays"
        value={scheduleScreenshot.screenshotDays}
        onChange={(e) => handleChange(e, "scheduleScreenshot")}
      />
    </Grid> */}

            {/* Date Picker */}
            {/* <Grid item xs={12} sm={6} md={4}>
      <DatePicker
        label="Date"
        value={scheduleScreenshot.date}
        onChange={(newValue) =>
          setScheduleScreenshot((prevSettings) => ({
            ...prevSettings,
            date: newValue,
          }))
        }
        sx={{ width: "100%" }}
        renderInput={(params) => <TextField {...params} fullWidth />}
        minDate={dayjs()}
      />
    </Grid> */}

            {/* Start Time */}
            {/* <Grid item xs={12} sm={6} md={4}>
      <MobileTimePicker
        label="Start Time"
        value={scheduleScreenshot.startTime}
        onChange={(newValue) =>
          setScheduleScreenshot((prevSettings) => ({
            ...prevSettings,
            startTime: newValue,
          }))
        }
        sx={{ width: "100%" }}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" disabled>
                    <AccessTime />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        )}
      />
    </Grid> */}

            {/* End Time */}
            {/* <Grid item xs={12} sm={6} md={4}>
      <MobileTimePicker
        label="End Time"
        value={scheduleScreenshot.endTime}
        onChange={(newValue) =>
          setScheduleScreenshot((prevSettings) => ({
            ...prevSettings,
            endTime: newValue,
          }))
        }
        sx={{ width: "100%" }}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" disabled>
                    <AccessTime />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        )}
      />
    </Grid> */}

            {/* Sender Email */}
            {/* <Grid item xs={12} sm={6} md={4}>
      <TextField
        label="Sender Email"
        sx={{ width: "100%" }}
        name="senderEmail"
        value={scheduleScreenshot.senderEmail}
        onChange={(e) => handleChange(e, "scheduleScreenshot")}
      />
    </Grid> */}

            {/* Receiver Email */}
            {/* <Grid item xs={12} sm={6} md={4}>
      <TextField
        label="Receiver Email"
        sx={{ width: "100%" }}
        name="receiverEmail"
        value={scheduleScreenshot.receiverEmail}
        onChange={(e) => handleChange(e, "scheduleScreenshot")}
      />
    </Grid> */}

            {/* CC Email */}
            {/* <Grid item xs={12} sm={6} md={4}>
      <TextField
        label="CC Email"
        sx={{ width: "100%" }}
        name="ccEmail"
        value={scheduleScreenshot.ccEmail}
        onChange={(e) => handleChange(e, "scheduleScreenshot")}
      />
    </Grid> */}

            {/* Password */}
            {/* <Grid item xs={12} sm={6} md={4}>
      <TextField
        label="Password"
        type="password"
        sx={{ width: "100%" }}
        name="password"
        value={scheduleScreenshot.password}
        onChange={(e) => handleChange(e, "scheduleScreenshot")}
      />
    </Grid> */}

            {/* Schedule Screenshot Button */}
            {/* <Grid item xs={12} sm={6} md={3} sx={{
      position: "absolute",
      bottom: 16,
      right: 16,
      display: "flex",
      alignItems: "center",
    }}>
      <Button fullWidth variant="contained"
      color="primary" onClick={handleSendScheduleToWebSocket}>
        Schedule Screenshot
      </Button>
    </Grid> */}

            {/* Placeholder for "Under Progress" message */}
            <Grid item xs={12}>
              <Typography variant="h6" color="textSecondary" align="center">
                This feature is currently under progress. Please check back
                later.
              </Typography>
            </Grid>
          </Grid>
        )}
      </Grid>
    </LocalizationProvider>
  );
};

export default EmailSettings;
