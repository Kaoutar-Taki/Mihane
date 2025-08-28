import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import {
  Users,
  Target,
  Award,
  Heart,
  Shield,
  Zap,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Eye,
  HandHeart,
  TrendingUp,
} from "lucide-react";

export default function AboutPage() {
  const { t } = useTranslation();

  const features = [
    {
      icon: Shield,
      title: t("about.features.trust.title"),
      description: t("about.features.trust.desc"),
    },
    {
      icon: Zap,
      title: t("about.features.speed.title"),
      description: t("about.features.speed.desc"),
    },
    {
      icon: Award,
      title: t("about.features.quality.title"),
      description: t("about.features.quality.desc"),
    },
    {
      icon: Heart,
      title: t("about.features.support.title"),
      description: t("about.features.support.desc"),
    },
  ];

  const values = [
    {
      title: t("about.values.authenticity.title"),
      description: t("about.values.authenticity.desc"),
    },
    {
      title: t("about.values.innovation.title"),
      description: t("about.values.innovation.desc"),
    },
    {
      title: t("about.values.community.title"),
      description: t("about.values.community.desc"),
    },
  ];

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <section className="relative overflow-hidden py-24">
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full bg-gradient-to-r from-orange-200/20 to-amber-200/20 blur-3xl"></div>
            <div className="absolute right-1/4 bottom-1/4 h-80 w-80 animate-pulse rounded-full bg-gradient-to-r from-amber-200/30 to-yellow-200/30 blur-3xl delay-1000"></div>
            <div
              className="absolute top-1/2 left-1/2 h-64 w-64 animate-bounce rounded-full bg-orange-300/10 blur-2xl delay-2000"
              style={{ animationDuration: "4s" }}
            ></div>
          </div>

          <div className="relative z-10 container mx-auto px-4">
            <div className="mx-auto max-w-5xl text-center">
              <div className="mb-8 inline-flex items-center gap-3 rounded-full bg-white/80 px-8 py-4 shadow-xl backdrop-blur-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-amber-500">
                  <Sparkles size={16} className="animate-spin text-white" />
                </div>
                <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-lg font-bold text-transparent">
                  {t("about.badge")}
                </span>
              </div>

              <h1 className="mb-8 bg-gradient-to-r from-gray-900 via-orange-800 to-amber-800 bg-clip-text text-5xl leading-tight font-black text-transparent md:text-7xl">
                {t("about.hero.title")}
              </h1>

              <p className="mx-auto mb-12 max-w-4xl text-xl leading-relaxed text-gray-700 md:text-2xl">
                {t("about.hero.subtitle")}
              </p>

              <div className="flex flex-wrap justify-center gap-6">
                <Link
                  to="/profiles"
                  className="group relative inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 px-10 py-5 text-lg font-bold text-white shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:scale-105 hover:shadow-orange-500/50"
                >
                  <Users size={24} />
                  <span>{t("about.cta.explore")}</span>
                  <ArrowRight
                    size={20}
                    className="transition-transform duration-300 group-hover:translate-x-2"
                  />
                </Link>

                <Link
                  to="/categories"
                  className="group inline-flex items-center gap-3 rounded-2xl border-2 border-orange-300 bg-white/90 px-10 py-5 text-lg font-bold text-orange-600 shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-orange-50 hover:shadow-xl"
                >
                  <Target size={24} />
                  <span>{t("about.cta.categories")}</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white/50 py-20">
          <div className="container mx-auto px-4">
            <div className="mb-16 text-center">
              <h2 className="mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-3xl font-black text-transparent md:text-5xl">
                {t("about.howItWorks.title")}
              </h2>
              <p className="mx-auto max-w-3xl text-lg text-gray-600">
                {t("about.howItWorks.subtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
              <div className="group relative text-center">
                <div className="relative mx-auto mb-8 flex h-24 w-24 items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 opacity-20 blur-xl transition-all duration-500 group-hover:opacity-40"></div>
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-amber-500 shadow-xl">
                    <Eye size={32} className="text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-lg">
                    <span className="text-sm font-bold text-orange-600">1</span>
                  </div>
                </div>
                <h3 className="mb-4 text-xl font-bold text-gray-900">
                  {t("about.howItWorks.step1.title")}
                </h3>
                <p className="leading-relaxed text-gray-600">
                  {t("about.howItWorks.step1.desc")}
                </p>
              </div>

              <div className="group relative text-center">
                <div className="relative mx-auto mb-8 flex h-24 w-24 items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 opacity-20 blur-xl transition-all duration-500 group-hover:opacity-40"></div>
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-amber-500 shadow-xl">
                    <HandHeart size={32} className="text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-lg">
                    <span className="text-sm font-bold text-orange-600">2</span>
                  </div>
                </div>
                <h3 className="mb-4 text-xl font-bold text-gray-900">
                  {t("about.howItWorks.step2.title")}
                </h3>
                <p className="leading-relaxed text-gray-600">
                  {t("about.howItWorks.step2.desc")}
                </p>
              </div>

              <div className="group relative text-center">
                <div className="relative mx-auto mb-8 flex h-24 w-24 items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 opacity-20 blur-xl transition-all duration-500 group-hover:opacity-40"></div>
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-amber-500 shadow-xl">
                    <TrendingUp size={32} className="text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-lg">
                    <span className="text-sm font-bold text-orange-600">3</span>
                  </div>
                </div>
                <h3 className="mb-4 text-xl font-bold text-gray-900">
                  {t("about.howItWorks.step3.title")}
                </h3>
                <p className="leading-relaxed text-gray-600">
                  {t("about.howItWorks.step3.desc")}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mb-16 text-center">
              <h2 className="mb-6 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-3xl font-black text-transparent md:text-5xl">
                {t("about.features.title")}
              </h2>
              <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-600">
                {t("about.features.subtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div
                    key={index}
                    className="group relative overflow-hidden rounded-3xl border-2 border-orange-100 bg-white p-8 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:border-orange-300 hover:shadow-2xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 to-amber-50/30 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                    <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-orange-500 to-amber-500"></div>

                    <div className="relative flex items-start gap-6">
                      <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 shadow-inner transition-all duration-300 group-hover:scale-110">
                        <IconComponent size={28} className="text-orange-600" />
                      </div>

                      <div className="flex-1">
                        <h3 className="mb-4 text-xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-orange-600">
                          {feature.title}
                        </h3>
                        <p className="leading-relaxed text-gray-600">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl rounded-3xl border-2 border-orange-100 bg-white/80 p-8 shadow-2xl backdrop-blur-sm md:p-12">
              <div className="text-center">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg">
                  <Target size={32} className="text-white" />
                </div>

                <h2 className="mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-3xl font-black text-transparent md:text-4xl">
                  {t("about.mission.title")}
                </h2>

                <p className="text-lg leading-relaxed text-gray-700 md:text-xl">
                  {t("about.mission.description")}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mb-16 text-center">
              <h2 className="mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-3xl font-black text-transparent md:text-5xl">
                {t("about.values.title")}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-2xl border border-orange-100 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl"
                >
                  <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-orange-500 to-amber-500"></div>

                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100">
                      <CheckCircle size={20} className="text-orange-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {value.title}
                    </h3>
                  </div>

                  <p className="leading-relaxed text-gray-600">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="mx-auto max-w-2xl rounded-3xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 p-8 shadow-2xl md:p-12">
              <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
                {t("about.cta.title")}
              </h2>
              <p className="mb-8 text-lg text-orange-100">
                {t("about.cta.subtitle")}
              </p>
              <Link
                to="/profiles"
                className="group inline-flex items-center gap-3 rounded-2xl bg-white px-8 py-4 font-bold text-orange-600 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <span>{t("about.cta.button")}</span>
                <ArrowRight
                  size={20}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
