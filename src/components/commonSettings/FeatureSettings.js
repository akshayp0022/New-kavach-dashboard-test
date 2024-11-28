import React, { useState } from "react";
import { FormGroup, Switch, Grid, Typography, Box, Button } from "@mui/material";
import axios from "../../utils/endpoints";
import { toast } from "react-toastify";
import { useAuth } from "../../context/auth";

const FeatureSettings = () => {
  const toggleOptions = {
    usbPolicy: "Restrict Access To USB Setting",
    taskManager: "Restrict Access To Windows Task Manager",
    rightClick: "Restrict Access To Right Click",
    systemSettings: "Restrict Access To System Settings",
    copyPaste: "Restrict Access To Copy & Paste",
    internetAccess: "Restrict Access To Internet access",
  };

  const [settings, setSettings] = useState({
    usbPolicy: false,
    taskManager: false,
    rightClick: false,
    systemSettings: false,
    copyPaste: false,
    internetAccess: false,
  });

  const [isUpdated, setIsUpdated] = useState(false);
  const { token } = useAuth();

  const handleToggle = (option) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [option]: !prevSettings[option],
    }));
    setIsUpdated(true);
  };

  const handleSave = async () => {
    try {
      await axios.put("/manage/updateAll", settings, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }); 
      toast.success("Feature settings saved for all users!");
      setIsUpdated(false);
    } catch (error) {
      console.error("Error saving feature settings:", error);
      toast.error("Error saving feature settings.");
    }
  };

  return (
    <>
      <Typography
        variant="h6"
        component="div"
        sx={{
          mt: 0,
          mb: 1,
          mr: 10,
          textAlign: "start",
          fontWeight: "bold",
          fontSize: "13px",
        }}
      >
        Enable the enhanced security option to provide extra protection for your
        rules and the filter.
      </Typography>
      <FormGroup>
        <Grid container spacing={1}>
          {Object.keys(toggleOptions).map((option) => (
            <Grid item xs={12} key={option}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 0,
                }}
              >
                <Typography variant="body2">{toggleOptions[option]}</Typography>
                <Switch
                  checked={settings[option]}
                  onChange={() => handleToggle(option)}
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": {
                      color: "#2689ff",
                    },
                    "& .MuiSwitch-track": {
                      backgroundColor: "#b0d1d1",
                    },
                    marginRight: 10,
                  }}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </FormGroup>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mt: 18,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          disabled={!isUpdated}
          onClick={handleSave}
          sx={{ mr: 8, mt: 6 }}
        >
          Save
        </Button>
      </Box>
    </>
  );
};

export default FeatureSettings;
