import { List, ListItem, ListItemIcon } from "@mui/material";
import { renderIcons, activityIcons } from "./Data";
import { StyledNavLink } from "../SideBar";

const SideBarLogoList = () => {
  return (
    <List sx={{ position: "fixed", top: window.innerHeight / 5, left: 0 }}>
      {[...renderIcons, ...activityIcons].map((value) => {
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
      })}
    </List>
  );
};


export default SideBarLogoList