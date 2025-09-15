import { useState } from "react";
import {Box,Grid,Typography,TextField,InputAdornment,IconButton,CssBaseline,FormControlLabel,Checkbox,Snackbar,Alert,
} from "@mui/material";
import {Email,Lock,Person,Visibility,VisibilityOff,} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import signupPicture from "../assets/signupPicture.png";
import CustomButton from "../components/Button";
import { signup } from "../services/auth";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    remember: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((s) => !s);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((s) => !s);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Validate form fields
  const validate = () => {
    let tempErrors = {};
    if (!formData.fullName) tempErrors.fullName = "Full name is required";
    if (!formData.email) tempErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      tempErrors.email = "Email is invalid";
    if (!formData.password) tempErrors.password = "Password is required";
    if (!formData.confirmPassword)
      tempErrors.confirmPassword = "Confirm password is required";
    else if (formData.password !== formData.confirmPassword)
      tempErrors.confirmPassword = "Passwords do not match";
    if (!formData.remember) tempErrors.remember = "You must agree to the terms";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      setErrors({});
      await signup({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
      });

      setSnackbar({
        open: true,
        message: "Registration successful! Redirecting to login...",
        severity: "success",
      });
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setSnackbar({
        open: true,
        message:
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Signup failed",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: "100vw", height: "100vh", m: 0, p: 0 }}>
      <CssBaseline />
      <Grid container sx={{ height: "100%" }}>
        {/* Left Section */}
        <Grid
          item
          xs={false}
          sm={false}
          md={false}
          lg={7}
          sx={{
            background: "linear-gradient(180deg, #4A9DE0, #0B3B95)",
            display: { xs: "none", sm: "none", md: "none", lg: "flex" },
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            textAlign: "center",
            width: "53%",
          }}
        >
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
            <Box
              component="img"
              src={signupPicture}
              alt="Signup Illustration"
              sx={{
                maxWidth: "90%",
                height: "auto",
                mb: 2,
                userSelect: "none",
              }}
            />
            <Typography variant="body1" sx={{ lineHeight: 1.4 }}>
              Join us today and organize your tasks effortlessly. Create your
              account and start managing to-dos right away.
            </Typography>
          </Box>
        </Grid>

        {/* Right Form Section */}
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={5}
          sx={{
            display: "flex",
            alignItems: {
              xs: "flex-start",
              sm: "flex-start",
              md: "flex-start",
              lg: "center",
            },
            justifyContent: "center",
            pl: { xs: 2, sm: 20, md: 32, lg: 10 },
            pr: { xs: 2, sm: 4, md: 0, lg: 0 },
            pt: { xs: 2, sm: 3, md: 6, lg: 4 },
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 500,
              p: { xs: 2, sm: 3, md: 6, lg: 5 },
              mx: "auto",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                mb: 2,
                pl: { xs: 0, lg: 2 },
                textAlign: "left",
                mt: { xs: 0, sm: 0, md: -4, lg: -6 },
                position: "relative",
              }}
            >
              ToDo-App
            </Typography>

            <Typography
              variant="h6"
              sx={{
                mt: 2,
                textAlign: "center",
                fontWeight: 500,
                fontSize: { xs: "24px", sm: "28px", md: "32px" },
                lineHeight: { xs: "32px", sm: "38px", md: "42px" },
                color: "#000",
              }}
            >
              Create new account
            </Typography>
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
              Welcome! Please enter your details
            </Typography>

            {/* Signup Form */}
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <TextField
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                error={Boolean(errors.fullName)}
                helperText={errors.fullName}
                margin="normal"
                sx={{
                  width: "400px",
                  maxWidth: "100%",
                  backgroundColor: "white",
                  "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={Boolean(errors.email)}
                helperText={errors.email}
                margin="normal"
                sx={{
                  width: "400px",
                  maxWidth: "100%",
                  backgroundColor: "white",
                  "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
              />

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
                  maxWidth: "100%",
                  backgroundColor: "white",
                  "& .MuiOutlinedInput-root": { borderRadius: "16px" },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowPassword} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

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
                  maxWidth: "100%",
                  backgroundColor: "white",
                  "& .MuiOutlinedInput-root": { borderRadius: "16px" },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowConfirmPassword}
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    name="remember"
                    checked={formData.remember}
                    onChange={handleChange}
                    sx={{ borderRadius: "4px" }}
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

              <CustomButton
                text={loading ? "Signing up..." : "Sign up"}
                type="submit"
              />
            </Box>
          </Box>
        </Grid>
      </Grid>

      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
