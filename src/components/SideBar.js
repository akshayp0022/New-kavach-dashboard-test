import React, { useEffect } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Container,
} from "@mui/material";
import {
  Menu as MenuIcon,
  West as WestIcon,
  PlayCircleFilledWhiteOutlined as PlayCircleFilledWhiteOutlinedIcon,
  SpaceDashboardOutlined as SpaceDashboardOutlinedIcon,
  NotificationsNoneOutlined as NotificationsNoneOutlinedIcon,
  StoreOutlined as StoreOutlinedIcon,
} from "@mui/icons-material";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import { NavLink, Outlet } from "react-router-dom";
import { styled } from "@mui/system";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { fourIconsCommonStyle, NavlinkStyles } from "./Sidebar/Data";
import SideBarLogoList from "./Sidebar/SideBarLogoList";
import MappingList from "./Sidebar/MappingList";
import { useAppContext } from "./AppContext";
import NavBar from "./NavBar";
import "../css/customs.css";

export const StyledNavLink = styled(NavLink)(() => NavlinkStyles);
function CollapsibleSidebar() {
  const theme = useTheme();
  const { open, toggleDrawer } = useAppContext();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // useEffect(() => {
  //   console.log(open);
  // }, [open]);

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Drawer
          variant="persistent"
          open={open}
          sx={{
            width: 230,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              padding: "0px 8px",
              width: isSmallScreen ? "100%" : 230,
              transition: "width 0.25s",
            },
          }}
        >
          <List id="list-root">
            <ListItem
              sx={{
                display: "flex",
                justifyContent: "center",
                padding: "8px 16px 8px 0px",
              }}
            >
              <Container id="workStatusLogo">
                <Typography
                  variant="h5"
                  fontWeight={600}
                  sx={{ display: "flex", alignItems: "center", gap: "0.2em" }}
                >
                  <AdminPanelSettingsRoundedIcon
                    style={{ fontSize: "36px", color: "#6754E2" }}
                  />
                  <div>
                    <span style={{ color: "#6754E2" }}>K</span>
                    <span style={{ color: "black" }}>avach</span>
                  </div>
                </Typography>
              </Container>

              <WestIcon fontSize="0.9rem" onClick={toggleDrawer} />
            </ListItem>

            <ListItem
              sx={{ display: "flex", justifyContent: "start", gap: "1em" }}
            >
              <PlayCircleFilledWhiteOutlinedIcon sx={fourIconsCommonStyle} />
              <PlayCircleFilledWhiteOutlinedIcon sx={fourIconsCommonStyle} />
              <StoreOutlinedIcon sx={fourIconsCommonStyle} />
              <NotificationsNoneOutlinedIcon sx={fourIconsCommonStyle} />
            </ListItem>

            <StyledNavLink to="/dashboard" style={{ color: "black" }}>
              <ListItem
                sx={{
                  borderRadius: "10px",
                  fontWeight: "900",
                  "&:hover": {
                    backgroundColor: "#cccc",
                    color: "#6754E2",
                    cursor: "pointer",
                  },
                }}
              >
                <ListItemIcon>
                  <SpaceDashboardOutlinedIcon />
                </ListItemIcon>
                {open && (
                  <ListItemText sx={{ fontWeight: "bolder" }}>
                    Dashboard
                  </ListItemText>
                )}
              </ListItem>
            </StyledNavLink>

            <ListItem>
              <ListItemText>
                <Typography fontSize={12} fontWeight={600} color="gray">
                  ACTIVITY
                </Typography>
              </ListItemText>
            </ListItem>

            <MappingList />
          </List>
        </Drawer>

        <Container sx={{ padding: "0px" }}>
          {!isLargeScreen && (
            <Typography variant="span">
              <MenuIcon
                sx={{
                  display: open ? "none" : "block",
                  marginTop: "18px",
                  position: "fixed",
                  left: 4,
                  backgroundColor: "#6754E2",
                  color: "#fff",
                  borderRadius: "4px",
                  fontSize: "2rem",
                  padding: "4px 2px",
                }}
                onClick={toggleDrawer}
              />
            </Typography>
          )}

          {isLargeScreen && (
            <React.Fragment>
              <Container
                sx={{ padding: 0, margin: 0, position: "fixed", left: -25 }}
              >
                <NavBar onClick={(event) => event.stopPropogation()} />
              </Container>
              <SideBarLogoList />
            </React.Fragment>
          )}
        </Container>
      </Box>
      <Outlet />
    </>
  );
}

export default CollapsibleSidebar;
