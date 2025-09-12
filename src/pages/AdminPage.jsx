import {Container,Typography,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,CircularProgress,Button,
  Box,TextField,Menu,MenuItem,} from "@mui/material";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import {getAllUsers,getAllTodos,getCompletedDailyStats,} from "../services/todos.js";
import { useNavigate, useLocation } from "react-router-dom";
import {LineChart,Line,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer,} from "recharts";
import { Search } from "@mui/icons-material";

export default function AdminPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const initialView = queryParams.get("view") || "dashboard";
  const [view, setView] = useState(initialView);

  const [users, setUsers] = useState([]);
  const [todos, setTodos] = useState([]);
  const [totalTodos, setTotalTodos] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [dailyStats, setDailyStats] = useState([]);

  // Search + Sort states for users and todos
  const [userSearch, setUserSearch] = useState("");
  const [userSortOrder, setUserSortOrder] = useState("latest");
  const [userSortAnchor, setUserSortAnchor] = useState(null);
  const userSortOpen = Boolean(userSortAnchor);

  const [todoSearch, setTodoSearch] = useState("");
  const [todoSortOrder, setTodoSortOrder] = useState("latest");
  const [todoSortAnchor, setTodoSortAnchor] = useState(null);
  const todoSortOpen = Boolean(todoSortAnchor);

  // Navigation between views
  const handleNavigate = (page) => {
    setView(page);
    navigate(`?view=${page}`);
    setPage(1);
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // Format date helper
  const formatDate = (isoString) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
    });
  };

  // Keep `view` in sync with URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const currentView = params.get("view") || "dashboard";
    setView(currentView);
  }, [location.search]);

  // Fetch data dynamically based on selected view
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (view === "users") {
          const data = await getAllUsers(userSearch, page, 5, userSortOrder);
          setUsers(data);
        } else if (view === "todos") {
          const { todos, totalTodos } = await getAllTodos(
            todoSearch,
            page,
            5,
            todoSortOrder
          );
          setTodos(todos);
          setTotalTodos(totalTodos);
        } else if (view === "dashboard") {
          const res = await getCompletedDailyStats();
          const formatted = (res || []).map((item) => ({
            date: formatDate(item._id),
            completed: item.total,
          }));
          setDailyStats(formatted);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [view, page, userSearch, userSortOrder, todoSearch, todoSortOrder]);

  // Sorting Handlers
  const handleUserSortClick = (e) => setUserSortAnchor(e.currentTarget);
  const handleUserSortClose = (order) => {
    if (order) {
      setUserSortOrder(order);
      setPage(1);
    }
    setUserSortAnchor(null);
  };

  const handleTodoSortClick = (e) => setTodoSortAnchor(e.currentTarget);
  const handleTodoSortClose = (order) => {
    if (order) {
      setTodoSortOrder(order);
      setPage(1);
    }
    setTodoSortAnchor(null);
  };

  return (
    <>
      <Navbar
        variant="admin"
        handleLogout={handleLogout}
        onNavigate={handleNavigate}
      />

      <Container
        maxWidth="lg"
        disableGutters
        sx={{ mt: 2, px: 2, textAlign: "center" }}
      >
        {/* Dashboard view with line chart */}
        {view === "dashboard" && (
          <>
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", color: "#0B3C95", mb: 4 }}
            >
              Admin Dashboard - Daily Completed Tasks
            </Typography>

            {loading ? (
              <CircularProgress />
            ) : dailyStats.length > 0 ? (
              <Box
                sx={{
                  width: "100%",
                  height: { xs: 300, sm: 400, md: 400 },
                  background: "#fff",
                  p: { xs: 1, sm: 2 },
                  borderRadius: 2,
                  boxShadow: 2,
                  overflowX: "auto",
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={dailyStats}
                    margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      label={{
                        value: "Date",
                        position: "insideBottom",
                        offset: -5,
                      }}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      label={{
                        value: "Completed Tasks",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <Tooltip
                      formatter={(value) => [`${value} tasks`, "Completed"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="completed"
                      stroke="#0B3C95"
                      strokeWidth={3}
                      dot={{
                        r: 6,
                        stroke: "#0B3C95",
                        strokeWidth: 2,
                        fill: "#fff",
                      }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            ) : (
              <Typography sx={{ color: "red", fontWeight: "bold", mt: 3 }}>
                No data available for Daily Completed Tasks
              </Typography>
            )}
          </>
        )}

        {/* Todos view with search, sort & pagination */}
        {view === "todos" && (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                mb: 2,
                width: "100%",
                alignItems: "center",
              }}
            >
              <TextField
                placeholder="Search todos..."
                value={todoSearch}
                onChange={(e) => {
                  setTodoSearch(e.target.value);
                  setPage(1);
                }}
                InputProps={{
                  startAdornment: <Search sx={{ color: "#757575", mr: 1 }} />,
                }}
                sx={{
                  flex: { xs: 1, sm: "unset" },
                  maxWidth: { sm: "60%", md: "40%" },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px 0 0 12px",
                    backgroundColor: "#fff",
                    height: "40px",
                  },
                }}
              />

              <Button
                variant="outlined"
                onClick={handleTodoSortClick}
                sx={{
                  textTransform: "none",
                  borderRadius: "0 12px 12px 0",
                  height: "40px",
                  minWidth: 110,
                }}
              >
                {todoSortOrder === "latest" ? "Newest" : "Oldest"}
              </Button>

              <Menu
                anchorEl={todoSortAnchor}
                open={todoSortOpen}
                onClose={() => handleTodoSortClose(null)}
              >
                <MenuItem
                  onClick={() =>
                    handleTodoSortClose(
                      todoSortOrder === "latest" ? "oldest" : "latest"
                    )
                  }
                >
                  {todoSortOrder === "latest" ? "Oldest" : "Newest"}
                </MenuItem>
              </Menu>
            </Box>

            <Typography variant="h5" sx={{ color: "#0B3C95", mb: 1 }}>
              All Todos
            </Typography>

            <Typography variant="body1" sx={{ mb: 2, fontWeight: "bold" }}>
              Total Todos: {totalTodos}
            </Typography>

            {loading ? (
              <CircularProgress />
            ) : (
              <>
                <Box sx={{ width: "100%", overflowX: "auto" }}>
                  <TableContainer
                    component={Paper}
                    sx={{
                      minWidth: { xs: 600, sm: 800, md: 1000 },
                      margin: "0 auto",
                    }}
                  >
                    <Table sx={{ minWidth: 600 }}>
                      <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                        <TableRow>
                          <TableCell align="left">
                            <strong>Task</strong>
                          </TableCell>
                          <TableCell align="center">
                            <strong>Status</strong>
                          </TableCell>
                          <TableCell align="center">
                            <strong>Created At</strong>
                          </TableCell>
                          <TableCell align="center">
                            <strong>Updated At</strong>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {todos.length > 0 ? (
                          todos.map((todo) => (
                            <TableRow key={todo._id}>
                              <TableCell align="left">{todo.task}</TableCell>
                              <TableCell align="center">{todo.status}</TableCell>
                              <TableCell align="center">
                                {formatDate(todo.createdAt)}
                              </TableCell>
                              <TableCell align="center">
                                {formatDate(todo.updatedAt)}
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={4} align="center">
                              No todos found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    gap: 2,
                    mt: 3,
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    sx={{ minWidth: 120 }}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => setPage((prev) => prev + 1)}
                    disabled={todos.length < 5}
                    sx={{ minWidth: 120 }}
                  >
                    Next
                  </Button>
                </Box>
              </>
            )}
          </>
        )}

        {/* Users view */}
        {view === "users" && (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                mb: 2,
                width: "100%",
                alignItems: "center",
              }}
            >
              <TextField
                placeholder="Search users..."
                value={userSearch}
                onChange={(e) => {
                  setUserSearch(e.target.value);
                  setPage(1);
                }}
                InputProps={{
                  startAdornment: <Search sx={{ color: "#757575", mr: 1 }} />,
                }}
                sx={{
                  flex: { xs: 1, sm: "unset" },
                  maxWidth: { sm: "60%", md: "40%" },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px 0 0 12px",
                    backgroundColor: "#fff",
                    height: "40px",
                  },
                }}
              />

              <Button
                variant="outlined"
                onClick={handleUserSortClick}
                sx={{
                  textTransform: "none",
                  borderRadius: "0 12px 12px 0",
                  height: "40px",
                  minWidth: 110,
                }}
              >
                {userSortOrder === "latest" ? "Newest" : "Oldest"}
              </Button>

              <Menu
                anchorEl={userSortAnchor}
                open={userSortOpen}
                onClose={() => handleUserSortClose(null)}
              >
                <MenuItem
                  onClick={() =>
                    handleUserSortClose(
                      userSortOrder === "latest" ? "oldest" : "latest"
                    )
                  }
                >
                  {userSortOrder === "latest" ? "Oldest" : "Newest"}
                </MenuItem>
              </Menu>
            </Box>

            <Typography variant="h5" sx={{ color: "#0B3C95", mb: 2 }}>
              All Users
            </Typography>

            {loading ? (
              <CircularProgress />
            ) : (
              <>
                <TableContainer
                  component={Paper}
                  sx={{ maxWidth: 800, margin: "0 auto" }}
                >
                  <Table sx={{ minWidth: 600 }}>
                    <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                      <TableRow>
                        <TableCell align="left">
                          <strong>Name</strong>
                        </TableCell>
                        <TableCell align="left">
                          <strong>Email</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Total Todos</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.length > 0 ? (
                        users.map((user) => (
                          <TableRow key={user._id}>
                            <TableCell align="left">{user.name}</TableCell>
                            <TableCell align="left">{user.email}</TableCell>
                            <TableCell align="center">
                              {user.totalTodos}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} align="center">
                            No users found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    gap: 2,
                    mt: 3,
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    sx={{ minWidth: 120 }}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => setPage((prev) => prev + 1)}
                    disabled={users.length < 5}
                    sx={{ minWidth: 120 }}
                  >
                    Next
                  </Button>
                </Box>
              </>
            )}
          </>
        )}
      </Container>
    </>
  );
}
