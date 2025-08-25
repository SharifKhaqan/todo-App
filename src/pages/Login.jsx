import { useState } from "react";
import {Box,Grid,Typography,TextField,InputAdornment,IconButton,Checkbox,FormControlLabel,Link,CssBaseline} from "@mui/material";
import { Email, Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import loginPicture from "../assets/loginpicture.png";
import CustomButton from "../components/Button";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [errors, setErrors] = useState({});
  const handleClickShowPassword = () => setShowPassword((s) => !s);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  
  const validate = () => {
    let tempErrors = {};
    if (!formData.email) tempErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      tempErrors.email = "Email is invalid";
    if (!formData.password) tempErrors.password = "Password is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) console.log("Form submitted", formData);
  };
  
  
  return (
    <Box sx={{ width: "100vw", height: "100vh", m: 0, p: 0 }}>
      {" "}
      <CssBaseline />{" "}
      <Grid container sx={{ height: "100%" }}>
        {" "}
        {/* Left Section */}{" "}
        <Grid
          item
          xs={7}
          sx={{
            background: "linear-gradient(180deg, #4A9DE0, #0B3B95)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            textAlign: "center",
            width: "53%",
          }}
        >
          {" "}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              px: 2,
            }}
          >
            {" "}
            <Box
              component="img"
              src={loginPicture}
              alt="Login Illustration"
              sx={{
                maxWidth: "90%",
                height: "auto",
                mb: 2,
                userSelect: "none",
              }}
            />{" "}
            <Typography variant="body">
              {" "}
              Manage your tasks efficiently and stay organized. Sign in to
              track, add, and complete your to-dos effortlessly.{" "}
            </Typography>{" "}
          </Box>{" "}
        </Grid>{" "}
        
        {/* Right Section */}{" "}
        <Grid
          item
          xs={5}
          sx={{
            display: "flex",
            alignItems: "start",
            justifyContent: "center",
            pl: 13,
          }}
        >
          {" "}
          <Box sx={{ width: "100%", maxWidth: "100%", p: 5 }}>
            {" "}
            <Typography
              variant="h5"
              sx={{ position: "relative", bottom: 28, right: 130, pl: 2 }}
            >
              {" "}
              ToDo-App{" "}
            </Typography>{" "}
            <Typography
              variant="h6"
              sx={{
                mt: 3,
                textAlign: "center",
                fontWeight: 500,
                fontSize: "32px",
                lineHeight: "42px",
                color: "#000000",
              }}
            >
              {" "}
              Sign in to your account{" "}
            </Typography>{" "}
            <Typography
              variant="body2"
              sx={{
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "24px",
                color: "#4A90E2",
                mt: 1,
                textAlign: "center",
              }}
            >
              {" "}
              Welcome back! Please enter your details{" "}
            </Typography>{" "}
            <Box component="form" onSubmit={handleSubmit}>
              {" "}
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                {" "}
                <TextField
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={Boolean(errors.email)}
                  helperText={errors.email}
                  margin="normal"
                  sx={{
                    width: "400px",
                    backgroundColor: "white",
                    "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {" "}
                        <Email />{" "}
                      </InputAdornment>
                    ),
                  }}
                />{" "}
              </Box>{" "}
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                {" "}
                <TextField
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  error={Boolean(errors.password)}
                  helperText={errors.password}
                  margin="normal"
                  sx={{
                    width: "400px",
                    backgroundColor: "white",
                    "& .MuiOutlinedInput-root": { borderRadius: "16px" },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {" "}
                        <Lock />{" "}
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        {" "}
                        <IconButton
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {" "}
                          {showPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}{" "}
                        </IconButton>{" "}
                      </InputAdornment>
                    ),
                  }}
                />{" "}
              </Box>{" "}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {" "}
                <FormControlLabel
                  control={
                    <Checkbox
                      name="remember"
                      checked={formData.remember}
                      onChange={handleChange}
                      sx={{ borderRadius: "8px" }}
                    />
                  }
                  label="Remember me"
                />{" "}
                <Link
                  href="#"
                  underline="hover"
                  sx={{
                    fontWeight: 500,
                    fontSize: "14px",
                    lineHeight: "20px",
                    color: "#4A90E2",
                  }}
                >
                  {" "}
                  Forgot Password?{" "}
                </Link>{" "}
              </Box>{" "}
              <CustomButton text="Login" type="submit" />
              <Typography
                variant="body2"
                align="center"
                sx={{ fontWeight: 400, fontSize: "16px", mt: 2 }}
              >
                {" "}
                Do not have account yet?{" "}
                <Link
                  href="/register"
                  underline="hover"
                  sx={{ fontWeight: 500, fontSize: "16px" }}
                >
                  {" "}
                  Create new account{" "}
                </Link>{" "}
              </Typography>{" "}
            </Box>{" "}
          </Box>{" "}
        </Grid>{" "}
      </Grid>{" "}
    </Box>
  );
}