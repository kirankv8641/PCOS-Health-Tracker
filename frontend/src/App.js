import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Symptoms from "./pages/Symptoms";
import Diet from "./pages/Diet";
import Exercise from "./pages/Exercise";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import AuthFlow from './pages/AuthFlow';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';

// routes

function App() {
  return (
    <Router>

      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/symptoms" element={<Symptoms />} />
        <Route path="/diet" element={<Diet />} />
        <Route path="/exercise" element={<Exercise />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
       <Route path="/auth" element={<AuthFlow />} />
       <Route path="/register" element={<AuthFlow />} />
       <Route path="/login" element={<AuthFlow />} />
       <Route path="/profile" element={<Profile />} />
       <Route path="/edit-profile" element={<EditProfile />} />
      </Routes>

    </Router>
  );
}

export default App;