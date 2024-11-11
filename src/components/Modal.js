import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
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
import Records from "./ModalComponents/Records";
import Location from "./ModalComponents/Location";

// const style = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: 400,
//   bgcolor: "background.paper",
//   border: "2px solid #000",
//   boxShadow: 24,
//   p: 4,
// };

export default function TransitionsModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = (e) => {
    e.preventDefault();
    setOpen(false);
  };

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
        <Fade in={open} id="hello_void">
          <div>
            <h2 id="transition-modal-title">Modal Title</h2>
            <p id="transition-modal-description">Your content here...</p>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

export const ModalContentTitle = ({ contentValue }) => {
  const titleMapping = {
    features_settings: "Features Settings",
    forcefully_restart: "Forcefully Restart",
    capture_screenshot: "Screenshot",
    website_settings: "Website Settings",
    internet_history: "Internet History",
    download_history: "Download History",
    keylogger_history: "Keylogger History",
    wallpaper_settings: "Wallpaper Settings",
    test: "test Settings",
    live_location: "Live Location",
  };

  return (
    <Typography variant="h5" component="div">
      {titleMapping[contentValue] || "Features Settings"}
    </Typography>
  );
};

export const ModalContent = ({ contentValue, currentEmployee }) => {
  switch (contentValue) {
    case "features_settings":
      return <FeatureSettings currentEmployee={currentEmployee} />;

    case "forcefully_restart":
      return <ForceFullyRestart currentEmployee={currentEmployee} />;

    case "capture_screenshot":
      return <ScreenShotData currentEmployee={currentEmployee} />;

    case "website_settings":
      return <WebsiteSetting currentEmployee={currentEmployee} />;

    case "internet_history":
      return <InternetHistory currentEmployee={currentEmployee} />;

    case "download_history":
      return <DownloadHistory currentEmployee={currentEmployee} />;

    case "keylogger_history":
      return <Keylogger currentEmployee={currentEmployee} />;

    case "wallpaper_settings":
      return <Wallpaper currentEmployee={currentEmployee} />;

    case "test":
      return <Records currentEmployee={currentEmployee} />;

    case "live_location":
      return <Location currentEmployee={currentEmployee} />;

    default:
      return <FeatureSettings currentEmployee={currentEmployee} />;
  }
};
