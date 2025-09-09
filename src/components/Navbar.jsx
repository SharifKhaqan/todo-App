import { useState } from "react";
import {Box,Button,TextField,Typography,Link,Menu,MenuItem,} from "@mui/material";
import { Search } from "@mui/icons-material";

export default function Navbar({search,setSearch,handleLogout,sortOrder,setSortOrder,variant = "user",onNavigate,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleSortClick = (event) => setAnchorEl(event.currentTarget);
  const handleSortSelect = (order) => {
    setSortOrder(order);
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-between",
        alignItems: { xs: "flex-start", sm: "center" },
        borderBottom: "1px solid rgba(0,0,0,0.2)",
        mb: 3,
        py: 1,
        gap: { xs: 2, sm: 0 },
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          color: "#000",
          textAlign: { xs: "center", sm: "left" },
          width: { xs: "100%", sm: "auto" },
        }}
      >
        Todo-App
      </Typography>

      {/* Right Section:*/}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
          justifyContent: { xs: "center", sm: "flex-end" },
          width: { xs: "100%", sm: "auto" },
        }}
      >
        {variant === "user" ? (
          <>
            {/* Search Field */}
            <TextField
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ color: "#757575", mr: 1 }} />,
              }}
              sx={{
                width: { xs: "100%", sm: "220px" },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: "#fff",
                },
              }}
            />

            {/* Sort Button */}
            <Button
              variant="outlined"
              onClick={handleSortClick}
              sx={{
                borderColor: "#0B3C95",
                color: "#0B3C95",
                borderRadius: "8px",
                textTransform: "none",
                padding: "12px 16px",
                fontWeight: 500,
                minWidth: "100px",
              }}
            >
              {sortOrder === "latest" ? "Latest" : "Oldest"}
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={() => setAnchorEl(null)}
              PaperProps={{ sx: { minWidth: "160px" } }}
            >
              <MenuItem
                onClick={() =>
                  handleSortSelect(sortOrder === "latest" ? "oldest" : "latest")
                }
              >
                {sortOrder === "latest" ? "Oldest" : "Latest"}
              </MenuItem>
            </Menu>
          </>
        ) : (
          <>
            {/* Admin Links */}
            <Link
              component="button"
              underline="hover"
              sx={{ fontSize: "16px", fontWeight: 500, color: "#0B3C95" }}
              onClick={() => onNavigate("todos")}
            >
              Total Todos
            </Link>
            <Link
              component="button"
              underline="hover"
              sx={{ fontSize: "16px", fontWeight: 500, color: "#0B3C95" }}
              onClick={() => onNavigate("users")}
            >
              Total Users
            </Link>
          </>
        )}

        {/* Logout Button */}
        <Button
          variant="outlined"
          onClick={handleLogout}
          sx={{
            borderColor: "#0B3C95",
            color: "#0B3C95",
            borderRadius: "8px",
            textTransform: "none",
            padding: "12px 16px",
            fontWeight: 500,
            minWidth: "100px",
            "&:hover": {
              backgroundColor: "rgba(11, 60, 149, 0.04)",
              borderColor: "#0B3C95",
            },
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
}
