import React from "react";
import { useAppContext } from "../AppContext";
import { BarChart } from "@mui/x-charts/BarChart";
import {
  Box,
  Container,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";

const DownloadHistoryList = () => {
  const { downloadHistory } = useAppContext();
  const { Chrome, FireFox, Edge } = downloadHistory;
  console.log(Chrome, FireFox, Edge);
  return (
    <List>
      {Chrome.map((value) => {
        return (
          <ListItem id="downloadHistoryList">
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
                <b>Device: </b>{value[0]}
              </Typography>
              <Typography
                variant="p"
                sx={{ display: "block", textAlign: "justify" }}
                fontSize={18}
              >
                <b>Date and Time: </b>{value[4]}
              </Typography>
            </ListItemText>
          </ListItem>
        );
      })}
    </List>
  );
};

const DownloadHistory = () => {
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

        <DownloadHistoryList />
      </Container>
    </>
  );
};

export default DownloadHistory;
