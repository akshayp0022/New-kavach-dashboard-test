import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import FeatureSettings from './ModalComponents/FeatureSettings'
import ForceFullyRestart from './ModalComponents/ForceFullyRestart'
import ScreenShotData from './ModalComponents/ScreenShotData'
import WebsiteSetting from './ModalComponents/WebsiteSetting'
import InternetHistory from './ModalComponents/InternetHistory'
import DownloadHistory from './ModalComponents/DownloadHistory'

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
      <Modal handleOpen={handleOpen}
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
        <Fade in={open}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Text in a modal
            </Typography>
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
              Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            </Typography>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}


export const ModalContent = ({ contentValue }) => {
  switch (contentValue){
    case 'features_settings' :
      return <FeatureSettings />

    case 'forcefully_restart' : 
      return <ForceFullyRestart />

    case 'screenshot_email_data' :
      return <ScreenShotData />

    case 'website_settings' :
      return <WebsiteSetting />

    case 'internet_history':
      return <InternetHistory />

    case 'download_history' :
      return <DownloadHistory />

    default : return <FeatureSettings />
  }
}