import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import { AuthProvider } from "../auth/AuthContext";
import { RequireRole } from "../auth/Guards";
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
import RegionsPage from "../pages/RegionsPage";
import RegionDetailsPage from "../pages/RegionDetailsPage";
import RegionProfilesPage from "../pages/RegionProfilesPage";
import CitiesPage from "../pages/CitiesPage";
import CityDetailsPage from "../pages/CityDetailsPage";
import CityProfilesPage from "../pages/CityProfilesPage";
import ChatPage from "../pages/ChatPage";
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
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/professions" element={<ProfessionsPage />} />
            <Route path="/profession/:id" element={<ProfessionDetailsPage />} />
            <Route path="/profiles" element={<ProfilesPage />} /> {/* Done */}
            <Route path="/profile/:id" element={<ProfilePage />} /> {/* Done */}
            <Route path="/regions" element={<RegionsPage />} />
            <Route path="/region/:id" element={<RegionDetailsPage />} />
            <Route
              path="/region/:id/profiles"
              element={<RegionProfilesPage />}
            />
            <Route path="/cities" element={<CitiesPage />} />
            <Route path="/city/:id" element={<CityDetailsPage />} />
            <Route path="/city/:id/profiles" element={<CityProfilesPage />} />
            <Route
              path="/chat/:proId"
              element={
                <RequireRole role="CLIENT">
                  <ChatPage />
                </RequireRole>
              }
            />
            <Route path="*" element={<NotFoundPage />} /> {/* Done */}
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}
