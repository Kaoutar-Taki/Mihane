import { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "../auth/AuthContext";
import { RequireAuth } from "../auth/Guards";
import Loader from "../components/Loader";
import AboutPage from "../pages/AboutPage";
import AccountProfile from "../pages/AccountProfile";
import CategoriesPage from "../pages/CategoriesPage";
import ContactPage from "../pages/ContactPage";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import ArtisanDashboard from "../pages/dashboard/ArtisanDashboard";
import CitiesPage from "../pages/dashboard/CitiesPage";
import ClientDashboard from "../pages/dashboard/ClientDashboard";
import DashboardRouter from "../pages/dashboard/DashboardRouter";
import GendersPage from "../pages/dashboard/GendersPage";
import DashboardProfessionsPage from "../pages/dashboard/ProfessionsPage";
import RegionsPage from "../pages/dashboard/RegionsPage";
import SuperAdminDashboard from "../pages/dashboard/SuperAdminDashboard";
import TestimonialsPage from "../pages/dashboard/TestimonialsPage";
import UsersPage from "../pages/dashboard/UsersPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import LoginPage from "../pages/LoginPage";
import NotFoundPage from "../pages/NotFoundPage";
import Privacy from "../pages/Privacy";
import ProfessionDetailsPage from "../pages/ProfessionDetailsPage";
import ProfessionsPage from "../pages/ProfessionsPage";
import ProfilePage from "../pages/ProfilePage";
import ProfilesPage from "../pages/ProfilesPage";
import RegisterPage from "../pages/RegisterPage";
import Terms from "../pages/Terms";
import Landing from "./../pages/Landing";

import ArtisansDashboardPage from "@/pages/dashboard/ArtisansDashboardPage";
import CategoriesDashboardPage from "@/pages/dashboard/CategoriesDashboardPage";
import FaqsDashboardPage from "@/pages/dashboard/FaqsDashboardPage";

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
            <Route path="/dashboard/super/cities" element={<RequireAuth><CitiesPage /></RequireAuth>} />
            <Route path="/dashboard/super/testimonials" element={<RequireAuth><TestimonialsPage /></RequireAuth>} />
            <Route path="/dashboard/super/genders" element={<RequireAuth><GendersPage /></RequireAuth>} />
            <Route path="/dashboard/super/professions" element={<RequireAuth><DashboardProfessionsPage /></RequireAuth>} />
            <Route path="/dashboard/super/categories" element={<RequireAuth><CategoriesDashboardPage /></RequireAuth>} />
            <Route path="/dashboard/super/faqs" element={<RequireAuth><FaqsDashboardPage /></RequireAuth>} />
            <Route path="/dashboard/super/artisans" element={<RequireAuth><ArtisansDashboardPage /></RequireAuth>} />
            <Route path="/dashboard/super/users" element={<RequireAuth><UsersPage /></RequireAuth>} />
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
