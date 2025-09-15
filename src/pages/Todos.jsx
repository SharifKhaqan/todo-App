import { useState } from "react";
import {Box,Button,Container,IconButton,List,ListItem,ListItemText,TextField,Typography,} from "@mui/material";
import { Edit, Delete, Logout } from "@mui/icons-material";
import {
  addTodo as addTodoApi,
  updateTodo as updateTodoApi,
  deleteTodo as deleteTodoApi,
} from "../services/todos";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function TodoPage() {
  const [newTodo, setNewTodo] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState("");
  const { user, todos, setTodos, logout, loading } = useAuth();
  const navigate = useNavigate();

  //Add new todo
  const handleAdd = async () => {
    if (!newTodo.trim()) return;
    try {
      const created = await addTodoApi(newTodo);
      console.log("Todo created on backend:", created);
      setTodos((prev) => [...prev, created]); 
      setNewTodo(""); 
    } catch (err) {
      console.error("Failed to add todo:", err);
    }
  };

  //Delete todo
  const handleDelete = async (index) => {
    const todo = todos[index];
    const todoId = todo._id || todo.id;
    try {
      await deleteTodoApi(todoId);
      console.log("🗑️ Deleted todo with id:", todoId);
      setTodos((prev) => prev.filter((_, i) => i !== index));
    } catch (err) {
      console.error("Failed to delete todo:", err);
    }
  };

  // Editing
  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditingText(todos[index].task || "");
  };

  //Save edited todo
  const handleSave = async (index) => {
    if (!editingText.trim()) return;
    const todo = todos[index];
    const todoId = todo._id || todo.id;

    const prev = [...todos];
    const updatedTodos = [...todos];
    updatedTodos[index] = { ...updatedTodos[index], task: editingText };
    setTodos(updatedTodos);
    setEditingIndex(null);
    setEditingText("");

    try {
      await updateTodoApi(todoId, editingText);
      console.log("Updated todo:", todoId,editingText);
    } catch (err) {
      console.error("Failed to update todo (rolling back):", err);
      setTodos(prev);
    }
  };

  // Logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <Container maxWidth="sm" sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 6 }}>
      {/* Header */}
      <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#000000" }}>
          Todo-App
        </Typography>
        <Button
          variant="contained"
          onClick={handleLogout}
          startIcon={<Logout />}
          sx={{
            backgroundColor: "#D32F2F",
            "&:hover": { backgroundColor: "#B71C1C" },
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 500,
          }}
        >
          Logout
        </Button>
      </Box>

      {/* Section Title */}
      <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold", color: "#000000" }}>
        My Todos
      </Typography>

      {/* Add Todo Input */}
      <Box sx={{ display: "flex", gap: 2, width: "100%", mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Enter a new task..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
        />
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#0B3C95",
            borderRadius: "12px",
            padding: "14px 24px",
            fontWeight: "500",
            fontSize: "16px",
            textTransform: "none",
            "&:hover": { backgroundColor: "#0B3C95", opacity: 1 },
          }}
          onClick={handleAdd}
        >
          Add
        </Button>
      </Box>

      {/* Todo List */}
      <List sx={{ width: "100%" }}>
        {todos.map((todo, index) => (
          <ListItem
            key={todo._id || index}
            sx={{
              backgroundColor: "#F9F9F9",
              borderRadius: "12px",
              mb: 2,
              boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            {editingIndex === index ? (
              <Box sx={{ display: "flex", gap: 1, width: "100%" }}>
                <TextField
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      backgroundColor: "#fff",
                    },
                  }}
                />
                <Button
                  onClick={() => handleSave(index)}
                  variant="contained"
                  sx={{
                    backgroundColor: "#0B3C95",
                    borderRadius: "8px",
                    textTransform: "none",
                    "&:hover": { backgroundColor: "#0B3C95" },
                  }}
                >
                  Save
                </Button>
              </Box>
            ) : (
              <>
                <ListItemText primary={todo.task} />
                <IconButton onClick={() => handleEdit(index)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDelete(index)}>
                  <Delete color="error" />
                </IconButton>
              </>
            )}
          </ListItem>
        ))}
      </List>
    </Container>
  );
}
