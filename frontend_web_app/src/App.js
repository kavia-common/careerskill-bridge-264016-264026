import React, { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './state/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Sidebar from './components/common/Sidebar';
import TopBar from './components/common/TopBar';

import Login from './components/auth/Login';
import Register from './components/auth/Register';

import DashboardHome from './components/dashboard/DashboardHome';
import ModulesList from './components/learning/ModulesList';
import ModuleDetail from './components/learning/ModuleDetail';
import LessonViewer from './components/learning/LessonViewer';
import QuizRunner from './components/learning/QuizRunner';

import PortfolioEditor from './components/portfolio/PortfolioEditor';
import PortfolioViewer from './components/portfolio/PortfolioViewer';
import Certificates from './components/portfolio/Certificates';

import MentorList from './components/mentorship/MentorList';
import MentorDetail from './components/mentorship/MentorDetail';
import Booking from './components/mentorship/Booking';

import ResumeBuilder from './components/jobtools/ResumeBuilder';
import InterviewSimulator from './components/jobtools/InterviewSimulator';
import SoftSkills from './components/jobtools/SoftSkills';

import Settings from './components/settings/Settings';

// PUBLIC_INTERFACE
export default function App() {
  /**
   * Root app with router, auth provider, i18n initialization and layout.
   */
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const Layout = useMemo(() => {
    return function LayoutWrapper({ children }) {
      return (
        <div className="sb-app">
          <Sidebar />
          <div className="sb-content">
            <TopBar theme={theme} onToggleTheme={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))} />
            <main className="sb-main">{children}</main>
          </div>
        </div>
      );
    };
  }, [theme]);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="/dashboard"
              element={
                <Layout>
                  <DashboardHome />
                </Layout>
              }
            />
            <Route
              path="/modules"
              element={
                <Layout>
                  <ModulesList />
                </Layout>
              }
            />
            <Route
              path="/modules/:id"
              element={
                <Layout>
                  <ModuleDetail />
                </Layout>
              }
            />
            <Route
              path="/modules/:id/lesson/:lessonId"
              element={
                <Layout>
                  <LessonViewer />
                </Layout>
              }
            />
            <Route
              path="/modules/:id/quiz/:quizId"
              element={
                <Layout>
                  <QuizRunner />
                </Layout>
              }
            />

            <Route
              path="/portfolio"
              element={
                <Layout>
                  <PortfolioViewer />
                </Layout>
              }
            />
            <Route
              path="/portfolio/edit"
              element={
                <Layout>
                  <PortfolioEditor />
                </Layout>
              }
            />
            <Route
              path="/certificates"
              element={
                <Layout>
                  <Certificates />
                </Layout>
              }
            />

            <Route
              path="/mentorship"
              element={
                <Layout>
                  <MentorList />
                </Layout>
              }
            />
            <Route
              path="/mentorship/:mentorId"
              element={
                <Layout>
                  <MentorDetail />
                </Layout>
              }
            />
            <Route
              path="/mentorship/:mentorId/booking"
              element={
                <Layout>
                  <Booking />
                </Layout>
              }
            />

            <Route
              path="/job-tools"
              element={
                <Layout>
                  <div className="grid-3">
                    <ResumeBuilder />
                    <InterviewSimulator />
                    <SoftSkills />
                  </div>
                </Layout>
              }
            />

            <Route
              path="/settings"
              element={
                <Layout>
                  <Settings />
                </Layout>
              }
            />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
