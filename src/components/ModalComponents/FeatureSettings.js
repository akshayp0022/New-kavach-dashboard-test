import React, { useState, useEffect } from "react";
import {
  FormGroup,
  Switch,
  Grid,
  Typography,
  Box,
} from "@mui/material";
import axios from "../../utils/endpoints";

const FeatureSettings = ({ currentEmployee }) => {
  const toggleOptions = {
    usbPolicy: "Restrict Access To USB Setting",
    taskManager: "Restrict Access To Windows Task Manager",
    rightClick: "Restrict Access To Right Click",
    systemSettings: "Restrict Access To System Settings",
    copyPaste: "Restrict Access To Copy & Paste",
    cameraSetting: "Restrict Access To Camera Setting",
    internetAccess: "Restrict Access To Internet access",
    gps: "Restrict Access to GPS",
  };

  const token = sessionStorage.getItem("token") || undefined;

  const [settings, setSettings] = useState({
    usbPolicy: false,
    taskManager: false,
    rightClick: false,
    systemSettings: false,
    copyPaste: false,
    cameraSetting: false,
    internetAccess: false,
    gps: false,
  });

  useEffect(() => {
    if (currentEmployee?.featureSettings) {
      setSettings({
        usbPolicy: currentEmployee.featureSettings.usbPolicy || false,
        taskManager: currentEmployee.featureSettings.taskManager || false,
        rightClick: currentEmployee.featureSettings.rightClick || false,
        systemSettings: currentEmployee.featureSettings.systemSettings || false,
        copyPaste: currentEmployee.featureSettings.copyPaste || false,
        cameraSetting: currentEmployee.featureSettings.cameraSetting || false,
        internetAccess: currentEmployee.featureSettings.internetAccess || false,
        gps: currentEmployee.featureSettings.gps || false,
      });
    }
  }, [currentEmployee]);

  const handleToggle = async (option) => {
    const newValue = !settings[option]; 

    setSettings((prevSettings) => ({
      ...prevSettings,
      [option]: newValue,
    }));

    try {
      await axios.put(
        `/features/${currentEmployee.employeeId}`,
        {
          [option]: newValue,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error updating feature settings:", error);
      setSettings((prevSettings) => ({
        ...prevSettings,
        [option]: !newValue,
      }));
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
                  }}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </FormGroup>
    </>
  );
};

export default FeatureSettings;
