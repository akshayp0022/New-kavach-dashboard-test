import { List, ListItem, ListItemIcon } from "@mui/material";
import { renderIcons, activityIcons } from "./Data";
import { StyledNavLink } from "../SideBar";
import { useAuth } from "../../context/auth";

const SideBarLogoList = () => {
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
  };
  return (
    <List sx={{ position: "fixed", top: window.innerHeight / 5, left: 0 }}>
      {[...renderIcons, ...activityIcons].map((value) => {
        if (value.text === "Logout") {
          return (
            <ListItem
              key={value.text}
              sx={{ padding: "0px", cursor: "pointer" }}
              onClick={handleLogout} 
            >
              <ListItemIcon
                sx={{
                  padding: "1em 0.5em",
                  backgroundColor: "#dbdbdb",
                }}
              >
                {value.data}
              </ListItemIcon>
            </ListItem>
          );
        } else {
          // Render the other icons as normal links
          return (
            <StyledNavLink to={`/${value.text.toLowerCase()}`} key={value.text}>
              <ListItem sx={{ padding: "0px", cursor: "pointer" }}>
                <ListItemIcon
                  sx={{
                    padding: "1em 0.5em",
                    backgroundColor: "#dbdbdb",
                  }}
                >
                  {value.data}
                </ListItemIcon>
              </ListItem>
            </StyledNavLink>
          );
        }
      })}
    </List>
  );
};

export default SideBarLogoList;
