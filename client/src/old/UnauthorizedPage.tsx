import { useNavigate } from "react-router-dom";
import { ShieldX, ArrowRight } from "lucide-react";

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <ShieldX className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              غير مصرح لك بالوصول
            </h1>
            <p className="text-gray-600">
              ليس لديك الصلاحيات اللازمة لعرض هذه الصفحة
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => navigate(-1)}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white px-6 py-3 rounded-lg hover:from-orange-700 hover:to-amber-700 transition-all"
            >
              العودة للصفحة السابقة
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate("/")}
              className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              الذهاب للصفحة الرئيسية
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
