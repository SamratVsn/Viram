import React, { Suspense, lazy } from "react";
import { Route, Navigate } from "react-router-dom";
import { BrowserRouter, Routes } from "react-router-dom";
import AuthGuard from "./components/AuthGuard";
import LandingPage from "./pages/LandingPage";
import Start from "./pages/Start";
import AuthCallback from "./pages/AuthCallback";

const Home = lazy(() => import("./pages/Home"));
const Library = lazy(() => import("./pages/Library"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Onboarding = lazy(() => import("./components/Onboarding"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Focus = lazy(() => import("./pages/Focus"));
const Confess = lazy(() => import("./pages/Confess"));
const Setting = lazy(() => import("./pages/Setting"));
const Triggers = lazy(() => import("./pages/Triggers"));
const Profile = lazy(() => import("./pages/Profile"));
const GoalSetting = lazy(() => import("./components/GoalSetting"));

function Spinner() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#F4EEE3', fontFamily: "'Cormorant Garamond', Georgia, serif",
      fontSize: 18, color: '#8A7B6E',
    }}>
      Loading…
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Spinner />}>
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
            path="/triggers"
            element={
              <AuthGuard>
                <Triggers />
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

          {/* Redirect old /problems to /triggers */}
          <Route path="/problems" element={<Navigate to="/triggers" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
