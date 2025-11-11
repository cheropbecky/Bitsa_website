import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Homepage from './pages/Homepage';
import Blogs from './pages/Blogs';
import Events from './pages/Events';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import SeeDatabaseButton from './pages/SeeDatabaseButton';
import AdminLogin from './pages/AdminLogin';

function App() {
  const [currentPage,setCurrentPage] = useState("Home");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleNavigate = (page) => {
    console.log("Navigating to:", page);
    setCurrentPage(page);
  };

  const handleLogout = () => {
    setIsAuthenticated(false)
  };
  return (
    <Router>
      <Navbar
      currentPage={currentPage}
      onNavigate={handleNavigate}
      isAuthenticated={isAuthenticated}
      onLogout={handleLogout}
      userEmail= "user@example.com"
      />

      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/events" element={<Events />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/register" element={<Register />} />
        <Route path="/userdashboard" element={<UserDashboard />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/seedatabasebutton" element={<SeeDatabaseButton />} />
        <Route path="/adminLogin" element={<AdminLogin />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
