import React from "react";
import { RoundNameCircle } from "./Table/TableComponents";
import { ListItem, ListItemIcon } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { useAppContext } from "./AppContext";
import "../css/topNavBar.css";
import { useAuth } from "../context/auth";

function NavBar() {
  const { open, toggleDrawer } = useAppContext();
  const { user } = useAuth();

  return (
    <div
      id="topnavbar"
      style={{ padding: open ? "23px 24px 23px 4px" : "12px 24px 12px 4px" }}
    >
      <ListItem
        sx={{ padding: "0px", cursor: "pointer" }}
        onClick={toggleDrawer}
      >
        <ListItemIcon
          id="screen-collapse-bar"
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
          <h4>Home - Activity - Teams</h4>
        </div>
      </ListItem>

      <div>
        <RoundNameCircle
          name={user ? user.initials : "NA"}
          status={"Activated"}
        />
      </div>
    </div>
  );
}

export default NavBar;
