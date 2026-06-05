import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ChatPage from "./pages/ChatPage";
import JournalPage from "./pages/JournalPage";
import BreathingPage from "./pages/BreathingPage";
import About from "./pages/About";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/journal"
          element={
            <ProtectedRoute>
              <JournalPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/breathing"
          element={
            <ProtectedRoute>
              <BreathingPage />
            </ProtectedRoute>
          }
        />

        <Route
  path="/admin"
  element={
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;