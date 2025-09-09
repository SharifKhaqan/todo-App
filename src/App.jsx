import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import RequireAuth from "./routes/RequireAuth"; 
import Login from "./pages/Login";
import Signup from "./pages/Register"; 
import TodoPage from "./pages/Todos"; 
import AdminPage from "./pages/AdminPage"; 

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes */}
        <Route element={<RequireAuth />}>
          <Route path="/" element={<TodoPage />} />
          <Route path="/admin" element={<AdminPage />} /> 
        </Route>

        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
