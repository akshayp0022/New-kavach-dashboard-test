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
import { token } from "./userData";
import { modalList } from "./Table/TableData";
import { RoundNameCircle, BadgeIcon } from "./Table/TableComponents";
import TransitionsModal from "./Modal";
import { ModalContentTitle, ModalContent } from "./Modal";
import { useState, useEffect } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useAppContext } from "./AppContext";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import SettingsSuggestOutlinedIcon from "@mui/icons-material/SettingsSuggestOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import NumbersOutlinedIcon from "@mui/icons-material/NumbersOutlined";
import { Text_Icon } from "./Table/TableComponents";
import "../css/Modal.css";
import "../css/DataTable.css";
import endpoints from "../endpoints";
import axios from "../utils/index"

const DataTable = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMidScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { open: isSideBarOpen, windowWidth } = useAppContext();
  const isModal = useMediaQuery(
    `(max-width:${theme.breakpoints.values.modal}px)`
  );
  const [rowsData, setRowsData] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [open, setOpen] = useState(false);
  const [modalContent, handleModalContent] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleClickOpen = (event) => {
    event.stopPropagation();
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const handleChangeModalContent = (newValue) => {
    handleModalContent(newValue);
  };

  const rows = [
    {
      id: 1,
      status: "Snow",
      name: "Jon",
      action: <MoreHorizIcon id="tableCellHoriz" onClick={handleClickOpen} />,
      employee_id: "123@abc",
    },
    {
      id: 2,
      status: "Lannister",
      name: "Cersei",
      action: <MoreHorizIcon id="tableCellHoriz" onClick={handleClickOpen} />,
      employee_id: "123@abc",
    },
    {
      id: 3,
      status: "Lannister",
      name: "Jaime",
      action: <MoreHorizIcon id="tableCellHoriz" onClick={handleClickOpen} />,
      employee_id: "123@abc",
    },
    {
      id: 4,
      status: "Stark",
      name: "Arya",
      action: <MoreHorizIcon id="tableCellHoriz" onClick={handleClickOpen} />,
      employee_id: "123@abc",
    },
    {
      id: 5,
      status: "Targaryen",
      name: "Daenerys",
      action: <MoreHorizIcon id="tableCellHoriz" onClick={handleClickOpen} />,
      employee_id: "123@abc",
    },
  ];

  const Newcolumns = [
    {
      field: "id",
      headerName: (
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
      headerName: (
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
      headerName: (
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
      headerName: (
        <Text_Icon
          text={"Status"}
          Icon={<CheckCircleOutlineIcon sx={{ color: "#6754E2" }} />}
        />
      ),

      renderCell: (params) => {
        if (params.value === "active") {
          return (
            <BadgeIcon
              status={params.value}
              sx={{ backgroundColor: "#C6E2B5" }}
            />
          );
        } else {
          return <BadgeIcon status={params.value} />;
        }
      },
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
      headerName: (
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

  const getData = async () => {
    try {
      const response = await axios.get(`/users/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { users } = await response.json();
      const finalRenderingData = users.map(
        ({ name, _id, status, employeeId }, index) => {
          return {
            id: index + 1,
            status: <BadgeIcon status={"active"} />,
            name: (
              <div>
                <RoundNameCircle name={`${name.trim()}`} status={"active"} />{" "}
                {employeeId},
              </div>
            ),
            action: (
              <MoreHorizIcon id="tableCellHoriz" onClick={handleClickOpen} />
            ),
            employeeId,
          };
        }
      );

      setRowsData(finalRenderingData);
      console.log(users);
    } catch (err) {
      console.log(err.message);
    } finally {
      console.log("Request Made and Completed");
    }
  };

  useEffect(() => {
    getData();
  }, []);

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
              {`All Users (${rows.length})`}
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

      <Dialog open={open} onClose={handleClose} id="modal">
        <div className="Modalwrapper">
          <div className="sidebar-modal">
            <div>
              <Typography variant="h6" id="userName">
                <RoundNameCircle name={"Harish Puri"} status={"active"} />
              </Typography>
              <Typography id="employeeId">INT006</Typography>
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
                      console.log(e.currentTarget);
                      handleChangeModalContent(
                        item.split(" ").join("_").toLowerCase()
                      );
                      setActiveItem(item);
                    }}
                    sx={{
                      backgroundColor:
                        activeItem === item ? "#d3d3d3" : "transparent",
                      borderRadius: "8px",
                      "&:hover": {
                        backgroundColor: "#e0e0e0",
                      },
                    }}
                  >
                    <ListItemText
                      primary={`${item}`}
                      style={{ fontSize: "10px" }}
                    />
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
                <ModalContent contentValue={modalContent} />
              </DialogContent>
            </DialogContent>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default DataTable;
