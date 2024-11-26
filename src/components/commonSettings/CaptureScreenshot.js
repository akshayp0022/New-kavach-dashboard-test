import React, { useState } from "react";
import { TextField, Button, Box, InputAdornment, IconButton } from "@mui/material";
import axios from "axios";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const CaptureScreenshot = () => {
  const [formData, setFormData] = useState({
    receiverEmail: "",
    senderEmail: "",
    ccEmail: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      const response = await axios.post(
        "/api/capture-screenshot-settings",
        formData
      );
      alert("Settings saved successfully!");
    } catch (error) {
      alert("Error saving settings: " + error.message);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        padding: "20px",
      }}
    >
      <div>
        <h2>Capture Screenshot Settings</h2>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            maxWidth: "800px",
            marginTop: "20px",
          }}
        >
          <TextField
            label="Sender Email"
            sx={{ flex: "1 1 45%" }}
            name="senderEmail"
            value={formData.senderEmail}
            onChange={handleChange}
          />
          <TextField
            label="Receiver Email"
            sx={{ flex: "1 1 45%" }}
            name="receiverEmail"
            value={formData.receiverEmail}
            onChange={handleChange}
          />

          <TextField
            label="CC Email"
            sx={{ flex: "1 1 45%" }}
            name="ccEmail"
            value={formData.ccEmail}
            onChange={handleChange}
          />
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            sx={{ flex: "1 1 45%" }}
            name="password"
            value={formData.password}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </div>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSave}
        sx={{
          alignSelf: "flex-end",
          marginTop: "20px",
          width: "120px",
          marginRight: "20px",
        }}
      >
        Save
      </Button>
    </Box>
  );
};

export default CaptureScreenshot;
