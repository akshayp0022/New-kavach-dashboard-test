import React, { useState, useEffect } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import {
  Container,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import io from "socket.io-client";
import { ws } from "../../utils/endpoints";

const DownloadHistoryList = ({ downloadHistory }) => {
  const { Chrome, FireFox, Edge } = downloadHistory;

  return (
    <List>
      {Chrome?.map((value, index) => (
        <ListItem key={index} id="downloadHistoryList">
          <ListItemText>
            <Typography
              variant="p"
              sx={{ display: "block", textAlign: "justify" }}
              fontSize={18}
            >
              <b>Link: </b>
              {value[1]}
            </Typography>
            <Typography
              variant="p"
              sx={{ display: "block", textAlign: "justify" }}
              fontSize={18}
            >
              <b>Device: </b>
              {value[0]}
            </Typography>
            <Typography
              variant="p"
              sx={{ display: "block", textAlign: "justify" }}
              fontSize={18}
            >
              <b>Date and Time: </b>
              {value[4]}
            </Typography>
          </ListItemText>
        </ListItem>
      ))}
    </List>
  );
};

const DownloadHistory = ({ currentEmployee }) => {
  const [downloadHistory, setDownloadHistory] = useState({
    Chrome: [],
    FireFox: [],
    Edge: [],
  });
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [socket, setSocket] = useState(null);

  console.log(currentEmployee.employeeId);

  useEffect(() => {
    if (currentEmployee?.employeeId) {
      setSelectedEmployee(currentEmployee.employeeId);
      console.log("Selected employee:", currentEmployee.employeeId);

      const newSocket = io(ws, {
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 2000,
      });

      newSocket.on("connect", () => {
        console.log("Connected to WebSocket");

        if (currentEmployee?.employeeId) {
          newSocket.emit("getDownloadHistory", currentEmployee.employeeId);
        }
      });

      newSocket.on("disconnect", () => {
        console.log("Disconnected from WebSocket");
      });

      newSocket.on("sendDownloadHistory", (data) => {
        console.log("Received data from server:", data);
        if (data?.data?.employeeId === currentEmployee.employeeId) {
          console.log("History matched, updating state");
          setDownloadHistory(data.data.history);
        } else {
          console.log("Employee ID does not match.");
        }
      });

      newSocket.on("error", (message) => {
        console.error("Socket error:", message);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [currentEmployee]);

  const handleGetDownloadHistory = () => {
    if (socket && socket.connected && currentEmployee?.employeeId) {
      socket.emit("getDownloadHistory", currentEmployee.employeeId);
    } else {
      console.log("WebSocket is not open. Reconnecting...");
      socket?.connect();
    }
  };

  return (
    <>
      <Container id="downloadHistory">
        <Grid container>
          <Grid item xs={12} sm={6} md={6} flexGrow={2}>
            <div>
              <BarChart
                sx={{ padding: "0" }}
                series={[{ data: [80, 44, 24, 21, 10, 56] }]}
                height={290}
                width={450}
                xAxis={[
                  {
                    data: [
                      "Google",
                      "Youtube",
                      "Gmail",
                      "W.Web",
                      "Instagram",
                      "LinkedIn",
                    ],
                    scaleType: "band",
                  },
                ]}
                margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
              />
            </div>
          </Grid>

          <Grid item xs={12} sm={6} md={6} flexGrow={1}>
            <div>
              <PieChart
                series={[
                  {
                    data: [
                      { id: 0, value: 10, label: "series A" },
                      { id: 1, value: 15, label: "series B" },
                      { id: 2, value: 20, label: "series C" },
                    ],
                  },
                ]}
                width={450}
                height={250}
              />
            </div>
          </Grid>
        </Grid>
      </Container>

      <Container sx={{ mt: 2 }}>
        <Typography variant="h6">Records</Typography>
        <DownloadHistoryList downloadHistory={downloadHistory} />
      </Container>
    </>
  );
};

export default DownloadHistory;
