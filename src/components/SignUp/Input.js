import React, { useEffect, useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../AppContext";
import { Checkbox, Box, Button } from "@mui/material";

function InputFields() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({});
  const { setLoggedIn } = useAppContext();
  const navigate = useNavigate();
  const handleClickShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const payload = formData;

  const handleInput = (event) => {
    const { value, name } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLogin = async () => {
    console.log(formData);
    const response = await fetch("http://localhost:5001/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (data.token) {
      sessionStorage.setItem("jwtToken", data.token);
      setLoggedIn(true);
      navigate("/");
    } else {
      alert("Invalid User");
    }

    console.log("Hello World");
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Enter") {
        handleLogin();
      }
    }
    window.addEventListener("keyup", handleKey);
    return () => window.removeEventListener('keyup', handleKey)
  }, []);

  return (
    <div>
      {/* Email Input */}
      <TextField
        label="Name"
        name="userName"
        type="text"
        id="name"
        fullWidth
        onChange={handleInput}
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
        id="password"
        name="password"
        label="Password"
        onChange={handleInput}
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

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
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

      <Button id="login_btn" variant="contained" onClick={handleLogin}>
        Log in
      </Button>
    </div>
  );
}

export default InputFields;
