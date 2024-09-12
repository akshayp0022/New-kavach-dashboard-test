import * as React from "react";
import { Security, Shield } from "@mui/icons-material";
import { Box, Container, Typography, Input } from "@mui/material";
import InputFields from "./SignUp/Input";
import "../css/AuthPages.css";

const SignUpPage = () => {
  return (
    <Container maxWidth={"xl"} id="signUpContainer">
      <Box>
        <Typography className="logo">
          <Shield sx={{ color: "#6754E2", fontSize: "3em" }} />
          <div>
            <span id="KLetter">K</span>
            <span id="restLetter">avach</span>
          </div>
        </Typography>

        <Typography variant="h3" fontSize={36} fontWeight={600}>
          Log in to your Account
        </Typography>
        <Typography>Welcome back! Enter your credentials to login:</Typography>
        <InputFields />
      </Box>

      <Box id="imageContainer">
        <Security id="shieldIconContainer" />
      </Box>
    </Container>
  );
};

export default SignUpPage;
