import { useTranslation } from "react-i18next";
import {
  Search,
  MessageCircle,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function HowItWorksSection() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  const steps = [
    {
      icon: Search,
      title: t("landing.howItWorks.step1.title"),
      description: t("landing.howItWorks.step1.desc"),
      number: "01",
      color: "from-orange-500 to-amber-500",
      bgColor: "bg-orange-50",
    },
    {
      icon: MessageCircle,
      title: t("landing.howItWorks.step2.title"),
      description: t("landing.howItWorks.step2.desc"),
      number: "02",
      color: "from-amber-500 to-yellow-500",
      bgColor: "bg-amber-50",
    },
    {
      icon: CheckCircle,
      title: t("landing.howItWorks.step3.title"),
      description: t("landing.howItWorks.step3.desc"),
      number: "03",
      color: "from-orange-600 to-amber-600",
      bgColor: "bg-yellow-50",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-white py-20">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-br from-orange-50/50 via-transparent to-amber-50/50"></div>
        <div className="absolute top-1/4 left-1/4 h-80 w-80 animate-pulse rounded-full bg-orange-200/20 blur-3xl"></div>
        <div className="absolute right-1/4 bottom-1/4 h-96 w-96 animate-pulse rounded-full bg-amber-200/20 blur-3xl delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="mb-16 text-center">
          <div className="mb-8 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 px-6 py-3 text-orange-700 backdrop-blur-sm">
            <Sparkles size={18} className="animate-spin" />
            <span className="text-sm font-semibold tracking-wider uppercase">
              {t("landing.howItWorks.badge")}
            </span>
            <CheckCircle size={18} className="animate-pulse" />
          </div>

          <h2 className="mb-6 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-4xl leading-tight font-bold text-transparent md:text-5xl">
            {t("landing.howItWorks.title")}
          </h2>
          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-700">
            {t("landing.howItWorks.subtitle")}
          </p>
        </div>

        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              const isLast = index === steps.length - 1;

              return (
                <div
                  key={index}
                  className="group relative"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  {!isLast && (
                    <div
                      className={`absolute top-24 hidden lg:block ${isRTL ? "right-full -mr-6" : "left-full ml-6"} z-10 h-0.5 w-12 bg-gradient-to-r from-orange-300 to-amber-300`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                      <ArrowRight
                        size={16}
                        className={`absolute top-1/2 -translate-y-1/2 text-orange-500 transition-colors duration-300 group-hover:text-orange-600 ${isRTL ? "left-0 rotate-180" : "right-0"}`}
                      />
                    </div>
                  )}

                  <div
                    className={`${step.bgColor} relative rounded-3xl border-2 border-orange-100/50 bg-white/80 p-8 backdrop-blur-sm transition-all duration-500 hover:-translate-y-3 hover:border-orange-200 hover:shadow-2xl`}
                  >
                    <div className="absolute -top-6 -left-6 flex h-12 w-12 rotate-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-600 to-amber-600 text-lg font-bold text-white shadow-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-0">
                      {step.number}
                    </div>

                    <div className="mb-8 text-center">
                      <div
                        className={`relative inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br ${step.color} text-white shadow-2xl transition-all duration-300 group-hover:scale-110`}
                      >
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                        <IconComponent size={32} className="relative" />
                      </div>
                    </div>

                    <div className="text-center">
                      <h3 className="mb-4 text-2xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-orange-600">
                        {step.title}
                      </h3>
                      <p className="text-lg leading-relaxed text-gray-700">
                        {step.description}
                      </p>
                    </div>

                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-50/50 to-amber-50/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
