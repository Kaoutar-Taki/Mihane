import { useTranslation } from "react-i18next";
import MainLayout from "./layouts/MainLayout";
import cities from "../data/moroccan-cities.json";
import { Link, useNavigate } from "react-router-dom";

export default function CitiesPage() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  return (
    <MainLayout>
      <section className="py-16 text-center">
        <div className="grid grid-cols-1 gap-5 pt-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
          {cities.map((citie) => (
            <div
              key={citie.id}
              role="button"
              onClick={() => navigate(`/city/${citie.id}`)}
              className="group relative flex cursor-pointer flex-col items-center rounded-xl bg-white p-4 shadow transition duration-300 hover:shadow-lg"
            >
              <p className="group-hover:text-primary mt-3 text-center text-sm font-semibold text-gray-800 transition">
                {citie[i18n.language as "ar" | "fr"]}
              </p>

              <Link
                to={`/city/${citie.id}/profiles`}
                onClick={(e) => e.stopPropagation()}
                className="bg-primary mt-2 rounded-lg px-3 py-1.5 text-sm text-white hover:opacity-90"
              >
                عرض البروفايلات
              </Link>

              <div className="ring-primary/10 pointer-events-none absolute inset-0 z-0 rounded-xl opacity-0 ring-2 transition-all duration-300 group-hover:opacity-100"></div>
            </div>
          ))}
        </div>
      </section>
    </MainLayout>
  );
}
