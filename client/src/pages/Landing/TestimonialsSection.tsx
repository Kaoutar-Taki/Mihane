import { useState, useMemo, useEffect, useRef } from "react";
import {
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLang } from "../../hooks/useLang";
import testimonialsData from "../../data/platform-testimonials.json";
import usersData from "../../data/platform-users.json";

interface Testimonial {
  id: number;
  userId: number;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
}

interface User {
  id: number;
  name: {
    ar: string;
    fr: string;
  };
  role: string;
  avatar: string;
  description: {
    ar: string;
    fr: string;
  };
}

interface TestimonialWithUser extends Testimonial {
  user?: User;
}

const ITEMS_PER_PAGE = 3;
const AUTO_SCROLL_INTERVAL = 5000;

export default function TestimonialsSection() {
  const { t } = useTranslation();
  const { lang, dir } = useLang();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const testimonials = useMemo(() => {
    return testimonialsData.map((testimonial: Testimonial) => {
      const user = usersData.find((u: User) => u.id === testimonial.userId);
      return { ...testimonial, user } as TestimonialWithUser;
    });
  }, []);

  const totalPages = Math.ceil(testimonials.length / ITEMS_PER_PAGE);

  useEffect(() => {
    if (!isHovered && totalPages > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % totalPages);
      }, AUTO_SCROLL_INTERVAL);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isHovered, totalPages]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const getCurrentItems = () => {
    const start = currentIndex * ITEMS_PER_PAGE;
    return testimonials.slice(start, start + ITEMS_PER_PAGE);
  };
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 transition-colors ${
          i < rating ? "fill-current text-amber-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(lang === "ar" ? "ar-MA" : "fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getRoleText = (role: string) => {
    return t(`landing.testimonials.roles.${role}`) || role;
  };

  const TestimonialCard = ({
    testimonial,
  }: {
    testimonial: TestimonialWithUser;
  }) => (
    <div className="group h-full">
      <div className="flex h-full flex-col rounded-2xl border border-orange-100/50 bg-white/95 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-100/50">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex gap-0.5">{renderStars(testimonial.rating)}</div>
          <span className="text-sm font-bold text-amber-600">
            {testimonial.rating}/5
          </span>
        </div>

        <blockquote
          className={`mb-6 flex-1 text-base leading-relaxed text-gray-700 ${
            lang === "ar" ? "text-right" : "text-left"
          }`}
          dir={dir}
        >
          <Quote className="mb-2 h-5 w-5 text-orange-400" />"
          {testimonial.comment}"
        </blockquote>

        <div
          className={`flex items-center gap-3 ${lang === "ar" ? "flex-row-reverse" : ""}`}
        >
          {
            <div className="relative">
              <img
                src={testimonial.user?.avatar}
                alt={
                  testimonial.user?.name?.[
                    lang as keyof typeof testimonial.user.name
                  ] || "User"
                }
                className="h-14 w-14 rounded-full border-3 border-orange-200 object-cover shadow-md"
              />
            </div>
          }

          <div
            className={`flex-1 ${lang === "ar" ? "text-right" : "text-left"}`}
          >
            <h4 className="font-bold text-gray-800">
              {testimonial.user?.name?.[
                lang as keyof typeof testimonial.user.name
              ] || "Utilisateur Anonyme"}
            </h4>
            <p className="text-sm font-medium text-orange-600">
              {getRoleText(testimonial.user?.role || "CLIENT")}
            </p>
            <p className="text-xs text-gray-500">
              {formatDate(testimonial.createdAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const NavigationButton = ({
    direction,
    onClick,
    className = "",
  }: {
    direction: "prev" | "next";
    onClick: () => void;
    className?: string;
  }) => (
    <button
      onClick={onClick}
      className={`group rounded-full bg-white/90 p-3 shadow-xl backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white hover:shadow-2xl ${className}`}
      aria-label={
        direction === "prev" ? "Previous testimonials" : "Next testimonials"
      }
    >
      {direction === "prev" ? (
        <ChevronLeft className="h-5 w-5 text-gray-600 transition-colors group-hover:text-orange-500" />
      ) : (
        <ChevronRight className="h-5 w-5 text-gray-600 transition-colors group-hover:text-orange-500" />
      )}
    </button>
  );

  const PaginationDots = () => (
    <div className="mt-10 flex items-center justify-center gap-2">
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index}
          onClick={() => goToSlide(index)}
          className={`rounded-full transition-all duration-300 ${
            index === currentIndex
              ? "h-2 w-8 bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg"
              : "h-2 w-2 bg-gray-300 hover:scale-125 hover:bg-gray-400"
          }`}
          aria-label={`Go to testimonial page ${index + 1}`}
        />
      ))}
    </div>
  );

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-24">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 h-72 w-72 animate-pulse rounded-full bg-gradient-to-r from-orange-200/30 to-amber-200/30 blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full bg-gradient-to-r from-amber-200/20 to-yellow-200/20 blur-3xl delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 transform animate-pulse rounded-full bg-gradient-to-r from-yellow-200/15 to-orange-200/15 blur-3xl delay-500"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-20 text-center">
          <div className="mb-8 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 px-6 py-3 text-orange-700 backdrop-blur-sm">
            <MessageSquare size={18} className="animate-pulse" />
            <span className="text-sm font-semibold tracking-wider uppercase">
              {t("landing.testimonials.badge")}
            </span>
            <Sparkles size={18} className="animate-spin" />
          </div>

          <h2
            className="mb-6 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-4xl leading-tight font-bold text-transparent md:text-5xl"
            dir={dir}
          >
            {t("landing.testimonials.title")}
          </h2>

          <p
            className={`mx-auto max-w-3xl text-xl leading-relaxed text-gray-700 ${
              lang === "ar" ? "text-right" : "text-left"
            }`}
            dir={dir}
          >
            {t("landing.testimonials.subtitle")}
          </p>
        </div>

        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="grid grid-cols-1 gap-8 transition-all duration-700 ease-in-out md:grid-cols-2 lg:grid-cols-3">
            {getCurrentItems().map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>

          {totalPages > 1 && (
            <>
              <NavigationButton
                direction="prev"
                onClick={prevSlide}
                className="absolute top-1/2 -left-6 -translate-y-1/2 transform"
              />
              <NavigationButton
                direction="next"
                onClick={nextSlide}
                className="absolute top-1/2 -right-6 -translate-y-1/2 transform"
              />
            </>
          )}
        </div>

        {totalPages > 1 && <PaginationDots />}
      </div>
    </section>
  );
}
