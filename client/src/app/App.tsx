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

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Landing />} /> {/* Done */}
            <Route path="/about" element={<AboutPage />} /> {/* Done */}
            <Route path="/contact" element={<ContactPage />} /> {/* Done */}
            <Route path="/privacy" element={<Privacy />} /> {/* Done */}
            <Route path="/terms" element={<Terms />} /> {/* Done */}
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/categories" element={<CategoriesPage />} /> {/* Done */}
            <Route path="/professions" element={<ProfessionsPage />} /> {/* Done */}
            <Route path="/profession/:id" element={<ProfessionDetailsPage />} /> {/* Done */}
            <Route path="/profiles" element={<ProfilesPage />} /> {/* Done */}
            <Route path="/profile/:id" element={<ProfilePage />} /> {/* Done */}
            <Route path="*" element={<NotFoundPage />} /> {/* Done */}
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}
