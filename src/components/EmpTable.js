import React, { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { Container, Typography } from "@mui/material";
import { useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import SettingsSuggestOutlinedIcon from "@mui/icons-material/SettingsSuggestOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import NumbersOutlinedIcon from "@mui/icons-material/NumbersOutlined";
import { TextIcon, RoundNameCircle, BadgeIcon } from "./Table/TableComponents";
import TransitionsModal from "./Modal";
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

  // const { employees, fetchEmployees } = useEmployeeContext();
  const { statusData } = useStatus();
  const { employees, loading, error, status } = useEmployeeContext();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [modalContent, handleModalContent] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [currentEmployeeId, setCurrentEmployeeId] = useState(null);

  // useEffect(() => {
  //   fetchEmployees();
  // }, []);

  const handleChangePage = (newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleClickOpen = (employeeId) => {
    setCurrentEmployeeId(employeeId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentEmployeeId(null);
    setActiveItem("Features Settings");
    handleModalContent("Features Settings");
  };

  const handleChangeModalContent = (newValue) => {
    handleModalContent(newValue);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading employees</div>;
  // console.log("STAIUS is ", status);

  const rowsData =
    (employees?.length > 0 &&
      employees.map(({ name, _id, employeeId, email }, index) => {
        const employeeStatus =
          statusData?.[employeeId]?.status ||
          status?.[employeeId] ||
          "deactivated";
        // console.log("EMP STATUS IS ", employeeStatus);

        return {
          id: index + 1,
          status: <BadgeIcon status={employeeStatus} />,
          name: (
            <div>
              <RoundNameCircle
                name={(name || "").trim()}
                status={employeeStatus}
              />{" "}
              {employeeId}
            </div>
          ),
          email,
          action: (
            <MoreHorizIcon
              id="tableCellHoriz"
              onClick={(e) => {
                e.stopPropagation();
                handleClickOpen(employeeId);
              }}
            />
          ),
          employeeId,
        };
      })) ||
    [];

  const Newcolumns = [
    {
      field: "id",
      renderHeader: () => (
        <TextIcon
          text={"No."}
          Icon={<NumbersOutlinedIcon sx={{ color: "#6754E2" }} />}
        />
      ),
      width: 60,
      align: "center",
    },
    {
      field: "name",
      renderHeader: () => (
        <TextIcon
          text={"Name"}
          Icon={<AccountCircleIcon sx={{ color: "#6754E2" }} />}
        />
      ),
      renderCell: (params) => params.value,
      flex: 1,
      minWidth: 150,
      align: "right",
    },
    {
      field: "email",
      renderHeader: () => (
        <TextIcon
          text={"Email"}
          Icon={<BadgeOutlinedIcon sx={{ color: "#6754E2" }} />}
        />
      ),
      flex: 1,
      minWidth: 200,
      align: "left",
    },
    {
      field: "employeeId",
      renderHeader: () => (
        <TextIcon
          text={"Employee Id"}
          Icon={<BadgeOutlinedIcon sx={{ color: "#6754E2" }} />}
        />
      ),
      flex: 1,
      minWidth: 150,
      align: "left",
    },
    {
      field: "status",
      renderHeader: () => (
        <TextIcon
          text={"Status"}
          Icon={<CheckCircleOutlineIcon sx={{ color: "#6754E2" }} />}
        />
      ),
      flex: 1,
      renderCell: (params) => params.value,
      minWidth: 150,
      align: "center",
    },
    {
      field: "action",
      renderHeader: () => (
        <TextIcon
          text={"Action"}
          Icon={<SettingsSuggestOutlinedIcon sx={{ color: "#6754E2" }} />}
        />
      ),
      renderCell: (params) => params.value,
      width: 100,
      align: "center",
    },
  ];

  return (
    <>
      <Container
        maxWidth={isSmallScreen ? false : "100vw"}
        sx={{
          width: "100%",
          marginTop: "5em",
          paddingBottom: "2em",
          height: "calc(100vh - 5em)",
          overflow: "hidden",
        }}
        className="tableData"
        id="tableData"
      >
        <Paper
          sx={{ width: "100%", height: "100%", overflow: "hidden" }}
          id="tablePaper"
          style={{
            width: isSideBarOpen ? "83%" : "92vw",
            height: "100%",
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
          </div>
          <Paper
            sx={{
              height: "calc(100% - 4em)",
              width: "100%",
              overflow: "auto",
            }}
          >
            <DataGrid
              rows={rowsData}
              checkboxSelection
              columns={Newcolumns}
              sx={{ border: 0 }}
              style={{
                height: "100%",
                overflowY: "hidden",
              }}
            />
          </Paper>
        </Paper>
      </Container>

      <EmployeeModal
        open={open}
        handleClose={handleClose}
        employees={employees}
        status={status}
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
