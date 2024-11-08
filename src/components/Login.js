import * as React from "react";
import { Security, Shield } from "@mui/icons-material";
import { Box, Container, Typography, Input } from "@mui/material";
import "../css/AuthPages.css";
import Login from "./auth/Login";

const SignUpPage = () => {
  return (
    <Container maxWidth={"xl"} id="signUpContainer">
      <Box>
        <Typography className="logo">
          <Shield sx={{ color: "#6754E2", fontSize: "3em" }} />
          <span>
            <span id="KLetter">K</span>
            <span id="restLetter">avach</span>
          </span>
        </Typography>

        <Typography variant="h3" fontSize={36} fontWeight={600}>
          Log in to your Account
        </Typography>
        <Typography>Welcome back! Enter your credentials to login:</Typography>
        <Login />
      </Box>

      <Box id="imageContainer">
        <Security id="shieldIconContainer" />
      </Box>
    </Container>
  );
};

export default SignUpPage;
