import React, { useEffect, useState } from "react";
import Header from "./components/home/Header";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import About from "./pages/About";
import Membership from "./pages/Membership";
import Events from "./pages/Events";
import Publications from "./pages/Publications";
import Resources from "./pages/Resources";
import Contact from "./pages/Contact";
import Topside from "./components/home/Topside";
import Footer from "./components/home/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./components/log_register/ForgotPassword";
import ResetPassword from "./components/log_register/ResetPassword";
import VerifyEmail from "./components/log_register/VerifyEmail";
import SendOtp from "./components/log_register/SendOtp";
import AuthProvider from "./providers/AuthProvider";
import EditProfile from "./components/home/EditProfile";
import Profile from "./components/home/Profile";
import { Toaster } from "react-hot-toast";
import SubmitPaper from './pages/SubmitPaper';
import Admin from './pages/Admin';
import VanillaLiquidGlass from './components/ui/VanillaLiquidGlass';
import useLiquidGlassStore from './store/useLiquidGlassStore';
import './styles/toast.css';
import AllPublications from './pages/AllPublications';
import BlogDetail from './pages/BlogDetail';
import EventDetail from './pages/EventDetail';
import Gallery from './pages/Gallery';
// import GujaratMap from "./components/resources/GujaratMap";

function App() {
  const { isLiquidGlassActive, liquidGlassWidth, liquidGlassHeight } = useLiquidGlassStore();

  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <div className={`flex flex-col min-h-screen transition-colors duration-300 ${isLiquidGlassActive ? 'dark' : ''}`}>
          <Header />
          <main className="flex-grow bg-gray-50 dark:bg-slate-900">
            
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<About />} />
              <Route path="/membership" element={<Membership />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<EventDetail />} />
              <Route path="/publications" element={<Publications />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/blogs/:id" element={<BlogDetail />} />
              {/* <Route path="/gujarat-map" element={<GujaratMap />} /> */}
              <Route path="/contact" element={<Contact />} />
              <Route path="/top-side" element={<Topside />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/send-verify-otp" element={<SendOtp />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/profile/edit" element={<EditProfile />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/submit-paper" element={<SubmitPaper />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/all-publications" element={<AllPublications />} />
            </Routes>
          </main>
          

          <Footer />
        </div>

        {/* Global Liquid Glass Effect */}
        <VanillaLiquidGlass 
          isActive={isLiquidGlassActive}  
          width={liquidGlassWidth}
          height={liquidGlassHeight}
        />

        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#333',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              padding: '16px 20px',
              fontSize: '14px',
              fontWeight: '500',
              minWidth: '300px',
              maxWidth: '400px',
            },
            success: {
              style: {
                background: '#f0fdf4',
                color: '#166534',
                border: '1px solid #bbf7d0',
                borderLeft: '4px solid #22c55e',
              },
              iconTheme: {
                primary: '#22c55e',
                secondary: '#f0fdf4',
              },
            },
            error: {
              style: {
                background: '#fef2f2',
                color: '#dc2626',
                border: '1px solid #fecaca',
                borderLeft: '4px solid #ef4444',
              },
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fef2f2',
              },
            },
            loading: {
              style: {
                background: '#f8fafc',
                color: '#475569',
                border: '1px solid #e2e8f0',
                borderLeft: '4px solid #3b82f6',
              },
              iconTheme: {
                primary: '#3b82f6',
                secondary: '#f8fafc',
              },
            },
          }}
        />
      </AuthProvider>
    </Router>
  );
}

export default App;
