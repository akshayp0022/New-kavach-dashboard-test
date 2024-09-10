import React, { useState } from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
  Typography,
} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import KeyOutlinedIcon from "@mui/icons-material/KeyOutlined";
import { Checkbox, Box, Button } from "@mui/material";
import { Menu, Shield } from "@mui/icons-material";

function InputFields() {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div>
      {/* Email Input */}
      <TextField
        label="Email"
        type="email"
        fullWidth
        margin="normal"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <MailOutlineIcon />
            </InputAdornment>
          ),
        }}
        variant="outlined"
      />

      {/* Password Input */}
      <TextField
        label="Password"
        type={showPassword ? "text" : "password"}
        fullWidth
        margin="normal"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {/* You can replace this with any other password icon */}
              <KeyOutlinedIcon />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                edge="end"
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        variant="outlined"
      />

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: 'center'}}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Checkbox defaultChecked />
          <span style={{ color: "#5764e2", letterSpacing: "0.3px" }}>
            Remember me
          </span>
        </Box>

        <Typography variant="a" sx={{ color: "blue", cursor: "pointer" }}>
          Forgot Password ?
        </Typography>
      </Box>

      <Button id="login_btn" variant="contained">
        Log in
      </Button>
    </div>
  );
}

export default InputFields;
