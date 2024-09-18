import React from "react";
import { RoundNameCircle } from "./Table/TableComponents";
import { ListItem, ListItemIcon } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { useAppContext } from "./AppContext";
import "../css/topNavBar.css";

function NavBar() {
  const { open, toggleDrawer } = useAppContext();
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
        <RoundNameCircle name={"Super Admin"} status={"Activated"} />
      </div>
    </div>
  );
}

export default NavBar;
