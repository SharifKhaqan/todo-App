
import { api } from "../lib/api";

// Get all todos of logged-in user
export async function getTodos() {
  const { data } = await api.get("/todo");
  return data.data || []; 
}



// Create a new todo
export async function addTodo(task) {
  const { data } = await api.post("/todo", { task });
  return data.taskCreated; 
}

// Update a todo
export async function updateTodo(id, taskText) {
  const { data } = await api.patch(`/todo/${id}`, { task: taskText });
  return data.updatedTask || data.message || "Task updated successfully";
}



// Delete a todo
export async function deleteTodo(id) {
  const { data } = await api.delete(`/todo/${id}`);
  return data.message || "Task deleted successfully";
}
