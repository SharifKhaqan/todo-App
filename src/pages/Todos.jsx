import { useState, useEffect } from "react";
import { Box, Button, Container, List, ListItem, ListItemText, TextField, Typography, IconButton } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { addTodo as addTodoApi, updateTodo as updateTodoApi, deleteTodo as deleteTodoApi, getTodos as getTodosApi, updateTodoStatus as updateTodoStatusApi } from "../services/todos";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function TodoPage() {
  const [newTodo, setNewTodo] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("latest");
  const [message, setMessage] = useState(null);
  const [totalTodos, setTotalTodos] = useState(0); 
  const { todos, setTodos, logout, loading } = useAuth();
  const navigate = useNavigate();

  // Reset to first page whenever search changes
  useEffect(() => setPage(1), [search]);

  // Fetch todos when filters (search, page, sortOrder) change
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const result = await getTodosApi(search, page, sortOrder);
        setTodos(result.todos);
        setTotalTodos(result.totalTodos || 0);
        setMessage(result.message || null);
      } catch (err) {
        console.error("Failed to fetch todos:", err);
      }
    };
    fetchTodos();
  }, [search, page, sortOrder, setTodos]);

  // Add new todo
  const handleAdd = async () => {
    if (!newTodo.trim()) return;
    try {
      await addTodoApi(newTodo);
      setNewTodo("");
      const result = await getTodosApi(search, page, sortOrder);
      setTodos(result.todos);
      setTotalTodos(result.totalTodos || 0);
      setMessage(result.message || null);
    } catch (err) {
      console.error("Failed to add todo:", err);
    }
  };

  // Delete todo
  const handleDelete = async (index) => {
    const todoId = todos[index]._id || todos[index].id;
    try {
      await deleteTodoApi(todoId);
      const result = await getTodosApi(search, page, sortOrder);
      setTodos(result.todos);
      setTotalTodos(result.totalTodos || 0);
      setMessage(result.message || null);
    } catch (err) {
      console.error("Failed to delete todo:", err);
    }
  };

  // Enable edit mode
  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditingText(todos[index].task || "");
  };

  // Save edited todo
  const handleSave = async (index) => {
    if (!editingText.trim()) return;
    const todoId = todos[index]._id || todos[index].id;
    try {
      await updateTodoApi(todoId, editingText);
      setEditingIndex(null);
      setEditingText("");
      const result = await getTodosApi(search, page, sortOrder);
      setTodos(result.todos);
      setTotalTodos(result.totalTodos || 0);
      setMessage(result.message || null);
    } catch (err) {
      console.error("Failed to update todo:", err);
    }
  };

  // Toggle todo status (completed / pending)
  const handleToggleStatus = async (index) => {
    const todoId = todos[index]._id || todos[index].id;
    const newStatus = todos[index].status === "completed" ? "pending" : "completed";
    const prev = [...todos];
    const updatedTodos = [...todos];
    updatedTodos[index] = { ...updatedTodos[index], status: newStatus };
    setTodos(updatedTodos);

    try {
      await updateTodoStatusApi(todoId, newStatus);
    } catch (err) {
      console.error("Failed to update status (rolling back):", err);
      setTodos(prev);
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <Navbar 
        search={search} 
        setSearch={setSearch} 
        handleLogout={handleLogout}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />

      <Container maxWidth="sm" sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 6 }}>
        <Typography variant="h5" sx={{ mb: 1, fontWeight: "bold", color: "#000" }}>
          My Todos
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, fontWeight: 500 }}>
          Total Todos: {totalTodos}
        </Typography>

        {/* Add New Todo Section */}
        <Box sx={{ display: "flex", gap: 2, width: "100%", mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Enter a new task..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
          />
          <Button
            variant="contained"
            sx={{ backgroundColor: "#0B3C95", borderRadius: "12px", padding: "14px 24px", fontWeight: 500, fontSize: "16px", textTransform: "none", "&:hover": { backgroundColor: "#0B3C95", opacity: 1 } }}
            onClick={handleAdd}
          >
            Add
          </Button>
        </Box>

        {/* Todo List */}
        {todos.length > 0 ? (
          <List sx={{ width: "100%" }}>
            {todos.map((todo, index) => (
              <ListItem key={todo._id || index} sx={{ backgroundColor: "#F9F9F9", borderRadius: "12px", mb: 2, boxShadow: "0px 2px 5px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", gap: 2, py: 2 }}>
                {editingIndex === index ? (
                  <Box sx={{ display: "flex", gap: 1, width: "100%" }}>
                    <TextField value={editingText} onChange={(e) => setEditingText(e.target.value)} fullWidth sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", backgroundColor: "#fff" } }} />
                    <Button onClick={() => handleSave(index)} variant="contained" sx={{ backgroundColor: "#0B3C95", borderRadius: "8px", textTransform: "none", "&:hover": { backgroundColor: "#0B3C95" } }}>Save</Button>
                  </Box>
                ) : (
                  <>
                    <ListItemText primary={todo.task} />
                    <Button variant="contained" size="small" sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 500, backgroundColor: todo.status === "completed" ? "green" : "gray", color: "#fff", "&:hover": { backgroundColor: todo.status === "completed" ? "darkgreen" : "black" } }} onClick={() => handleToggleStatus(index)}>
                      {todo.status === "completed" ? "Completed" : "Mark Completed"}
                    </Button>
                    <IconButton onClick={() => handleEdit(index)}><Edit /></IconButton>
                    <IconButton onClick={() => handleDelete(index)}><Delete color="error" /></IconButton>
                  </>
                )}
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body1" color="error" sx={{ textAlign: "center", mt: 3 }}>
            {message || "No todos found"}
          </Typography>
        )}

        {/* Pagination */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2, width: "100%" }}>
          <Button variant="outlined" disabled={page === 1} onClick={() => setPage((prev) => Math.max(prev - 1, 1))}>Back</Button>
          <Button variant="outlined" disabled={todos.length < 5} onClick={() => setPage((prev) => prev + 1)}>Next</Button>
        </Box>
      </Container>
    </>
  );
}
