import React from "react";
import { Route } from "react-router-dom";
import { BrowserRouter, Routes } from "react-router-dom";
import AuthGuard from "./components/AuthGuard";
import Home from "./pages/Home";
import LandingPage from "./pages/LandingPage";
import Library from "./pages/Library";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Start from "./pages/Start";
import AuthCallback from "./pages/AuthCallback";
import Onboarding from "./components/Onboarding";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Focus from "./pages/Focus";
import Confess from "./pages/Confess";
import Setting from "./pages/Setting";
import Problems from "./pages/Problems";
import Profile from "./pages/Profile";
import GoalSetting from "./components/GoalSetting";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/start" element={<Start />} />
        <Route path="/callback" element={<AuthCallback />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/library" element={<Library />} />

        {/* Protected */}
        <Route
          path="/onboarding"
          element={
            <AuthGuard>
              <Onboarding />
            </AuthGuard>
          }
        />
        <Route
          path="/home"
          element={
            <AuthGuard>
              <Home />
            </AuthGuard>
          }
        />
        <Route
          path="/goal-setting"
          element={
            <AuthGuard>
              <GoalSetting />
            </AuthGuard>
          }
        />
        <Route
          path="/dashboard"
          element={
            <AuthGuard>
              <Dashboard />
            </AuthGuard>
          }
        />
        <Route
          path="/focus"
          element={
            <AuthGuard>
              <Focus />
            </AuthGuard>
          }
        />
        <Route
          path="/confess"
          element={
            <AuthGuard>
              <Confess />
            </AuthGuard>
          }
        />
        <Route
          path="/settings"
          element={
            <AuthGuard>
              <Setting />
            </AuthGuard>
          }
        />
        <Route
          path="/problems"
          element={
            <AuthGuard>
              <Problems />
            </AuthGuard>
          }
        />
        <Route
          path="/profile"
          element={
            <AuthGuard>
              <Profile />
            </AuthGuard>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
