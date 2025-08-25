import { useState } from "react";
import {Box,Button,Container,IconButton,List,ListItem,ListItemText,TextField,Typography,} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

export default function TodoPage() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState("");

  // Add todo
  const handleAdd = () => {
    if (!newTodo.trim()) return;
    setTodos([...todos, newTodo]);
    setNewTodo("");
  };

  // Delete todo
  const handleDelete = (index) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  // Start editing
  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditingText(todos[index]);
  };

  // Save editing
  const handleSave = (index) => {
    if (!editingText.trim()) return;
    const updatedTodos = [...todos];
    updatedTodos[index] = editingText;
    setTodos(updatedTodos);
    setEditingIndex(null);
    setEditingText("");
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 6,
      }}
    >
      <Typography
        variant="h4"
        sx={{ mb: 5, mt: 1, fontWeight: "bold", color: "#000000" }}
      >
        Todo-App
      </Typography>

      <Typography
        variant="h5"
        sx={{ mb: 3, fontWeight: "bold", color: "#000000" }}
      >
        My Todos
      </Typography>

      {/* Add new todo */}
      <Box sx={{ display: "flex", gap: 2, width: "100%", mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Enter a new task..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
            },
          }}
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

      {/* Todo list */}
      <List sx={{ width: "100%" }}>
        {todos.map((todo, index) => (
          <ListItem
            key={index}
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
                <ListItemText primary={todo} />
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
