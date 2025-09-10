import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, User, Mail, Phone, MapPin } from "lucide-react";
import { useAuth } from "../auth/AuthContext";

export default function ClientRegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    city: "",
    agreeToTerms: false
  });

  const cities = [
    { value: "fes", label: "فاس" },
    { value: "casablanca", label: "الدار البيضاء" },
    { value: "rabat", label: "الرباط" },
    { value: "marrakech", label: "مراكش" },
    { value: "meknes", label: "مكناس" },
    { value: "tetouan", label: "تطوان" },
    { value: "agadir", label: "أكادير" },
    { value: "tangier", label: "طنجة" }
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "الاسم مطلوب";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "الاسم يجب أن يكون حرفين على الأقل";
    }

    if (!formData.email.trim()) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "البريد الإلكتروني غير صحيح";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "رقم الهاتف مطلوب";
    } else if (!/^(\+212|0)[5-7]\d{8}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "رقم الهاتف غير صحيح";
    }

    if (!formData.password) {
      newErrors.password = "كلمة المرور مطلوبة";
    } else if (formData.password.length < 6) {
      newErrors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "تأكيد كلمة المرور مطلوب";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "كلمة المرور غير متطابقة";
    }

    if (!formData.city) {
      newErrors.city = "المدينة مطلوبة";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "يجب الموافقة على الشروط والأحكام";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create new client user
      const newUser = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        role: "CLIENT" as const,
        avatar: "/avatars/default-client.png",
        isActive: true,
        createdAt: new Date().toISOString(),
        preferences: {
          language: "ar",
          notifications: {
            email: true,
            inApp: true
          }
        }
      };

      // Auto-login after registration
      await login(formData.email, formData.password);
      
      // Redirect to browse page
      navigate("/browse", { replace: true });
      
    } catch (error) {
      setErrors({ submit: "حدث خطأ أثناء التسجيل. حاول مرة أخرى." });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            إنشاء حساب جديد
          </h2>
          <p className="text-gray-600">
            انضم إلينا واكتشف أفضل الحرفيين في المغرب
          </p>
        </div>

        <form className="bg-white rounded-2xl shadow-xl p-8 space-y-6" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الاسم الكامل *
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="أدخل اسمك الكامل"
                dir="rtl"
              />
              <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
            {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              البريد الإلكتروني *
            </label>
            <div className="relative">
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="example@email.com"
                dir="ltr"
              />
              <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
            {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              رقم الهاتف *
            </label>
            <div className="relative">
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="+212 6XX XXX XXX"
                dir="ltr"
              />
              <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
            {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              المدينة *
            </label>
            <div className="relative">
              <select
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none ${
                  errors.city ? "border-red-500" : "border-gray-300"
                }`}
                dir="rtl"
              >
                <option value="">اختر المدينة</option>
                {cities.map(city => (
                  <option key={city.value} value={city.value}>
                    {city.label}
                  </option>
                ))}
              </select>
              <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
            {errors.city && <p className="text-sm text-red-600 mt-1">{errors.city}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              كلمة المرور *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="أدخل كلمة المرور"
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              تأكيد كلمة المرور *
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="أعد إدخال كلمة المرور"
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>}
          </div>

          {/* Terms Agreement */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={(e) => handleInputChange("agreeToTerms", e.target.checked)}
              className="mt-1 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
            <label htmlFor="agreeToTerms" className="text-sm text-gray-700 leading-5">
              أوافق على{" "}
              <Link to="/terms" className="text-orange-600 hover:text-orange-700 underline">
                الشروط والأحكام
              </Link>{" "}
              و{" "}
              <Link to="/privacy" className="text-orange-600 hover:text-orange-700 underline">
                سياسة الخصوصية
              </Link>
            </label>
          </div>
          {errors.agreeToTerms && <p className="text-sm text-red-600">{errors.agreeToTerms}</p>}

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-600 to-amber-600 text-white py-3 px-4 rounded-lg hover:from-orange-700 hover:to-amber-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                جاري التسجيل...
              </div>
            ) : (
              "إنشاء الحساب"
            )}
          </button>

          {/* Login Link */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              لديك حساب بالفعل؟{" "}
              <Link
                to="/login"
                className="text-orange-600 hover:text-orange-700 font-medium underline"
              >
                تسجيل الدخول
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
