import React, { useState } from 'react';
import { Grid, TextField, Button, Snackbar, InputAdornment, IconButton } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import AccessTime from '@mui/icons-material/AccessTime';
import dayjs from 'dayjs';


const EmailSettings = () => {
  const [emailSettings, setEmailSettings] = useState({
    senderEmail: '',
    receiverEmail: '',
    ccEmail: '',
    password: '',
    screenshotInterval: '',
    screenshotDays: '',
    date: null,
    startTime: null,
    endTime: null,
  });
  
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

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

  // Placeholder functions for button actions
  const handleUpdate = () => {
    setSnackbarMessage('Update action triggered');
    setSnackbarOpen(true);
  };

  const handleSendToWebSocket = () => {
    setSnackbarMessage('Send to WebSocket action triggered');
    setSnackbarOpen(true);
  };

  const handleDelete = () => {
    setSnackbarMessage('Delete action triggered');
    setSnackbarOpen(true);
  };

  const handleTakeScreenshot = () => {
    setSnackbarMessage('Take Screenshot action triggered');
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
              views={['hours', 'minutes', 'seconds']}
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
              views={['hours', 'minutes', 'seconds']}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} item>
          <Grid item xs={4}>
            <Button fullWidth onClick={handleUpdate}>Update</Button>
          </Grid>
          <Grid item xs={4}>
            <Button fullWidth onClick={handleSendToWebSocket}>Send to WebSocket</Button>
          </Grid>
          <Grid item xs={4}>
            <Button fullWidth onClick={handleDelete}>Delete</Button>
          </Grid>
          <Grid item xs={4}>
            <Button fullWidth onClick={handleTakeScreenshot}>Take Screenshot</Button>
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
