import { api } from "../lib/api";

// Get all todos of logged-in user
export async function getTodos(search = "", page = 1, sort = "latest") {
  let endpoint = `/todo?page=${page}&sort=${sort}`;
  if (search) endpoint += `&search=${search}`;
  console.log("Fetching todos from:", endpoint); 

  const { data } = await api.get(endpoint);

  // Return backend response
  return {
    todos: data.data || [],
    message: data.message || null,
  };
}

// Create a new todo
export async function addTodo(task) {
  const { data } = await api.post("/todo", { task });
  return data.taskCreated;
}

// Update a todo
export async function updateTodo(id, taskText) {
  const { data } = await api.patch(`/todo/${id}`, { task: taskText });
  console.log("data", data);
  return data.updatedTask || data.message || "Task updated successfully";
}

// Update status of a todo
export async function updateTodoStatus(id, status) {
  console.log(`Updating status of todo ${id} to: ${status}`);
  const { data } = await api.patch(`/todo/${id}`, { status });
  return data.updatedTask || data.message || "Status updated successfully";
}

// Delete a todo
export async function deleteTodo(id) {
  const { data } = await api.delete(`/todo/${id}`);
  return data.message || "Task deleted successfully";
}

// Get all users (admin only)
export async function getAllUsers() {
  console.log("Fetching all users (admin)...");
  const { data } = await api.get("/admin/user");
  return data.users || []; 
}

export async function getAllTodos(page = 1) {
  console.log("Fetching all todos (admin)... page:", page);
  const { data } = await api.get(`/admin/todo?page=${page}`);
  return {
    totalTodos: data.totalTodos || 0,
    todos: data.data || [],
  };
}

// Get daily completed todos stats (admin)
export async function getCompletedDailyStats() {
  console.log("Fetching completed todos daily stats (admin)...");
  const { data } = await api.get("/admin/completed/daily-stats"); 
  return data.data || []; 
}