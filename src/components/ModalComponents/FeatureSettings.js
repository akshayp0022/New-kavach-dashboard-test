import React, { useState, useEffect } from "react";
import {
  FormGroup,
  Switch,
  Grid,
  Typography,
  Box,
  Button,
} from "@mui/material";
import axios from "../../utils/endpoints";
import { useEmployeeContext } from "../../context/employee";
import { toast } from "react-toastify";
const FeatureSettings = ({ currentEmployee }) => {
  const toggleOptions = {
    usbPolicy: "Restrict Access To USB Setting",
    taskManager: "Restrict Access To Windows Task Manager",
    rightClick: "Restrict Access To Right Click",
    systemSettings: "Restrict Access To System Settings",
    copyPaste: "Restrict Access To Copy & Paste",
    // cameraSetting: "Restrict Access To Camera Setting",
    internetAccess: "Restrict Access To Internet access",
    // gps: "Restrict Access to GPS",
  };

  const { fetchEmployees } = useEmployeeContext();
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
  const [isUpdated, setIsUpdated] = useState(false); 
  

  useEffect(() => {
    if (currentEmployee && currentEmployee.featureSettings) {
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

  const handleToggle = (option) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [option]: !prevSettings[option],
    }));
    
    setIsUpdated(true); 
  };

  const handleSave = async () => {
    try {
     
      const response = await axios.put(
        `/features/${currentEmployee.employeeId}`,
        settings,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log("Feature settings updated:", response.data.data);
  
      setSettings({
        usbPolicy: response.data.data.usbPolicy,
        taskManager: response.data.data.taskManager,
        rightClick: response.data.data.rightClick,
        systemSettings: response.data.data.systemSettings,
        copyPaste: response.data.data.copyPaste,
        cameraSetting: response.data.data.cameraSetting,
        internetAccess: response.data.data.internetAccess,
        gps: response.data.data.gps,
      });
  
      setIsUpdated(false); 
      fetchEmployees();
      toast.success("Feature settings updated successfully!");
    } catch (error) {
      console.error("Error updating feature settings:", error);
      toast.error("Error updating feature settings.");
    }
  };
  
  

  if (!currentEmployee || !currentEmployee.featureSettings) {
    return <Typography>Loading feature settings...</Typography>;
  }

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
        >
          Save
        </Button>
      </Box>
    </>
  );
};

export default FeatureSettings;
