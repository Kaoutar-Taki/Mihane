import professions from "../../data/professions.json";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

export default function ProfessionsSection() {
  const { t, i18n } = useTranslation();

  return (
    <section className="relative overflow-hidden bg-white py-20">
      <div className="absolute inset-0">
        <div className="from-primary/3 to-secondary/3 absolute top-0 left-0 h-full w-full bg-gradient-to-br via-transparent"></div>
        <div className="bg-primary/5 absolute top-20 left-1/4 h-32 w-32 animate-pulse rounded-full blur-2xl"></div>
        <div className="bg-secondary/5 absolute right-1/4 bottom-20 h-40 w-40 animate-pulse rounded-full blur-2xl delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="mb-16 text-center">
          <div className="from-primary/10 to-secondary/10 text-primary mb-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r px-6 py-3 text-sm font-medium shadow-lg">
            <Sparkles size={16} className="animate-spin" />
            {t("landing.professions.badge")}
          </div>
          <h2 className="mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-4xl leading-tight font-black text-gray-900 text-transparent md:text-6xl">
            {t("landing.professions.title")}
          </h2>
          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-600">
            {t("landing.professions.subtitle")}
          </p>
        </div>

        <div className="mx-auto max-w-7xl">
          <div className="mb-16 grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
            {professions.slice(0, 6).map((profession, index) => (
              <Link
                key={profession.id}
                to={`/profession/${profession.id}`}
                className="group relative"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="hover:border-primary/20 relative transform rounded-3xl border-2 border-transparent bg-gradient-to-br from-white to-gray-50 p-6 shadow-lg transition-all duration-500 hover:-translate-y-4 hover:rotate-2 hover:shadow-2xl">
                  <div className="from-primary/10 to-secondary/10 absolute inset-0 rounded-3xl bg-gradient-to-br opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100"></div>

                  <div className="relative mb-6">
                    <div className="relative mx-auto h-20 w-20">
                      <div className="from-primary to-secondary absolute inset-0 rounded-2xl bg-gradient-to-br opacity-20 transition-opacity duration-300 group-hover:opacity-40"></div>
                      <img
                        src={profession.image}
                        alt={profession.title[i18n.language as "ar" | "fr"]}
                        className="relative h-full w-full rounded-2xl object-cover shadow-lg transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute -top-2 -right-2 flex h-6 w-6 animate-bounce items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 opacity-0 transition-all duration-300 group-hover:opacity-100">
                        <Sparkles size={12} className="text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="relative text-center">
                    <h3 className="group-hover:text-primary text-sm leading-tight font-bold text-gray-900 transition-colors duration-300">
                      {profession.title[i18n.language as "ar" | "fr"]}
                    </h3>

                    <div className="from-primary to-secondary absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 transform bg-gradient-to-r transition-all duration-500 group-hover:w-full"></div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/professions"
              className="group from-primary to-secondary hover:shadow-primary/30 relative inline-flex transform items-center gap-3 rounded-2xl bg-gradient-to-r via-orange-500 px-12 py-6 text-xl font-bold text-white shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-105 hover:from-orange-600 hover:to-yellow-500"
            >
              <div className="from-primary to-secondary absolute inset-0 rounded-2xl bg-gradient-to-r opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-20"></div>
              <span className="relative">
                {t("landing.professions.viewAll")}
              </span>
              <ArrowRight
                size={24}
                className="relative transition-transform duration-300 group-hover:translate-x-2"
              />

              <div className="absolute -top-1 -right-1 h-3 w-3 animate-ping rounded-full bg-yellow-400 opacity-0 group-hover:opacity-100"></div>
              <div className="absolute -bottom-1 -left-1 h-2 w-2 animate-ping rounded-full bg-orange-400 opacity-0 delay-200 group-hover:opacity-100"></div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
