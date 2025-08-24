import { useState } from "react";
import {Box,Grid,Typography,TextField,InputAdornment,IconButton,CssBaseline,FormControlLabel,Checkbox} from "@mui/material";
import {Email,Lock,Person,Visibility,VisibilityOff,} from "@mui/icons-material";
import signupPicture from "../assets/signupPicture.png";
import CustomButton from "../components/Button";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const handleClickShowPassword = () => setShowPassword((s) => !s);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((s) => !s);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const validate = () => {
    let tempErrors = {};
    if (!formData.fullName) tempErrors.fullName = "Full name is required";
    if (!formData.email) tempErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      tempErrors.email = "Email is invalid";
    if (!formData.password) tempErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword)
      tempErrors.confirmPassword = "Passwords do not match";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) console.log("Signup submitted", formData);
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
              src={signupPicture}
              alt="Signup Illustration"
              sx={{
                maxWidth: "90%",
                height: "auto",
                mt: -3,
                userSelect: "none",
              }}
            />{" "}
            <Typography
              variant="body1"
              sx={{ mt: 0, mb: 0, p: 0, lineHeight: 1.4 }}
            >
              {" "}
              Join us today and organize your tasks effortlessly. Create your
              account and start managing to-dos right away.{" "}
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
              Create new account{" "}
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
              Welcome! Please enter your details{" "}
            </Typography>{" "}
            <Box component="form" onSubmit={handleSubmit}>
              {" "}
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                {" "}
                <TextField
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  error={Boolean(errors.fullName)}
                  helperText={errors.fullName}
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
                        <Person />{" "}
                      </InputAdornment>
                    ),
                  }}
                />{" "}
              </Box>{" "}
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
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                {" "}
                <TextField
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={Boolean(errors.confirmPassword)}
                  helperText={errors.confirmPassword}
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
                          onClick={handleClickShowConfirmPassword}
                          edge="end"
                        >
                          {" "}
                          {showConfirmPassword ? (
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
      <FormControlLabel
        control={
          <Checkbox
            name="remember"
            checked={formData.remember}
            onChange={handleChange}
            sx={{
              borderRadius: "4px",
              transform: "scale(0.9)", 
              padding: "5px",
              ml: 1,
            }}
          />
        }
        label="Agree to our Terms and Conditions & Privacy Policy"
        sx={{
          "& .MuiFormControlLabel-label": {
            fontSize: "14px", 
            lineHeight: "20px",
            fontWeight: 400,
          },
        }}
      />
    </Box>
              <CustomButton text="Sign up" type="submit" />
            </Box>{" "}
          </Box>{" "}
        </Grid>{" "}
      </Grid>{" "}
    </Box>
  );
}
