import React, { useState } from "react";
import { AdminRoundNameCircle } from "./Table/TableComponents";
import {
  ListItem,
  ListItemIcon,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { useAppContext } from "./AppContext";
import "../css/topNavBar.css";
import axios from "../utils/endpoints";

function NavBar() {
  const { open, toggleDrawer } = useAppContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = sessionStorage.getItem("token");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    teamLead: "",
    employeeId: "",
  });

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.department ||
      !formData.teamLead ||
      !formData.employeeId
    ) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      await axios.post("/user/create", formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Employee data submitted:", formData);
      setFormData({
        name: "",
        email: "",
        department: "",
        teamLead: "",
        employeeId: "",
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="topnavbar"
      style={{
        padding: open ? "23px 24px 23px 4px" : "12px 24px 6px 4px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <ListItem sx={{ padding: "0px" }}>
        <ListItemIcon
          id="screen-collapse-bar"
          onClick={toggleDrawer}
          sx={{
            padding: "0.5em",
            backgroundColor: "#6754E2",
            color: "#ffffff",
          }}
        >
          <MenuIcon
            sx={{
              display: open ? "none" : "block",
              marginTop: "20px",
            }}
          />
        </ListItemIcon>

        <div>
          <h4 style={{ margin: 0 }}>Home - Activity - Teams</h4>
        </div>
      </ListItem>

      <Button
        variant="contained"
        sx={{
          marginRight: "25px",
          padding: "5px 15px 5px 15px",
          whiteSpace: "nowrap",
          backgroundColor: "#4CAF50",
          color: "#fff",
          "&:hover": {
            backgroundColor: "#45a049",
          },
        }}
        onClick={handleOpen}
      >
        Add Employee
      </Button>

      <AdminRoundNameCircle name={"Akshay Pawar"} status={"Activated"} />

      {/* Modal for Add Employee */}
      <Dialog open={modalOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Add Employee
          <IconButton
            edge="end"
            // color="inherit"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 12,
              top: 8,
              color: "red",
              "&:hover": {
                color: "lightcoral",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Name"
                sx={{ width: "100%", marginTop: "10px" }}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                sx={{ width: "100%", marginTop: "10px" }}
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Department"
                sx={{ width: "100%" }}
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Team Lead"
                sx={{ width: "100%" }}
                value={formData.teamLead}
                onChange={(e) =>
                  setFormData({ ...formData, teamLead: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Employee ID"
                sx={{ width: "100%" }}
                value={formData.employeeId}
                onChange={(e) =>
                  setFormData({ ...formData, employeeId: e.target.value })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default NavBar;
