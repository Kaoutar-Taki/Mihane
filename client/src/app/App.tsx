import { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "../auth/AuthContext";
import { RequireAuth } from "../auth/Guards";
import AccountProfile from "../pages/AccountProfile";
import Landing from "./../pages/Landing";
import Loader from "../components/Loader";
import AboutPage from "../pages/AboutPage";
import Privacy from "../pages/Privacy";
import Terms from "../pages/Terms";
import NotFoundPage from "../pages/NotFoundPage";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import CategoriesPage from "../pages/CategoriesPage";
import ProfessionsPage from "../pages/ProfessionsPage";
import ProfessionDetailsPage from "../pages/ProfessionDetailsPage";
import ContactPage from "../pages/ContactPage";
import ProfilesPage from "../pages/ProfilesPage";
import ProfilePage from "../pages/ProfilePage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import DashboardRouter from "../pages/dashboard/DashboardRouter";
import SuperAdminDashboard from "../pages/dashboard/SuperAdminDashboard";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import ArtisanDashboard from "../pages/dashboard/ArtisanDashboard";
import ClientDashboard from "../pages/dashboard/ClientDashboard";
import RegionsPage from "../pages/dashboard/RegionsPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot" element={<ForgotPasswordPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/professions" element={<ProfessionsPage />} />
            <Route path="/profession/:id" element={<ProfessionDetailsPage />} />
            <Route path="/profiles" element={<ProfilesPage />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
            <Route
              path="/account/profile"
              element={
                <RequireAuth>
                  <AccountProfile />
                </RequireAuth>
              }
            />
            <Route path="/dashboard" element={<RequireAuth><DashboardRouter /></RequireAuth>} />
            <Route path="/dashboard/super" element={<RequireAuth><SuperAdminDashboard /></RequireAuth>} />
            <Route path="/dashboard/super/regions" element={<RequireAuth><RegionsPage /></RequireAuth>} />
            <Route path="/dashboard/admin" element={<RequireAuth><AdminDashboard /></RequireAuth>} />
            <Route path="/dashboard/artisan" element={<RequireAuth><ArtisanDashboard /></RequireAuth>} />
            <Route path="/dashboard/client" element={<RequireAuth><ClientDashboard /></RequireAuth>} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}
