import React from "react";
import { ModalContent, ModalContentTitle } from "./Modal";
import { RoundNameCircle } from "./Table/TableComponents";
import {
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { useStatus } from "../context/status";

const EmployeeModal = ({
  open,
  handleClose,
  employees,
  modalList,
  handleChangeModalContent,
  modalContent,
  currentEmployeeId,
  isModal,
  activeItem,
  setActiveItem,
}) => {
  const { statusData } = useStatus();
  const currentEmployee = employees?.find(
    (emp) => emp.employeeId === currentEmployeeId
  );

  const employeeStatus = statusData?.[currentEmployeeId]?.status || "deactivated";

  // Safeguard: Check if currentEmployeeId exists before rendering
  if (!currentEmployeeId || !currentEmployee) {
    return null; 
  }

  const handleListItemClick = (item) => {
    handleChangeModalContent(item.split(" ").join("_").toLowerCase());
    setActiveItem(item);
  };

  return (
    <Dialog open={open} onClose={handleClose} id="modal">
      <div className="Modalwrapper">
        <div className="sidebar-modal">
          <div>
            <Typography variant="h6" id="userName">
              <RoundNameCircle
                name={currentEmployee?.name?.trim() || "N/A"}
                status={employeeStatus}
              />
            </Typography>
            <Typography id="employeeId">{currentEmployeeId}</Typography>
          </div>
          {isModal ? (
            <DialogActions onClick={handleClose}>
              <CloseOutlinedIcon sx={{ color: "#696969" }} />
            </DialogActions>
          ) : (
            <List>
              {modalList.map((item) => (
                <ListItem
                  key={item} 
                  id="listItem"
                  onClick={() => handleListItemClick(item)}
                  sx={{
                    backgroundColor:
                      activeItem === item ? "#d3d3d3" : "transparent",
                    borderRadius: "8px",
                    "&:hover": { backgroundColor: "#e0e0e0" },
                  }}
                >
                  <ListItemText primary={item} style={{ fontSize: "10px" }} />
                </ListItem>
              ))}
            </List>
          )}
        </div>

        <div className="modal-feature">
          <DialogContent>
            <div className="modal-header">
              <DialogTitle style={{ padding: "16px 0px" }}>
                <ModalContentTitle contentValue={modalContent} />
              </DialogTitle>
              {!isModal && (
                <DialogActions onClick={handleClose}>
                  <CloseOutlinedIcon sx={{ color: "#696969" }} />
                </DialogActions>
              )}
            </div>
            <DialogContent>
              <ModalContent
                contentValue={modalContent}
                currentEmployee={currentEmployee}
              />
            </DialogContent>
          </DialogContent>
        </div>
      </div>
    </Dialog>
  );
};

export default EmployeeModal;
