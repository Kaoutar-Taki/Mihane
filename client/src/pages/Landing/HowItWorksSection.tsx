import { useTranslation } from "react-i18next";
import { Search, MessageCircle, CheckCircle, ArrowRight } from "lucide-react";

export default function HowItWorksSection() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  const steps = [
    {
      icon: Search,
      title: t("landing.howItWorks.step1.title"),
      description: t("landing.howItWorks.step1.desc"),
      number: "01",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: MessageCircle,
      title: t("landing.howItWorks.step2.title"),
      description: t("landing.howItWorks.step2.desc"),
      number: "02",
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      icon: CheckCircle,
      title: t("landing.howItWorks.step3.title"),
      description: t("landing.howItWorks.step3.desc"),
      number: "03",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white py-20">
      <div className="absolute inset-0 opacity-30">
        <div className="bg-primary/5 absolute top-10 left-10 h-72 w-72 rounded-full blur-3xl"></div>
        <div className="bg-secondary/5 absolute right-10 bottom-10 h-96 w-96 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
          <div className="via-primary/20 h-32 w-px bg-gradient-to-b from-transparent to-transparent"></div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="mb-16 text-center">
          <div className="bg-primary/10 text-primary mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium">
            <CheckCircle size={16} />
            {t("landing.howItWorks.badge")}
          </div>
          <h2 className="mb-6 text-4xl leading-tight font-bold text-gray-900 md:text-5xl">
            {t("landing.howItWorks.title")}
          </h2>
          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-600">
            {t("landing.howItWorks.subtitle")}
          </p>
        </div>

        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              const isLast = index === steps.length - 1;

              return (
                <div key={index} className="group relative">
                  {!isLast && (
                    <div
                      className={`absolute top-24 hidden lg:block ${isRTL ? "right-full -mr-6" : "left-full ml-6"} from-primary/30 to-secondary/30 z-10 h-0.5 w-12 bg-gradient-to-r`}
                    >
                      <div className="from-primary to-secondary absolute inset-0 bg-gradient-to-r opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                      <ArrowRight
                        size={16}
                        className={`text-primary/60 group-hover:text-primary absolute top-1/2 -translate-y-1/2 transition-colors duration-300 ${isRTL ? "left-0 rotate-180" : "right-0"}`}
                      />
                    </div>
                  )}

                  <div
                    className={`${step.bgColor} rounded-3xl border border-white/50 p-8 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl`}
                  >
                    <div className="from-primary to-secondary absolute -top-6 -left-6 flex h-12 w-12 rotate-12 items-center justify-center rounded-2xl bg-gradient-to-br text-lg font-bold text-white shadow-xl transition-transform duration-300 group-hover:rotate-0">
                      {step.number}
                    </div>

                    <div className="mb-8 text-center">
                      <div
                        className={`inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br ${step.color} text-white shadow-2xl transition-all duration-300 group-hover:scale-110`}
                      >
                        <IconComponent size={32} />
                      </div>
                    </div>

                    <div className="text-center">
                      <h3 className="group-hover:text-primary mb-4 text-2xl font-bold text-gray-900 transition-colors duration-300">
                        {step.title}
                      </h3>
                      <p className="text-lg leading-relaxed text-gray-700">
                        {step.description}
                      </p>
                    </div>

                    <div className="from-primary/5 to-secondary/5 absolute inset-0 rounded-3xl bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
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
