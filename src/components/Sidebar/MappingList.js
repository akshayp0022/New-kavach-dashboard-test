import { ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { CommonListItemStyle, StyledNavLinkCSS } from "./Data";
import { renderIcons, activityIcons } from "./Data";
import { StyledNavLink } from "../SideBar";

const MappingList = () => {
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
    </>
  );
};

export default MappingList