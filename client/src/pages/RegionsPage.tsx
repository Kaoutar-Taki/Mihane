import { useTranslation } from "react-i18next";
import MainLayout from "./layouts/MainLayout";
import regions from "../data/moroccan-regions.json";
import { Link } from "react-router-dom";

export default function RegionsPage() {
  const { i18n } = useTranslation();

  return (
    <MainLayout>
      <section className="py-16 text-center">
        <div className="grid grid-cols-1 gap-5 pt-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
          {regions.map((region) => (
            <Link
              key={region.id}
              to={`/region/${region.id}`}
              className="group relative flex flex-col items-center rounded-xl bg-white p-4 shadow transition duration-300 hover:shadow-lg"
            >
              <p className="group-hover:text-primary mt-3 text-center text-sm font-semibold text-gray-800 transition">
                {region[i18n.language as "ar" | "fr"]}
              </p>
              <div className="ring-primary/10 absolute inset-0 z-0 rounded-xl opacity-0 ring-2 transition-all duration-300 group-hover:opacity-100"></div>
              <Link
                to={`/region/${region.id}/profiles`}
                className="mt-2 rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
                onClick={(e) => e.stopPropagation()}
              >
                عرض البروفايلات
              </Link>
            </Link>
          ))}
        </div>
      </section>
    </MainLayout>
  );
}
