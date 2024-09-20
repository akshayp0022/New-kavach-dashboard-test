import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import SettingsSuggestOutlinedIcon from "@mui/icons-material/SettingsSuggestOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import { Text_Icon } from "./TableComponents";

let currentWindowWidth = window.innerWidth;
window.addEventListener('resize', () => {
  currentWindowWidth = window.innerWidth;
})

export const moreHorizStyles = {
  borderRadius: "50%",
  "&:hover": {
    backgroundColor: "#ccc",
  },
};

export const modalList = [
  "Features Settings",
  "Forcefully Restart",
  "Screenshot email Data",
  "Website Settings",
  "Internet History",
  "Download History",
  'Keylogger History',
  'Wallpaper Settings'
];

export const columns = [
  {
    id: "name",
    label: (
      <Text_Icon
        text={"Name"}
        Icon={<AccountCircleIcon sx={{ color: "#6754E2" }} />}
      />
    ),
    minWidth: 100,
  },
  {
    id: "employee_id",
    label: (
      <Text_Icon
        text={"Employee Id"}
        Icon={<BadgeOutlinedIcon sx={{ color: "#6754E2" }} />}
      />
    ),
    minWidth: 100,
    align: "left",
  },
  {
    id: "status",
    label: (
      <Text_Icon
        text={"Status"}
        Icon={<CheckCircleOutlineIcon sx={{ color: "#6754E2" }} />}
      />
    ),
    minWidth: 170,
    align: "left",
  },
  {
    id: "action",
    label: (
      <Text_Icon
        text={"Action"}
        Icon={<SettingsSuggestOutlinedIcon sx={{ color: "#6754E2" }} />}
      />
    ),
    minWidth: 170,
    align: "left",
  },
];