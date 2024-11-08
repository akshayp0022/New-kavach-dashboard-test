import {
  ScreenshotMonitorOutlined as ScreenshotMonitorOutlinedIcon,
  AppsOutlined as AppsOutlinedIcon,
  CalendarMonthOutlined as CalendarMonthOutlinedIcon,
  AccountCircleOutlined as AccountCircleOutlinedIcon,
  GroupAddOutlined as GroupAddOutlinedIcon,
  MoveToInbox as InboxIcon,
  Mail as MailIcon,
  LogoutOutlined as LogoutOutlinedIcon,
} from "@mui/icons-material";

export const renderIcons = [
  { text: "Teams", data: <GroupAddOutlinedIcon /> },
  { text: "Screenshot", data: <ScreenshotMonitorOutlinedIcon /> },
  { text: "Apps", data: <AppsOutlinedIcon /> },
  { text: "Attendence", data: <CalendarMonthOutlinedIcon /> },
  { text: "Mail", data: <MailIcon /> },
  { text: "Inbox", data: <InboxIcon /> },
];

export const fourIconsCommonStyle = {
  padding: "0.2em",
  borderRadius: "50%",
  backgroundColor: "#dbdbdb",
  fontSize: "2rem",
  color: "#545454",
};

export const activityIcons = [
  { text: "Members", data: <AccountCircleOutlinedIcon /> },
  { text: "Logout", data: <LogoutOutlinedIcon /> },
];

export const NavlinkStyles = {
  textDecoration: "none",
  color: "black",
  "&.active": {
    backgroundColor: "#cccc",
    color: "black",
    borderRadius: "12px",
    "& li div": { color: "#6754E2" },
  },
};

export const StyledNavLinkCSS = {
  listStyle: "none",
  textDecoration: "none",
  display: "flex",
  alignItems: "center",
  color: "black",
  padding: "2px 0px",
};

export const CommonListItemStyle = {
  borderRadius: "10px",
  "&:hover": {
    backgroundColor: "#cccc",
    color: "#6754E2",
    cursor: "pointer",
  },
};
