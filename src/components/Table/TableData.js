import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import SettingsSuggestOutlinedIcon from "@mui/icons-material/SettingsSuggestOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import { TextIcon } from "./TableComponents";
import SettingsIcon from '@mui/icons-material/Settings';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ScreenshotMonitorIcon from '@mui/icons-material/ScreenshotMonitor';
import WebIcon from '@mui/icons-material/Web';
import HistoryIcon from '@mui/icons-material/History';
import DownloadIcon from '@mui/icons-material/Download';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import MyLocationIcon from '@mui/icons-material/MyLocation';

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
  "System Restart",
  "Capture Screenshot",
  "Website Settings",
  "Internet History",
  "Download History",
  // 'Keylogger History',
  'Wallpaper Settings',
  // 'FeatureX',
  "Live Location"
];

const iconStyles = { fontSize: '24px' }; 
export const ModalIconList = [
  <SettingsIcon sx={iconStyles} />,
  <RestartAltIcon sx={iconStyles} />,
  <ScreenshotMonitorIcon sx={iconStyles} />,
  <WebIcon sx={iconStyles} />,
  <HistoryIcon sx={iconStyles} />,
  <DownloadIcon sx={iconStyles} />,
  <WallpaperIcon sx={iconStyles} />,
  <MyLocationIcon sx={iconStyles} />
];

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