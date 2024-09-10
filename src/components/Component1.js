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
            {pageName}
        </Typography>

    </Box>
  );
}


export default C1;