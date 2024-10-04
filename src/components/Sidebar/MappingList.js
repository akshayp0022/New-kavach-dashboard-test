import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { CommonListItemStyle, StyledNavLinkCSS } from "./Data";
import { renderIcons, activityIcons } from "./Data";
import { StyledNavLink } from "../SideBar";
import { useAuth } from "../../context/auth";

const MappingList = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {renderIcons.map((value) => {
        return (
          <StyledNavLink
            key={value.text}
            to={`/${value.text.toLowerCase()}`}
            style={StyledNavLinkCSS}
          >
            <ListItem sx={CommonListItemStyle}>
              <ListItemIcon>{value.data}</ListItemIcon>
              <ListItemText primary={value.text} />
            </ListItem>
          </StyledNavLink>
        );
      })}

      <ListItem>
        <ListItemText>
          <Typography fontSize={12} fontWeight={600} color="gray">
            PEOPLE
          </Typography>
        </ListItemText>
      </ListItem>

      {activityIcons.map((value) => {
        if (value.text === "Logout") {
          return (
            <ListItem
              key={value.text}
              sx={CommonListItemStyle}
              onClick={handleLogout} // Call handleLogout when clicked
            >
              <ListItemIcon>{value.data}</ListItemIcon>
              <ListItemText primary={value.text} />
            </ListItem>
          );
        } else {
          return (
            <StyledNavLink
              key={value.text}
              to={`/${value.text.toLowerCase()}`}
              style={StyledNavLinkCSS}
            >
              <ListItem sx={CommonListItemStyle}>
                <ListItemIcon>{value.data}</ListItemIcon>
                <ListItemText primary={value.text} />
              </ListItem>
            </StyledNavLink>
          );
        }
      })}
    </>
  );
};

export default MappingList;
