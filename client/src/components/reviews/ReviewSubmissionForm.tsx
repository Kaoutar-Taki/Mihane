import { useState } from "react";
import { Star, Upload, X, Send } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import { useReviews } from "../../hooks/useReviews";
import type { ReviewFormData } from "../../types/review";
import FormField from "../ui/FormField";
import ValidationMessage from "../ui/ValidationMessage";
import LoadingSpinner from "../ui/LoadingSpinner";

interface ReviewSubmissionFormProps {
  artisanId: string;
  artisanName: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ReviewSubmissionForm({ 
  artisanId, 
  artisanName, 
  onSuccess, 
  onCancel 
}: ReviewSubmissionFormProps) {
  const { user } = useAuth();
  const { submitReview, loading } = useReviews();
  const [formData, setFormData] = useState<ReviewFormData>({
    artisanId,
    rating: 0,
    comment: "",
    projectType: "",
    images: []
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.rating === 0) {
      newErrors.rating = "يرجى اختيار تقييم";
    }

    if (!formData.comment.trim()) {
      newErrors.comment = "يرجى كتابة تعليق";
    } else if (formData.comment.trim().length < 10) {
      newErrors.comment = "التعليق يجب أن يكون 10 أحرف على الأقل";
    }

    if (!formData.projectType.trim()) {
      newErrors.projectType = "يرجى تحديد نوع المشروع";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const success = await submitReview(formData);
      if (success) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess?.();
        }, 2000);
      }
    } catch (error) {
      setErrors({ submit: "حدث خطأ أثناء إرسال التقييم" });
    }
  };

  const handleRatingClick = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
    if (errors.rating) {
      setErrors(prev => ({ ...prev, rating: "" }));
    }
  };

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;
    
    const newImages = Array.from(files).slice(0, 3); // Max 3 images
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index) || []
    }));
  };

  if (!user || user.role !== "CLIENT") {
    return (
      <div className="text-center p-6">
        <p className="text-gray-600">يجب تسجيل الدخول كعميل لكتابة تقييم</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center p-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Star className="w-8 h-8 text-green-600 fill-current" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          تم إرسال التقييم بنجاح!
        </h3>
        <p className="text-gray-600">
          شكراً لك على تقييمك. سيتم مراجعته ونشره قريباً.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          تقييم الحرفي: {artisanName}
        </h3>
        <p className="text-gray-600">
          شاركنا تجربتك مع هذا الحرفي لمساعدة الآخرين
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            التقييم *
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingClick(star)}
                className={`p-1 transition-colors ${
                  star <= formData.rating
                    ? "text-yellow-400"
                    : "text-gray-300 hover:text-yellow-300"
                }`}
              >
                <Star 
                  className={`w-8 h-8 ${star <= formData.rating ? "fill-current" : ""}`} 
                />
              </button>
            ))}
            <span className="ml-3 text-sm text-gray-600">
              {formData.rating > 0 && `${formData.rating}/5`}
            </span>
          </div>
          {errors.rating && (
            <p className="text-sm text-red-600 mt-1">{errors.rating}</p>
          )}
        </div>

        {/* Project Type */}
        <FormField
          label="نوع المشروع"
          required
          error={errors.projectType}
        >
          <input
            type="text"
            value={formData.projectType}
            onChange={(e) => setFormData(prev => ({ ...prev, projectType: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="مثال: طاجين مخصص، خزانة مكتب، قفطان..."
            dir="rtl"
          />
        </FormField>

        {/* Comment */}
        <FormField
          label="التعليق"
          required
          error={errors.comment}
          hint="اكتب تجربتك مع الحرفي (10 أحرف على الأقل)"
        >
          <textarea
            value={formData.comment}
            onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="شاركنا تجربتك مع هذا الحرفي..."
            dir="rtl"
          />
          <div className="text-xs text-gray-500 mt-1">
            {formData.comment.length}/500
          </div>
        </FormField>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            صور المشروع (اختياري)
          </label>
          <div className="space-y-3">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-orange-400 transition-colors">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                اسحب الصور هنا أو انقر للاختيار
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files)}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="inline-block px-4 py-2 bg-orange-50 text-orange-700 rounded-lg cursor-pointer hover:bg-orange-100 transition-colors text-sm"
              >
                اختيار صور (حد أقصى 3)
              </label>
            </div>

            {/* Image Previews */}
            {formData.images && formData.images.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {formData.images.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <ValidationMessage type="error" message={errors.submit} />
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg hover:from-orange-700 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" color="white" />
                جاري الإرسال...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                إرسال التقييم
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
