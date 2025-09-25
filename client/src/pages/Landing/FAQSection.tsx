import { useTranslation } from "react-i18next";
import { useState, useMemo } from "react";
import { ChevronDown, ChevronUp, HelpCircle, Sparkles } from "lucide-react";
import faqsData from "@/data/platform-faqs.json";
import { useLang } from "@/hooks";
import type { FAQ } from "@/data/types";

export default function FAQSection() {
  const { t } = useTranslation();
  const { lang } = useLang();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = useMemo(() => {
    return (faqsData as FAQ[])
      .filter((faq) => faq.isActive)
      .sort((a, b) => a.priority - b.priority)
      .map((faq) => ({
        id: faq.id,
        question: faq.question[lang as keyof typeof faq.question],
        answer: faq.answer[lang as keyof typeof faq.answer],
      }));
  }, [lang]);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-orange-50/30 to-amber-50/30 py-20">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 h-72 w-72 animate-pulse rounded-full bg-orange-200/15 blur-3xl"></div>
        <div className="absolute right-1/4 bottom-1/4 h-80 w-80 animate-pulse rounded-full bg-amber-200/15 blur-3xl delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="mb-16 text-center">
          <div className="mb-8 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 px-6 py-3 text-orange-700 backdrop-blur-sm">
            <HelpCircle size={18} className="animate-pulse" />
            <span className="text-sm font-semibold tracking-wider uppercase">
              {t("landing.faq.badge")}
            </span>
            <Sparkles size={18} className="animate-spin" />
          </div>

          <h2 className="mb-6 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-4xl leading-tight font-bold text-transparent md:text-5xl">
            {t("landing.faq.title")}
          </h2>
          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-700">
            {t("landing.faq.subtitle")}
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={faq.id}
                className="group rounded-2xl border-2 border-orange-100/50 bg-white/80 shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-orange-200 hover:shadow-xl"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="flex w-full items-center justify-between p-6 text-left transition-colors duration-300 hover:bg-orange-50/50"
                  aria-expanded={openIndex === index}
                >
                  <h3 className="text-lg font-semibold text-gray-900 transition-colors duration-300 group-hover:text-orange-600">
                    {faq.question}
                  </h3>
                  <div className="ml-4 flex-shrink-0">
                    {openIndex === index ? (
                      <ChevronUp
                        size={24}
                        className="text-orange-600 transition-transform duration-300"
                      />
                    ) : (
                      <ChevronDown
                        size={24}
                        className="text-gray-400 transition-all duration-300 group-hover:text-orange-600"
                      />
                    )}
                  </div>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    openIndex === index
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="border-t border-orange-100/50 px-6 pt-4 pb-6">
                    <p className="leading-relaxed text-gray-700">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="rounded-2xl bg-gradient-to-r from-orange-100/60 to-amber-100/60 p-8 backdrop-blur-sm">
            <h3 className="mb-4 text-2xl font-bold text-gray-900">
              {t("landing.faq.stillHaveQuestions")}
            </h3>
            <p className="mb-6 text-gray-700">{t("landing.faq.contactDesc")}</p>
            <a
              href="/contact"
              className="inline-flex transform items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-orange-700 hover:to-amber-700 hover:shadow-xl"
            >
              <HelpCircle size={20} />
              {t("contact.title")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
