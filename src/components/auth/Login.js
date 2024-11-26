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
import { useAuth } from "../../context/auth";
import { useNavigate } from "react-router-dom";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const [errors, setErrors] = useState({
    email: "",
    password: ""
  });

  const handleClickShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  // Basic email and password validators
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({ email: "", password: "" });

    // Perform validation checks
    let valid = true;

    // if (!validateEmail(username)) {
    //   setErrors(prev => ({ ...prev, email: "Please enter a valid email address" }));
    //   valid = false;
    // }

    // if (!validatePassword(password)) {
    //   setErrors(prev => ({ ...prev, password: "Password must be at least 8 characters long" }));
    //   valid = false;
    // }

    if (!valid) return;

    try {
      await login(username, password);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      {/* Email Input */}
      <TextField
        label="Email"
        name="userName"
        type="text"
        id="name"
        fullWidth
        margin="normal"
        value={username}
        placeholder="john.doe@gmail.com"
        onChange={(e) => setUsername(e.target.value)}
        error={!!errors.email}
        helperText={errors.email}
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
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        margin="normal"
        placeholder="*********"
        error={!!errors.password}
        helperText={errors.password}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
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

export default Login;
