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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import axios from "../../utils/endpoints";

const WebsiteSetting = ({ currentEmployee }) => {
  const [tabIndex, setTabIndex] = useState(0);

  const [isEditingWhite, setIsEditingWhite] = useState(false);
  const [isEditingBlack, setIsEditingBlack] = useState(false); 
  const [whiteListing, setWhiteListing] = useState({
    proxyAddress: "",
    port: "",
    exception: [],
  });

  const [blackListing, setBlackListing] = useState([""]);

  const token = sessionStorage.getItem("token") || undefined;

  useEffect(() => {
    if (currentEmployee) {
      const { proxyAddress, port, exception } =
        currentEmployee.featureSettings.whiteListing;

      setWhiteListing({
        proxyAddress: proxyAddress,
        port: port,
        exception: exception[0] || [""],
      });
    }
  }, [currentEmployee]);

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

  const handleEditClickBlack = () => {
    setIsEditingBlack(true);
  };
  
  // Handler for saving blacklisting changes
  const handleSaveBlack = () => {
    // Add your save logic here
    setIsEditingBlack(false);
  };
  useEffect(() => {
    if (currentEmployee) {
      setBlackListing(currentEmployee.featureSettings.websiteBlocker || []);
    }
  }, [currentEmployee]);
  const handleSaveWhite = async () => {
    try {
      const response = await axios.put(
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
    } catch (error) {
      console.error("Error updating whiteListing:", error.message);
    }
  };
  // console.log(currentEmployee.featureSettings.websiteBlocker)

  const handleInputChangeBlackListing = (index, e) => {
    const newFields = [...blackListing];
    newFields[index] = e.target.value;
    setBlackListing(newFields);
  };

  const handleAddField = () => {
    setBlackListing([...blackListing, ""]);
  };

  const handleRemoveField = (index) => {
    const newFields = blackListing.filter((_, i) => i !== index);
    setBlackListing(newFields);
  };

  const handleSubmitBlack = async () => {
    try {
      const response = await axios.put(
        `/features/${currentEmployee.employeeId}`,
        {
          websiteBlocker: blackListing,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Data sent to server:", blackListing);
      console.log(response.data);
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  return (
    <Box>
      <Tabs value={tabIndex} onChange={handleTabChange}>
        <Tab label="White Listing" />
        <Tab label="Black Listing" />
      </Tabs>

      {tabIndex === 0 && (
        <Box p={2}>
          <Grid container spacing={2} alignItems="center">
            {/* Proxy Address Field */}
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Proxy Address"
                variant="outlined"
                value={whiteListing.proxyAddress}
                onChange={handleInputChangeWhite("proxyAddress")}
                disabled={!isEditingWhite}
                sx={{ marginTop: "16px" }}
              />
            </Grid>

            {/* Port Field */}
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Port"
                variant="outlined"
                value={whiteListing.port}
                onChange={handleInputChangeWhite("port")}
                disabled={!isEditingWhite}
                sx={{ marginTop: "16px" }}
              />
            </Grid>

            {/* Initial Exception Field */}
            {whiteListing.exception.map((exception, index) => (
              <Grid item xs={12} sm={5} key={index}>
                <ListItem sx={{ paddingBottom: 0 }}>
                  <TextField
                    fullWidth
                    label={`Exception ${index + 1}`}
                    variant="outlined"
                    value={exception}
                    onChange={handleExceptionChange(index)}
                    disabled={!isEditingWhite}
                    sx={{ marginTop: "16px" }}
                  />
                  {/* Show close button for dynamically added exceptions */}
                  {isEditingWhite && (
                    <IconButton
                      onClick={() => handleRemoveException(index)}
                      edge="end"
                      sx={{ marginLeft: 1 }}
                    >
                      <CloseIcon />
                    </IconButton>
                  )}
                </ListItem>
              </Grid>
            ))}

            {/* Add Exception Button */}
            {isEditingWhite && (
              <Grid item xs={12}>
                <Box
                  display="flex"
                  justifyContent="flex-start"
                  sx={{ marginTop: 2 }}
                >
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={handleAddException}
                  >
                    Add Exception
                  </Button>
                </Box>
              </Grid>
            )}
          </Grid>

          {/* Save / Edit Button */}
          <Box mt={3} display="flex" justifyContent="flex-end">
            {isEditingWhite ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveWhite}
                sx={{ marginRight: 2 }}
              >
                Save
              </Button>
            ) : (
              <Button
                variant="contained"
                color="secondary"
                onClick={handleEditClickWhite}
              >
                Edit
              </Button>
            )}
          </Box>
        </Box>
      )}

{tabIndex === 1 && (
  <Box p={2}>
    <Grid container spacing={2}>
      {/* Render blacklisting as text when not in edit mode */}
      {!isEditingBlack ? (
        blackListing.map((field, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <ListItem>
              <Typography>{field}</Typography>
            </ListItem>
          </Grid>
        ))
      ) : (
        // Render input fields when in edit mode
        blackListing.map((field, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <TextField
              fullWidth
              label={`Website ${index + 1}`}
              variant="outlined"
              value={field}
              onChange={(e) => handleInputChangeBlackListing(index, e)}
              sx={{ width: { xs: "100%", sm: "80%", md: "60%" } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {blackListing.length > 1 && (
                      <IconButton onClick={() => handleRemoveField(index)}>
                        <CloseIcon />
                      </IconButton>
                    )}
                    {index === blackListing.length - 1 && (
                      <IconButton onClick={handleAddField}>
                        <AddIcon />
                      </IconButton>
                    )}
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        ))
      )}

      {/* Save / Edit Button for Blacklisting */}
      <Grid item xs={12}>
        <Box mt={2} display="flex" justifyContent="flex-end">
          {isEditingBlack ? (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveBlack}
                sx={{ marginRight: 2 }}
              >
                Save
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmitBlack}
              >
                Submit
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              color="secondary"
              onClick={handleEditClickBlack}
            >
              Edit
            </Button>
          )}
        </Box>
      </Grid>
    </Grid>
  </Box>
)}
    </Box>
  );
};

export default WebsiteSetting;
