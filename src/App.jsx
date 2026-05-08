import React from "react";
import { Route } from "react-router-dom";
import { BrowserRouter, Routes } from "react-router-dom";
import Home from "./pages/Home";
import LandingPage from "./pages/LandingPage";
import Library from "./pages/Library";
import About from './pages/About';
import Contact from './pages/Contact';
import Start from "./pages/Start";
import Onboarding from "./components/Onboarding";
import Dashboard from './pages/Dashboard';
import NotFound from "./pages/NotFound";
import Focus from './pages/Focus';
import Confess from './pages/Confess';
import Setting from './pages/Setting';

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
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/focus" element={<Focus />} />
        <Route path="/confess" element={<Confess />} />
        <Route path="/settings" element={<Setting />} />
        <Route path="*" element={<NotFound />}/>
      </Routes>
    </BrowserRouter>
  );
}