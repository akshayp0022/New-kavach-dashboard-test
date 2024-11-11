import React, { useState } from "react";
import {
  Grid,
  TextField,
  Button,
  Snackbar,
  InputAdornment,
  IconButton,
  Tab,
  Tabs,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import AccessTime from "@mui/icons-material/AccessTime";
import dayjs from "dayjs";
import { useStatus } from "../../context/status";
import { useAuth } from "../../context/auth";

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
  // const { token } = useAuth();
  // console.log(token)

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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
      setSnackbarMessage("Data sent to WebSocket");
      setSnackbarOpen(true);
    }
  };
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
                fullWidth
                name="senderEmail"
                value={liveScreenshot.senderEmail}
                onChange={(e) => handleChange(e, "liveScreenshot")}
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Receiver Email"
                fullWidth
                name="receiverEmail"
                value={liveScreenshot.receiverEmail}
                onChange={(e) => handleChange(e, "liveScreenshot")}
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="CC Email"
                fullWidth
                name="ccEmail"
                value={liveScreenshot.ccEmail}
                onChange={(e) => handleChange(e, "liveScreenshot")}
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Password"
                fullWidth
                name="password"
                type="password"
                value={liveScreenshot.password}
                onChange={(e) => handleChange(e, "liveScreenshot")}
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button fullWidth onClick={handleTakeScreenshot}>
                Take Screenshot
              </Button>
            </Grid>
          </Grid>
        )}

        {/* If Employee is not active or idle */}
        {/* {selectedTab === 0  && (
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            style={{ height: "100%" }}
          >
            <Typography variant="h6" align="center" sx={{ mt: 6 }}>
              Employee is not active or idle.
            </Typography>
          </Grid>
        )} */}

        {/* Schedule Screenshot Tab Content */}
        {selectedTab === 1 && (
          <Grid container spacing={2} item>
            {/* Screenshot Interval */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Screenshot Interval"
                fullWidth
                name="screenshotInterval"
                value={scheduleScreenshot.screenshotInterval}
                onChange={(e) => handleChange(e, "scheduleScreenshot")}
                sx={{ width: "100%" }}
              />
            </Grid>

            {/* Screenshot Days */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Screenshot Days"
                fullWidth
                name="screenshotDays"
                value={scheduleScreenshot.screenshotDays}
                onChange={(e) => handleChange(e, "scheduleScreenshot")}
                sx={{ width: "100%" }}
              />
            </Grid>

            {/* Date Picker */}
            <Grid item xs={12} sm={6} md={4}>
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
            </Grid>

            {/* Start Time */}
            <Grid item xs={12} sm={6} md={4}>
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
            </Grid>

            {/* End Time */}
            <Grid item xs={12} sm={6} md={4}>
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
            </Grid>

            {/* Sender Email */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Sender Email"
                fullWidth
                name="senderEmail"
                value={scheduleScreenshot.senderEmail}
                onChange={(e) => handleChange(e, "scheduleScreenshot")}
                sx={{ width: "100%" }}
              />
            </Grid>

            {/* Receiver Email */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Receiver Email"
                fullWidth
                name="receiverEmail"
                value={scheduleScreenshot.receiverEmail}
                onChange={(e) => handleChange(e, "scheduleScreenshot")}
                sx={{ width: "100%" }}
              />
            </Grid>

            {/* CC Email */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="CC Email"
                fullWidth
                name="ccEmail"
                value={scheduleScreenshot.ccEmail}
                onChange={(e) => handleChange(e, "scheduleScreenshot")}
                sx={{ width: "100%" }}
              />
            </Grid>

            {/* Password */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Password"
                type="password"
                fullWidth
                name="password"
                value={scheduleScreenshot.password}
                onChange={(e) => handleChange(e, "scheduleScreenshot")}
                sx={{ width: "100%" }}
              />
            </Grid>

            {/* Schedule Screenshot Button */}
            <Grid item xs={12} sm={6} md={3}>
              <Button fullWidth onClick={handleSendScheduleToWebSocket}>
                Schedule Screenshot
              </Button>
            </Grid>
          </Grid>
        )}

        {/* Button Grid */}
        {/* <Grid container spacing={2} item>
          <Grid item xs={12} sm={6} md={3}>
            <Button fullWidth onClick={handleSendToWebSocket}>
              Send to WebSocket
            </Button>
          </Grid>
         
        </Grid> */}

        {/* Snackbar */}
        <Snackbar
          open={snackbarOpen}
          message={snackbarMessage}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        />
      </Grid>
    </LocalizationProvider>
  );
};

export default EmailSettings;
