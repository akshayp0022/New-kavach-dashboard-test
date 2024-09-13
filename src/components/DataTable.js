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
import { ModalContent } from "./Modal";
import { useState, useEffect } from "react";
import { Newcolumns } from "./Table/TableData";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import "../css/Modal.css";
import "../css/DataTable.css";

const DataTable = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isModal = useMediaQuery(
    `(max-width:${theme.breakpoints.values.modal}px)`
  );
  const [rowsData, setRowsData] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [open, setOpen] = useState(false);
  const [modalContent, handleModalContent] = useState(false);

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

  const getData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users/get", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const { users } = await response.json();
      const finalRenderingData = users.map(
        ({ name, _id, status, employeeId }) => {
          return {
            id: _id,
            status: <BadgeIcon status={'active'} />,
            name: (
              <div>
                <RoundNameCircle name={`${name}`} status={'active'} /> {employeeId},
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
        maxWidth={isSmallScreen ? false : "xl"}
        sx={{ width: "100%" }}
        className="tableData"
        id="tableData"
      >
        <Paper sx={{ width: "80%", overflow: "hidden" }} id="tablePaper">
          <div className="upperSearch">
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
                    onClick={() =>
                      handleChangeModalContent(
                        item.split(" ").join("_").toLowerCase()
                      )
                    }
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
                    onClick={() =>
                      handleChangeModalContent(
                        item.split(" ").join("_").toLowerCase()
                      )
                    }
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
                  <ModalContent contentValue={modalContent} />
                </DialogTitle>
                {!isModal && (
                  <DialogActions onClick={handleClose}>
                    <CloseOutlinedIcon sx={{ color: "#696969" }} />
                  </DialogActions>
                )}
              </div>
            </DialogContent>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default DataTable;
