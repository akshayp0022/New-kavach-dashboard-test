import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import FeatureSettings from "./ModalComponents/FeatureSettings";
import ForceFullyRestart from "./ModalComponents/ForceFullyRestart";
import ScreenShotData from "./ModalComponents/ScreenShotData";
import WebsiteSetting from "./ModalComponents/WebsiteSetting";
import InternetHistory from "./ModalComponents/InternetHistory";
import DownloadHistory from "./ModalComponents/DownloadHistory";
import Keylogger from "./ModalComponents/KeyLogger";
import Wallpaper from "./ModalComponents/Wallpaper";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function TransitionsModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Modal
        handleOpen={handleOpen}
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open} id='hello_void'>
          
        </Fade>
      </Modal>
    </div>
  );
}

export const ModalContentTitle = ({ contentValue }) => {
  switch (contentValue) {
    case "features_settings":
      return <Typography variant="h4">Features Settings</Typography>;

    case "forcefully_restart":
      return <Typography variant="h4">Forcefully Restart</Typography>;

    case "screenshot_email_data":
      return <Typography variant="h4">Screenshot and Email Data</Typography>;

    case "website_settings":
      return <Typography variant="h4">Website Settings</Typography>;

    case "internet_history":
      return <Typography variant="h4">Internet History</Typography>;

    case "download_history":
      return <Typography variant="h4">Download History</Typography>;

    case "keylogger_history":
      return <Typography variant="h4">Keylogger History</Typography>;

    case "wallpaper_settings": 
      return <Typography variant="h4">Wallpaper Settings</Typography>;

    default:
      return <Typography variant="h4">Features Settings</Typography>;
  }
};

export const ModalContent = ({ contentValue, currentEmployee }) => {
  switch (contentValue) {
    case "features_settings":
      return <FeatureSettings currentEmployee={currentEmployee} />;

    case "forcefully_restart":
      return <ForceFullyRestart currentEmployee={currentEmployee}/>;

    case "screenshot_email_data":
      return <ScreenShotData currentEmployee={currentEmployee}/>;

    case "website_settings":
      return <WebsiteSetting currentEmployee={currentEmployee}/>;

    case "internet_history":
      return <InternetHistory currentEmployee={currentEmployee}/>;

    case "download_history":
      return <DownloadHistory currentEmployee={currentEmployee}/>;

    case "keylogger_history":
      return <Keylogger currentEmployee={currentEmployee}/>;

    case "wallpaper_settings": 
      return <Wallpaper currentEmployee={currentEmployee}/>

    default:
      return <FeatureSettings currentEmployee={currentEmployee} />;
  }
};
