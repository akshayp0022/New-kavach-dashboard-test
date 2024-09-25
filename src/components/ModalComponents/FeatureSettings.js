import React from "react";
import {
  FormGroup,
  FormControlLabel,
  Switch,
  Grid,
  Typography,
  Box,
} from "@mui/material";

const FeatureSettings = ({  }) => {
  const toggleOptions = {
    usbPolicy: "Restrict Access To USB Setting",
    taskManager: "Restrict Access To Windows Task Manager",
    rightClick: "Restrict Access To Right Click",
    systemSettings: "Restrict Access To System Settings",
    copyPaste: "Restrict Access To Copy & Paste",
    cameraSetting: "Restrict Access To Camera Setting",
    internetAccess : "Restrict Access to Internet access",
    gps : "Restrict Access to GPS",
  };

  const handleToggle = (option) => {
    // setSettings((prevSettings) => ({
    //   ...prevSettings,
    //   [option]: !prevSettings[option],
    // }));
  };

  return (
    <>
      <Typography
        variant="h6"
        component="div"
        sx={{
          mt: 0, 
          mb:1,
          textAlign: "center",
          fontWeight: "bold", 
            fontSize:'13px'
        }}
      >
        Enable the enhanced security option to provide extra protection for your rules and the filter.
      </Typography>
      <FormGroup>
        <Grid container spacing={1}>
          {Object.keys(toggleOptions).map((option) => (
            <Grid item xs={12} key={option}>
              <Box
                sx={{
                  display: 'flex',

                 justifyContent: 'space-between',

                 
                  justifyContent: 'space-between',

                  alignItems: 'center',
                  mb: 0, // Add margin between items
                }}
              >
                <Typography variant="body2">
                  {toggleOptions[option]}
                </Typography>
                <Switch
                //   checked={settings[option] || false}
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
