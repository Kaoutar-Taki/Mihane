import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import { AuthProvider } from "../auth/AuthContext";
import Loader from "../components/Loader";
import Landing from "./../pages/Landing";
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
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}
