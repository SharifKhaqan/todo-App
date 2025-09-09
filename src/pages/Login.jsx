import { useState } from "react";
import {Box,Grid,Typography,TextField,InputAdornment,IconButton,Checkbox,FormControlLabel,Link,CssBaseline,
  Snackbar,Alert,} from "@mui/material";
import { Email, Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import loginPicture from "../assets/loginpicture.png";
import CustomButton from "../components/Button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleClickShowPassword = () => setShowPassword((s) => !s);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (loading) setLoading(false);
  };

  //Validate form fields
  const validate = () => {
    let tempErrors = {};
    if (!formData.email) tempErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      tempErrors.email = "Email is invalid";
    if (!formData.password) tempErrors.password = "Password is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const result = await login({
        email: formData.email,
        password: formData.password,
      });

      if (result.success) {
        setSnackbar({
          open: true,
          message: "Login successful! Redirecting...",
          severity: "success",
        });

        const token = localStorage.getItem("token");
        const decoded = token ? jwtDecode(token) : null;

        setTimeout(() => {
          if (decoded?.role === "admin") navigate("/admin");
          else navigate("/");
        }, 1000);
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Invalid email or password";
      setSnackbar({ open: true, message: errorMsg, severity: "error" });
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
              src={loginPicture}
              alt="Login Illustration"
              sx={{
                maxWidth: "90%",
                height: "auto",
                mb: 2,
                userSelect: "none",
              }}
            />
            <Typography variant="body">
              Manage your tasks efficiently and stay organized. Sign in to
              track, add, and complete your to-dos effortlessly.
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
              Sign in to your account
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
              Welcome back! Please enter your details
            </Typography>

            {/* Login Form */}
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

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: { xs: 1, sm: 0 },
                  width: "100%",
                  mt: 1,
                }}
              >
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
                />
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
                  Forgot Password?
                </Link>
              </Box>

              <CustomButton
                text={loading ? "Logging in..." : "Login"}
                type="submit"
                disabled={loading}
              />

              <Typography
                variant="body2"
                align="center"
                sx={{ fontWeight: 400, fontSize: "16px", mt: 2 }}
              >
                Do not have account yet?{" "}
                <Link
                  href="/signup"
                  underline="hover"
                  sx={{ fontWeight: 500, fontSize: "16px" }}
                >
                  Create new account
                </Link>
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%", borderRadius: "8px" }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
