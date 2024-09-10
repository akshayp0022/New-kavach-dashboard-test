import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Box } from "@mui/material";
import {
  Container,
  TextField,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import TransitionsModal from "./Modal";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { columns, token, moreHorizStyles } from "./Table/TableData";
import { RoundNameCircle, BadgeIcon } from "./Table/TableComponents";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { useState } from "react";
import "../css/Modal.css";

export function createData(name, employee_id, status, action) {
  return { name, employee_id, status, action };
}

export default function StickyHeadTable() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [rowsData, setRowsData] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [open, setOpen] = useState(false);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  // **************

  const getData = async () => {
    try {
      const data = await fetch("http://localhost:5000/api/users/get", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const parseData = await data.json();
      console.log(parseData);
      setRowsData(parseData.users);
    } catch (err) {
      console.log(err.message);
    } finally {
      console.log("Request Made and Completed");
    }
  };

  React.useEffect(() => {
    getData();
  }, []);

  const rows = rowsData.map((value) => {
    console.log(value);
    return createData(
      <RoundNameCircle name={`${value.name}`} status={"deactivated"} />,
      `${value.employeeId}`,
      <BadgeIcon status={"deactivated"} />,
      <MoreHorizIcon sx={moreHorizStyles} onClick={handleClickOpen} />
    );
  });

  console.log(rowsData);

  // **************

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
            <Typography
              fontWeight={600}
              fontSize={16}
            >{`All Users (${rows.length})`}</Typography>{" "}
            <TransitionsModal />
            <Box sx={{ width: 350, maxWidth: "100%" }} id="textFieldSearch">
              <TextField fullWidth label="Search"></TextField>
            </Box>
          </div>
          <TableContainer sx={{ maxHeight: "100vh" }} id="tableContainer">
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column, index) => (
                    <TableCell
                      key={index}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.format && typeof value === "number"
                                ? column.format(value)
                                : value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Container>

      {/* ******************************************************* */}

      <div>
        <Dialog open={open} onClose={handleClose} id="modal">
          <div className="Modalwrapper">
            <div className="sidebar-modal">
              <div>
                <Typography variant="h6" id='userName'>
                  <RoundNameCircle name={'Harish'} status={'active'}/>
                </Typography>
                <Typography id='employeeId'>INT006</Typography>
              </div>

              <div>
                <List>
                  {[
                    "Features Settings",
                    "Forcefully Restart",
                    "Screenshot email Data",
                    "Website Settings",
                    "Internet History",
                    "Download History",
                    "Download History",
                    "Download History",
                    "Download History",
                  ].map((item, index) => (
                    <ListItem key={index} id="listItem">
                      <ListItemText primary={`${item}`} style={{fontSize: '10px'}}/>
                    </ListItem>
                  ))}
                </List>
              </div>
            </div>

            <div className="modal-feature">
              <DialogContent>
                <div className="modal-header">
                  <DialogTitle style={{ padding: "16px 0px" }}>
                    Modal Title
                  </DialogTitle>
                  <DialogActions onClick={handleClose}>
                    <CloseOutlinedIcon sx={{ color: "#696969" }} />
                  </DialogActions>
                </div>

                <Typography>
                  This is the content of the modal. You can put any content
                  here.
                </Typography>
              </DialogContent>
            </div>
          </div>
        </Dialog>
      </div>

      {/* ******************************************************* */}
    </>
  );
}
