import React from "react";
import { Route } from "react-router-dom";
import { BrowserRouter, Routes } from "react-router-dom";
import Home from "./pages/Home";
import LandingPage from "./pages/LandingPage";
import Library from "./pages/Library";
import About from './pages/About';
import Contact from './pages/Contact';
import Start from "./pages/Start";
import Questions from "./components/Questions";
import Dashboard from './pages/Dashboard'

export default function App() {
  return (  
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/library" element={<Library />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/start" element={<Start />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}