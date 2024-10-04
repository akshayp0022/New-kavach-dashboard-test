import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Button,
  Snackbar,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import AccessTime from "@mui/icons-material/AccessTime";
import dayjs from "dayjs";
import { useEmailContext } from "../../context/email";
import axios from "axios";
import { useAuth } from "../../context/auth";
import { fetchEmailSettings } from "../../api/email";
const EmailSettings = ({ currentEmployee }) => {
  const {
    // fetchEmailSettings,
    updateEmailSettings,
    deleteEmailSettings,
    createEmailSettings,
  } = useEmailContext();
  const [emailSettings, setEmailSettings] = useState({
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

  const { token } = useAuth();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const fetchEmailSettingsHandler = async () => {
    const settings = await fetchEmailSettings(currentEmployee?.employeeId);

    if (settings) {
      setEmailSettings({
        senderEmail: settings.senderEmail || "",
        receiverEmail: settings.receiverEmail || "",
        ccEmail: settings.ccEmail || "",
        password: settings.password || "",
        screenshotInterval: settings.screenshotInterval || "",
        screenshotDays: settings.screenshotDays || "",
        date: settings.date ? dayjs(settings.date, "DD-MM-YYYY") : null,
        startTime: settings.startTime
          ? dayjs(settings.startTime, "HH:mm:ss")
          : null,
        endTime: settings.endTime ? dayjs(settings.endTime, "HH:mm:ss") : null,
      });
    }
  };

  // const fetchSettings = async () => {
  //   try {
  //     if (currentEmployee?.employeeId) {
  //       const response = await fetchEmailSettings(currentEmployee.employeeId);
  //       // console.log("response: ", response);

  //       if (response?.message) {
  //         setSnackbarMessage(response.message);
  //         setSnackbarOpen(true);
  //         console.log(response.message);

  //         return;
  //       }

  //       if (response) {
  //         const settings = response;

  //         setEmailSettings({
  //           senderEmail: settings.senderEmail || "",
  //           receiverEmail: settings.receiverEmail || "",
  //           ccEmail: settings.ccEmail || "",
  //           password: settings.password || "",
  //           screenshotInterval: settings.screenshotInterval || "",
  //           screenshotDays: settings.screenshotDays || "",
  //           date: settings.date ? dayjs(settings.date, "DD-MM-YYYY") : null,
  //           startTime: settings.startTime
  //             ? dayjs(settings.startTime, "HH:mm:ss")
  //             : null,
  //           endTime: settings.endTime
  //             ? dayjs(settings.endTime, "HH:mm:ss")
  //             : null,
  //         });
  //       } else {
  //         console.error("Error: No data received from API");
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error fetching email settings:", error);
  //   }
  // };

  const createEmailSettingsHandler = async () => {
    try {
      if (currentEmployee?.employeeId) {
        const response = await createEmailSettings(
          currentEmployee.employeeId,
          emailSettings
        );
        console.log("Email settings created response: ", response);

        if (response) {
          await fetchEmailSettings(currentEmployee.employeeId);
        } else {
          console.error("Error: No data received from API");
        }
      } else {
        console.warn("No employee selected to create email settings");
      }
    } catch (error) {
      console.error("Error creating email settings: ", error);
    }
  };

  useEffect(() => {
    // fetchSettings();
    if (currentEmployee?.employeeId) {
      fetchEmailSettingsHandler();
    }
  }, [currentEmployee?.employeeId]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmailSettings((prevSettings) => ({
      ...prevSettings,
      [name]: value,
    }));
  };
  // const createEmailSettingsHandler = async () => {
  //   try {
  //     if (currentEmployee?.employeeId) {
  //       // Call API to create email settings
  //       const response = await createEmailSettings(
  //         currentEmployee.employeeId,
  //         emailSettings
  //       );
  //       console.log("Email settings created response: ", response);

  //       // Optionally refetch the email settings to ensure state is up-to-date
  //       const updatedSettings = await fetchEmailSettings(
  //         currentEmployee.employeeId
  //       );

  //       // Check if email settings are returned and update the state
  //       if (updatedSettings) {
  //         setEmailSettings({
  //           senderEmail: updatedSettings.senderEmail || "",
  //           receiverEmail: updatedSettings.receiverEmail || "",
  //           ccEmail: updatedSettings.ccEmail || "",
  //           password: updatedSettings.password || "",
  //           screenshotInterval: updatedSettings.screenshotInterval || "",
  //           screenshotDays: updatedSettings.screenshotDays || "",
  //           date: updatedSettings.date
  //             ? dayjs(updatedSettings.date, "DD-MM-YYYY")
  //             : null,
  //           startTime: updatedSettings.startTime
  //             ? dayjs(updatedSettings.startTime, "HH:mm:ss")
  //             : null,
  //           endTime: updatedSettings.endTime
  //             ? dayjs(updatedSettings.endTime, "HH:mm:ss")
  //             : null,
  //         });
  //         setSnackbarMessage("Email settings created successfully");
  //       } else {
  //         setSnackbarMessage(
  //           "Failed to fetch updated email settings after creation"
  //         );
  //       }

  //       setSnackbarOpen(true);
  //     }
  //   } catch (error) {
  //     console.error("Error creating email settings:", error);
  //     setSnackbarMessage("Failed to create email settings");
  //     setSnackbarOpen(true);
  //   }
  // };

  const handleUpdate = async () => {
    try {
      if (currentEmployee?.employeeId) {
        await updateEmailSettings(currentEmployee.employeeId, emailSettings);

        const updatedSettings = await fetchEmailSettings(
          currentEmployee.employeeId
        );
        console.log("updatedSettings: ", updatedSettings.senderEmail);

        if (updatedSettings) {
          setEmailSettings({
            senderEmail: updatedSettings.senderEmail || "",
            receiverEmail: updatedSettings.receiverEmail || "",
            ccEmail: updatedSettings.ccEmail || "",
            password: updatedSettings.password || "",
            screenshotInterval: updatedSettings.screenshotInterval || "",
            screenshotDays: updatedSettings.screenshotDays || "",
            date: updatedSettings.date
              ? dayjs(updatedSettings.date, "DD-MM-YYYY")
              : null,
            startTime: updatedSettings.startTime
              ? dayjs(updatedSettings.startTime, "HH:mm:ss")
              : null,
            endTime: updatedSettings.endTime
              ? dayjs(updatedSettings.endTime, "HH:mm:ss")
              : null,
          });

          setSnackbarMessage("Email settings updated successfully");
          setSnackbarOpen(true);
        } else {
          console.error("Error: No updated settings received from API");
        }
      }
    } catch (error) {
      console.error("Error updating email settings:", error.message);
    }
  };

  const handleSendToWebSocket = () => {
    setSnackbarMessage("Send to WebSocket action triggered");
    setSnackbarOpen(true);
  };

  const handleDelete = async () => {
    if (!currentEmployee?.employeeId) {
      setSnackbarMessage("No employee selected for deletion");
      setSnackbarOpen(true);
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete the email settings?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteEmailSettings(currentEmployee.employeeId);
      setSnackbarMessage("Email settings deleted successfully");
    } catch (error) {
      console.error("Error deleting email settings:", error);
      setSnackbarMessage("Failed to delete email settings");
    } finally {
      setSnackbarOpen(true);
    }
  };

  const handleTakeScreenshot = () => {
    setSnackbarMessage("Take Screenshot action triggered");
    setSnackbarOpen(true);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid container direction="column" spacing={2} sx={{ marginTop: 0 }}>
        <Grid container spacing={2} item>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Sender Email"
              fullWidth
              name="senderEmail"
              value={emailSettings.senderEmail}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Receiver Email"
              fullWidth
              name="receiverEmail"
              value={emailSettings.receiverEmail}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="CC Email"
              fullWidth
              name="ccEmail"
              value={emailSettings.ccEmail}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6} sm={6}>
            <TextField
              label="Password"
              fullWidth
              name="password"
              type="password"
              value={emailSettings.password}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6} sm={6}>
            <TextField
              label="Screenshot Interval"
              fullWidth
              name="screenshotInterval"
              value={emailSettings.screenshotInterval}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6} sm={6}>
            <TextField
              label="Screenshot Days"
              fullWidth
              name="screenshotDays"
              value={emailSettings.screenshotDays}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6} sm={4}>
            <DatePicker
              label="Date"
              value={emailSettings.date}
              onChange={(newValue) =>
                setEmailSettings((prevSettings) => ({
                  ...prevSettings,
                  date: newValue,
                }))
              }
              renderInput={(params) => <TextField {...params} fullWidth />}
              minDate={dayjs()} // Disable previous dates
            />
          </Grid>
          <Grid item xs={6} sm={4}>
            <MobileTimePicker
              label="Start Time"
              value={emailSettings.startTime}
              onChange={(newValue) =>
                setEmailSettings((prevSettings) => ({
                  ...prevSettings,
                  startTime: newValue,
                }))
              }
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
              ampm={false}
              views={["hours", "minutes", "seconds"]}
            />
          </Grid>
          <Grid item xs={6} sm={4}>
            <MobileTimePicker
              label="End Time"
              value={emailSettings.endTime}
              onChange={(newValue) =>
                setEmailSettings((prevSettings) => ({
                  ...prevSettings,
                  endTime: newValue,
                }))
              }
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
              ampm={false}
              views={["hours", "minutes", "seconds"]}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} item>
          <Grid item xs={4}>
            <Button fullWidth onClick={handleUpdate}>
              Update
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Button fullWidth onClick={handleSendToWebSocket}>
              Send to WebSocket
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Button fullWidth onClick={handleDelete}>
              Delete
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Button fullWidth onClick={handleTakeScreenshot}>
              Take Screenshot
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Button fullWidth onClick={createEmailSettingsHandler}>
              save
            </Button>
          </Grid>
        </Grid>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          message={snackbarMessage}
        />
      </Grid>
    </LocalizationProvider>
  );
};

export default EmailSettings;
