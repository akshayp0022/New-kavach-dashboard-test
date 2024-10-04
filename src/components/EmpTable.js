import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import {
  Container,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import SettingsSuggestOutlinedIcon from "@mui/icons-material/SettingsSuggestOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import NumbersOutlinedIcon from "@mui/icons-material/NumbersOutlined";
import { Text_Icon } from "./Table/TableComponents";
import { RoundNameCircle, BadgeIcon } from "./Table/TableComponents";
import TransitionsModal, { ModalContent, ModalContentTitle } from "./Modal";
import { useAppContext } from "./AppContext";
import { useEmployeeContext } from "../context/employee";
import "../css/Modal.css";
import "../css/DataTable.css";
import { modalList } from "./Table/TableData";
import EmployeeModal from "./EmployeeModal";
import { useStatus } from "../context/status";

const EmpTable = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMidScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { open: isSideBarOpen, windowWidth } = useAppContext();
  const isModal = useMediaQuery(
    `(max-width:${theme.breakpoints.values.modal}px)`
  );

  const { employees } = useEmployeeContext();
  const { statusData } = useStatus();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [open, setOpen] = useState(false);
  const [modalContent, handleModalContent] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  // State to track the current employeeId
  const [currentEmployeeId, setCurrentEmployeeId] = useState(null);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };


  const handleClickOpen = (employeeId) => {
    console.log(`Employee ID: ${employeeId}`);
    setCurrentEmployeeId(employeeId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentEmployeeId(null);
  };
  const handleChangeModalContent = (newValue) => {
    handleModalContent(newValue);
  };

  const rowsData = employees.map(({ name, _id, employeeId, status  }, index) => {
    const employeeStatus = statusData[employeeId]?.status || "deactivated" // Default to "Unknown" if status not found
   console.log(employeeStatus);
   
    //TODO: Add employee status
    //TODO:  add status in the params along with name and id
    return {
      id: index + 1,
      status: <BadgeIcon status={employeeStatus} />,
      name: (
        <div>
          <RoundNameCircle name={name.trim()} status={employeeStatus} /> {employeeId}
        </div>
      ),
      action: (
        <MoreHorizIcon
          id="tableCellHoriz"
          onClick={(e) => {
            e.stopPropagation();
            handleClickOpen(employeeId);
          }} // Pass the employeeId here
        />
      ),
      employeeId,
    };
  });

  const Newcolumns = [
    {
      field: "id",
      renderHeader: () => (
        <Text_Icon
          text={"No."}
          Icon={<NumbersOutlinedIcon sx={{ color: "#6754E2" }} />}
        />
      ),
      width: 90,
      align: "center",
    },
    {
      field: "name",
      renderHeader: () => (
        <Text_Icon
          text={"Name"}
          Icon={<AccountCircleIcon sx={{ color: "#6754E2" }} />}
        />
      ),
      renderCell: (params) => params.value,
      width: isMidScreen
        ? 150
        : !isSideBarOpen
        ? Math.round(windowWidth / 5) - 40
        : Math.round(windowWidth / 5) - 40,
      align: "right",
    },
    {
      field: "employeeId",
      renderHeader: () => (
        <Text_Icon
          text={"Employee Id"}
          Icon={<BadgeOutlinedIcon sx={{ color: "#6754E2" }} />}
        />
      ),
      width: isMidScreen
        ? 150
        : !isSideBarOpen
        ? Math.round(windowWidth / 3.5) - 40
        : Math.round(windowWidth / 3.5) - 90,
      align: "left",
    },
    {
      field: "status",
      renderHeader: () => (
        <Text_Icon
          text={"Status"}
          Icon={<CheckCircleOutlineIcon sx={{ color: "#6754E2" }} />}
        />
      ),
      renderCell: (params) => params.value,
      width: isMidScreen
        ? 150
        : !isSideBarOpen
        ? Math.round(windowWidth / 3.5) - 40
        : Math.round(windowWidth / 3.5) - 120,
      align: "center",
    },
    {
      field: "action",
      renderHeader: () => (
        <Text_Icon
          text={"Action"}
          Icon={<SettingsSuggestOutlinedIcon sx={{ color: "#6754E2" }} />}
        />
      ),
      renderCell: (params) => params.value,
      width: 150,
      align: "left",
    },
  ];

  return (
    <>
      <Container
        maxWidth={isSmallScreen ? false : "100vw"}
        sx={{ width: "100%", marginTop: "5em" }}
        className="tableData"
        id="tableData"
      >
        <Paper
          sx={{ width: "80%", overflow: "hidden" }}
          id="tablePaper"
          style={{
            width: isSideBarOpen ? "83%" : "92vw",
          }}
        >
          <div
            className="upperSearch"
            style={{ maxWidth: isSideBarOpen ? "1058px" : "1210px" }}
          >
            <Typography fontWeight={600} fontSize={16}>
              {`All Employees (${rowsData.length})`}
            </Typography>
            <TransitionsModal />
            <TextField fullWidth label="Search" id="textFieldSearch" />
          </div>
          <Paper sx={{ height: "100%", width: "100%" }}>
            <DataGrid
              rows={rowsData}
              columns={Newcolumns}
              pagination
              pageSize={rowsPerPage}
              rowsPerPageOptions={[10, 25, 100]}
              checkboxSelection
              paginationModel={{ page, pageSize: rowsPerPage }}
              onPageSizeChange={handleChangeRowsPerPage}
              onPageChange={handleChangePage}
              sx={{ border: 0 }}
            />
          </Paper>
        </Paper>
      </Container>

      {/* <Dialog open={open} onClose={handleClose} id="modal">
         <div className="Modalwrapper">
          <div className="sidebar-modal">
            <div>
              <Typography variant="h6" id="userName">
                <RoundNameCircle
                  name={
                    employees.find(
                      (emp) => emp.employeeId === currentEmployeeId
                    )?.name || "N/A"
                  }
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
          <div className="modal-feature">
            <DialogContent>
              <DialogTitle style={{ padding: "16px 0px" }}>
                <ModalContentTitle contentValue={modalContent} />
              </DialogTitle>
              <DialogActions onClick={handleClose}>
                <CloseOutlinedIcon sx={{ color: "#696969" }} />
              </DialogActions>
              <DialogContent>
                <ModalContent contentValue={modalContent} />
              </DialogContent>
            </DialogContent>
          </div>
        </div>
      </Dialog> */}

      <EmployeeModal
        open={open}
        handleClose={handleClose}
        employees={employees}
        modalList={modalList}
        handleChangeModalContent={handleChangeModalContent}
        modalContent={modalContent}
        currentEmployeeId={currentEmployeeId}
        isModal={isModal}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
      />
    </>
  );
};

export default EmpTable;
