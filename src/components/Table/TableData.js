import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import SettingsSuggestOutlinedIcon from "@mui/icons-material/SettingsSuggestOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import { TextIcon } from "./TableComponents";

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
  "Capture Screenshot",
  "Website Settings",
  "Internet History",
  "Download History",
  'Keylogger History',
  'Wallpaper Settings',
  'test',
  "Live Location"
];

export const ModalIconList = [
  <BadgeOutlinedIcon />
]

export const columns = [
  {
    id: "name",
    label: (
      <TextIcon
        text={"Name"}
        Icon={<AccountCircleIcon sx={{ color: "#6754E2" }} />}
      />
    ),
    minWidth: 100,
  },
  {
    id: "employee_id",
    label: (
      <TextIcon
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
      <TextIcon
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
      <TextIcon
        text={"Action"}
        Icon={<SettingsSuggestOutlinedIcon sx={{ color: "#6754E2" }} />}
      />
    ),
    minWidth: 170,
    align: "left",
  },
];