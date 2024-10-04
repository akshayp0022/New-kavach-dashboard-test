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
  const currentEmployee = employees.find(
    (emp) => emp.employeeId === currentEmployeeId
  );

  return (
    <>
      <Dialog open={open} onClose={handleClose} id="modal">
        <div className="Modalwrapper">
          <div className="sidebar-modal">
            <div>
              <Typography variant="h6" id="userName">
                <RoundNameCircle
                  name={
                    employees
                      .find((emp) => emp.employeeId === currentEmployeeId)
                      ?.name.trim() || "N/A"
                  }
                  // Need to make dynamic ********
                  status={"active"}
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
                {modalList.map((item, index) => (
                  <ListItem
                    key={index}
                    id="listItem"
                    onClick={(e) => {
                      handleChangeModalContent(
                        item.split(" ").join("_").toLowerCase()
                      );
                      setActiveItem(item);
                    }}
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

          {isModal ? (
            <div className="sidebar-list">
              <List>
                {modalList.map((item, index) => (
                  <ListItem
                    key={index}
                    id="listItem"
                    onClick={(e) => {
                      console.log(e.target);
                      handleChangeModalContent(
                        item.split(" ").join("_").toLowerCase()
                      );
                    }}
                  >
                    <ListItemText
                      primary={`${item}`}
                      style={{ fontSize: "10px" }}
                    />
                  </ListItem>
                ))}
              </List>
            </div>
          ) : (
            ""
          )}

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
    </>
  );
};

export default EmployeeModal;
