import React, { useState, useEffect } from "react";
import {
  Tabs,
  Tab,
  Box,
  Grid,
  TextField,
  IconButton,
  InputAdornment,
  ListItem,
  Button,
  Typography,
  FormControlLabel,
  Switch,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import axios from "../../utils/endpoints";
import { toast } from "react-toastify";

const WebsiteSetting = ({ currentEmployee }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [isEditingWhite, setIsEditingWhite] = useState(false);
  const [whiteListing, setWhiteListing] = useState({
    proxyAddress: "none",
    port: "",
    exception: [],
    enabled: false,
  });
  const [blackListing, setBlackListing] = useState([""]);
  const [newWebsite, setNewWebsite] = useState("");
  const token = sessionStorage.getItem("token") || undefined;

  useEffect(() => {
    if (currentEmployee) {
      const { proxyAddress, port, exception, enabled } =
        currentEmployee.featureSettings.whiteListing;
      setWhiteListing({
        proxyAddress: proxyAddress || "none",
        port: port || "",
        exception: exception || [""],
        enabled: enabled === "true" || enabled === true,
      });
    }
  }, [currentEmployee]);

  //black listing
  const handleAddNewWebsite = async () => {
    if (newWebsite.trim() === "") return;
    try {
      const response = await axios.put(
        `/features/${currentEmployee.employeeId}`,
        {
          websiteBlocker: [...blackListing, newWebsite],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBlackListing((prev) => [...prev, newWebsite]);
      setNewWebsite("");
      toast.success("Website Blocked Successfully!");
      console.log("Successfully added new website:", response.data);
    } catch (error) {
      console.error("Error adding new website:", error.message);
      toast.error("Failed to Block Website. Please try again.");
    }
  };

  const handleRemoveWebsite = async (website) => {
    try {
      const updatedBlackListing = blackListing.filter(
        (item) => item !== website
      );
      await axios.put(
        `/features/${currentEmployee.employeeId}`,
        {
          websiteBlocker: updatedBlackListing,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBlackListing(updatedBlackListing);
    } catch (error) {
      console.error("Error deleting website:", error.message);
    }
  };

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  const handleInputChangeWhite = (field) => (event) => {
    setWhiteListing({ ...whiteListing, [field]: event.target.value });
  };

  const handleExceptionChange = (index) => (event) => {
    const updatedExceptions = [...whiteListing.exception];
    updatedExceptions[index] = event.target.value;
    setWhiteListing({ ...whiteListing, exception: updatedExceptions });
  };

  const handleToggleChange = (event) => {
    setWhiteListing({
      ...whiteListing,
      enabled: event.target.checked,
      proxyAddress: event.target.checked ? "127.0.0.1" : "none",
    });
  };

  const handleAddException = () => {
    setWhiteListing((prev) => ({
      ...prev,
      exception: [...prev.exception, ""],
    }));
  };

  const handleRemoveException = (index) => {
    const updatedExceptions = whiteListing.exception.filter(
      (_, i) => i !== index
    );
    setWhiteListing({ ...whiteListing, exception: updatedExceptions });
  };

  const handleEditClickWhite = () => {
    setIsEditingWhite(true);
  };

  // handleEditClickCancle= () => {
  //   setIsEditingWhite(false);
  // }
  useEffect(() => {
    if (currentEmployee) {
      setBlackListing(currentEmployee.featureSettings.websiteBlocker || []);
    }
  }, [currentEmployee]);

  const handleSaveWhite = async () => {
    try {
      await axios.put(
        `/features/${currentEmployee.employeeId}`,
        {
          whiteListing: whiteListing,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("White listing updated successfully!");
      setIsEditingWhite(false);
    } catch (error) {
      console.error("Error updating whiteListing:", error.message);
      toast.error("Failed to update whiteListing. Please try again.");
    }
  };

  return (
    <Box>
      <Tabs value={tabIndex} onChange={handleTabChange} variant="fullWidth">
        <Tab label="White Listing" />
        <Tab label="Black Listing" />
      </Tabs>

      {tabIndex === 0 && (
        <Box p={3} mt={6}>
          <Paper
            elevation={3}
            sx={{ p: 3, borderRadius: "8px", position: "relative" }}
          >
            {isEditingWhite && (
              <IconButton
                sx={{ position: "absolute", top: 8, right: 8 }}
                onClick={() => setIsEditingWhite(false)} 
              >
                <CloseIcon />
              </IconButton>
            )}

            <Grid container spacing={3}>
              {/* <Grid item xs={12} sm={5}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Proxy Address</InputLabel>
                  <Select
                    value={whiteListing.proxyAddress}
                    onChange={handleInputChangeWhite("proxyAddress")}
                    disabled={!isEditingWhite}
                    sx={{
                      borderRadius: "8px",
                      "&.Mui-error": {
                        borderColor: "error.main",
                      },
                    }}
                  >
                    <MenuItem value="none">None</MenuItem>
                    <MenuItem value={whiteListing.proxyAddress}>
                      {whiteListing.proxyAddress}
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid> */}

              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Port"
                  variant="outlined"
                  value={whiteListing.port}
                  onChange={handleInputChangeWhite("port")}
                  disabled={!isEditingWhite}
                  sx={{
                    borderRadius: "8px",
                    "&.Mui-error": {
                      borderColor: "error.main",
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={whiteListing.enabled}
                      onChange={handleToggleChange}
                      disabled={!isEditingWhite}
                      color="primary"
                    />
                  }
                  label={whiteListing.enabled ? "Enabled" : "Disabled"}
                  labelPlacement="end"
                />
              </Grid>

              {whiteListing.exception.map((exception, index) => (
                <Grid item xs={12} key={index}>
                  <ListItem
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      borderRadius: "8px",
                      padding: "8px",
                      marginBottom: "8px",
                    }}
                  >
                    <TextField
                      fullWidth
                      label={`Exception ${index + 1}`}
                      variant="outlined"
                      value={exception}
                      onChange={handleExceptionChange(index)}
                      disabled={!isEditingWhite}
                      sx={{ borderRadius: "8px" }}
                    />
                    {isEditingWhite && (
                      <IconButton
                        onClick={() => handleRemoveException(index)}
                        edge="end"
                        color="error"
                      >
                        <CloseIcon />
                      </IconButton>
                    )}
                  </ListItem>
                </Grid>
              ))}

              {isEditingWhite && (
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={handleAddException}
                    sx={{ borderRadius: "8px" }}
                  >
                    Add Exception
                  </Button>
                </Grid>
              )}
            </Grid>

            <Box mt={4} display="flex" justifyContent="flex-end">
              {isEditingWhite ? (
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleSaveWhite}
                  sx={{ borderRadius: "8px" }}
                >
                  Save
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleEditClickWhite}
                  sx={{ borderRadius: "8px" }}
                >
                  Edit
                </Button>
              )}
            </Box>
          </Paper>
        </Box>
      )}

      {tabIndex === 1 && (
        <Box p={2} mt={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: "8px" }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={`Add Website`}
                  variant="outlined"
                  value={newWebsite}
                  onChange={(e) => setNewWebsite(e.target.value)}
                  sx={{
                    boxShadow: "0px 1px 3px rgba(0,0,0,0.2)",
                    borderRadius: "8px",
                    marginTop: "16px",
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {/* <IconButton onClick={handleAddNewWebsite}>
                          <AddIcon color="primary"/>
                        </IconButton> */}
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleAddNewWebsite}
                          sx={{ borderRadius: "8px" }}
                        >
                          Save
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Display existing blacklisted websites with Cards */}
              {blackListing.length > 0 &&
                blackListing.map((field, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Paper
                      elevation={2}
                      sx={{
                        p: 2,
                        borderRadius: "8px",
                        bgcolor: "#f9f9f9",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body1" sx={{ flexGrow: 1 }}>
                        {field}
                      </Typography>
                      <IconButton
                        color="error"
                        onClick={() => handleRemoveWebsite(field)}
                      >
                        <CloseIcon />
                      </IconButton>
                    </Paper>
                  </Grid>
                ))}
            </Grid>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default WebsiteSetting;
