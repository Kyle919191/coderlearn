import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";

export default function App() { 
  return (
    <BrowserRouter> {/* enable react router through browser */}
      <div className="min-h-screen bg-gray-50"> {/* page background */}
      <Navbar /> {/* component that persists across routes */}
      <Routes>
        <Route path="/" element={<HomePage />} /> {/* render different pages based on the route */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
      </div>
    </BrowserRouter>
  );
}