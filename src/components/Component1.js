import * as React from "react";
import { Box, Typography } from "@mui/material";

function C1({ pageName }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
        <Typography variant="h1">
            <h1>Hello User this is Harish</h1>
        </Typography>

    </Box>
  );
}


export default C1;