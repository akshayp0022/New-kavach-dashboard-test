import React, { useState } from "react";
import {
  Tabs,
  Tab,
  Box,
  Grid,
  TextField,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

const WebsiteSetting = ({currentEmployee}) => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  // Placeholder data for UI purposes
  const whiteListing = { proxyAddress: "", port: "", exception: [] };
  const blackListing = { websiteBlocker: [] };

  return (
    <Box>
      <Tabs value={tabIndex} onChange={handleTabChange}>
        <Tab label="White Listing" />
        <Tab label="Black Listing" />
      </Tabs>

      {tabIndex === 0 && (
        <Box p={2}>
          {/* White Listing UI */}
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}> {/* Increased width for better spacing */}
              <TextField
                fullWidth
                label="Proxy Address"
                variant="outlined"
                value={currentEmployee?.featureSettings?.whiteListing.proxyAddress}
                sx={{ width: "200px", height: "40px" }}  
              />
            </Grid>
            <Grid item xs={12} sm={3}> {/* Adjusted width for port */}
              <TextField
                fullWidth
                label="Port"
                variant="outlined"
                value={currentEmployee?.featureSettings?.whiteListing.port}
                sx={{ width: "200px", height: "40px" }}  
              />
            </Grid>
            <Grid item xs={12} sm={5}> {/* Remaining space for Add Exception */}
              <TextField
                fullWidth
                label="Add Exception"
                variant="outlined"
                sx={{ width: "200px", height: "40px" }}  
                // value={currentEmployee?.featureSettings?.whiteListing.exception}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton color="primary" aria-label="add">
                        <AddIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {whiteListing.exception.length > 0 && (
              <Grid item xs={12}>
                <Box
                  sx={{
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    padding: 0,
                    backgroundColor: "#f9f9f9",
                    maxHeight: "250px",
                    overflowY: "auto",
                  }}
                >
                  <List>
                    {whiteListing.exception.map((exception, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={exception} />
                        <IconButton aria-label="delete">
                          <CloseIcon />
                        </IconButton>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      )}

      {tabIndex === 1 && (
        <Box p={2}>
          {/* Black Listing UI */}
          <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
  <TextField
    fullWidth
    label="Add Website"
    variant="outlined"
    sx={{
      width: { xs: '100%', sm: '80%', md: '60%' }, 
    }}
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          <IconButton>
            <AddIcon />
          </IconButton>
        </InputAdornment>
      ),
    }}
  />
</Grid>

            <Grid item xs={12}>
              <Paper
                elevation={1}
                sx={{
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  maxHeight: "270px",
                  overflowY: "auto",
                }}
              >
                {blackListing.websiteBlocker.length === 0 ? (
                  <Typography
                    variant="body2"
                    sx={{
                      padding: "8px",
                      textAlign: "center",
                      color: "#686D76",
                    }}
                  >
                    No websites blocked.
                  </Typography>
                ) : (
                  <List>
                    {blackListing.websiteBlocker.map((website, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={website} />
                        <IconButton aria-label="delete">
                          <CloseIcon />
                        </IconButton>
                      </ListItem>
                    ))}
                  </List>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default WebsiteSetting;
