import { useState, memo } from "react";
import { useTranslation } from "react-i18next";
import { MessageSquare, Send, Edit, Trash2, X } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";

interface ReviewResponseProps {
  reviewId: string;
  artisanId: string;
  clientId: string;
  existingResponse?: {
    id: string;
    content: { ar: string; fr: string };
    createdAt: string;
    updatedAt?: string;
  };
  onResponseAdded?: (response: any) => void;
  onResponseUpdated?: (response: any) => void;
  onResponseDeleted?: (responseId: string) => void;
  className?: string;
}

const ReviewResponse = memo(({ 
  reviewId, 
  artisanId, 
  clientId: _clientId,
  existingResponse, 
  onResponseAdded, 
  onResponseUpdated, 
  onResponseDeleted,
  className = "" 
}: ReviewResponseProps) => {
  const { i18n } = useTranslation();
  const lang = i18n.language as "ar" | "fr";
  const { user } = useAuth();
  
  const [isEditing, setIsEditing] = useState(!existingResponse);
  const [responseText, setResponseText] = useState({
    ar: existingResponse?.content.ar || "",
    fr: existingResponse?.content.fr || ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canManageResponse = user && (
    user.role === "SUPER_ADMIN" || 
    user.role === "ADMIN" || 
    (user.role === "ARTISAN" && user.id === Number(artisanId))
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!responseText.ar.trim() || !responseText.fr.trim()) {
      setError(lang === "ar" ? "يرجى ملء جميع الحقول" : "Veuillez remplir tous les champs");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = {
        id: existingResponse?.id || Date.now().toString(),
        reviewId,
        artisanId,
        content: responseText,
        createdAt: existingResponse?.createdAt || new Date().toISOString(),
        updatedAt: existingResponse ? new Date().toISOString() : undefined
      };

      // Save to localStorage
      const storageKey = 'review_responses';
      const stored = localStorage.getItem(storageKey);
      const responses = stored ? JSON.parse(stored) : [];
      
      if (existingResponse) {
        // Update existing response
        const index = responses.findIndex((r: any) => r.id === existingResponse.id);
        if (index !== -1) {
          responses[index] = response;
        }
        onResponseUpdated?.(response);
      } else {
        // Add new response
        responses.push(response);
        onResponseAdded?.(response);
        
        // TODO: Create notification for client when notification system is available
      }
      
      localStorage.setItem(storageKey, JSON.stringify(responses));
      setIsEditing(false);
      
    } catch (err) {
      setError(lang === "ar" ? "حدث خطأ أثناء حفظ الرد" : "Erreur lors de la sauvegarde de la réponse");
      console.error("Error saving response:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!existingResponse) return;
    
    try {
      const storageKey = 'review_responses';
      const stored = localStorage.getItem(storageKey);
      const responses = stored ? JSON.parse(stored) : [];
      
      const filtered = responses.filter((r: any) => r.id !== existingResponse.id);
      localStorage.setItem(storageKey, JSON.stringify(filtered));
      
      onResponseDeleted?.(existingResponse.id);
    } catch (err) {
      console.error("Error deleting response:", err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(lang === "ar" ? "ar-MA" : "fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (!canManageResponse && !existingResponse) {
    return null;
  }

  return (
    <div className={`bg-gray-50 rounded-lg p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-orange-500" />
          <h4 className="text-sm font-medium text-gray-900">
            {lang === "ar" ? "رد الحرفي" : "Réponse de l'artisan"}
          </h4>
        </div>
        
        {existingResponse && canManageResponse && !isEditing && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 text-gray-500 hover:text-orange-600 rounded"
              title={lang === "ar" ? "تعديل الرد" : "Modifier la réponse"}
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-1 text-gray-500 hover:text-red-600 rounded"
              title={lang === "ar" ? "حذف الرد" : "Supprimer la réponse"}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        /* Edit Form */
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
          
          {/* Arabic Response */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {lang === "ar" ? "الرد بالعربية" : "Réponse en arabe"}
            </label>
            <textarea
              value={responseText.ar}
              onChange={(e) => setResponseText(prev => ({ ...prev, ar: e.target.value }))}
              placeholder={lang === "ar" ? "اكتب ردك بالعربية..." : "Écrivez votre réponse en arabe..."}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              rows={3}
              dir="rtl"
              required
            />
          </div>
          
          {/* French Response */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {lang === "ar" ? "الرد بالفرنسية" : "Réponse en français"}
            </label>
            <textarea
              value={responseText.fr}
              onChange={(e) => setResponseText(prev => ({ ...prev, fr: e.target.value }))}
              placeholder={lang === "ar" ? "اكتب ردك بالفرنسية..." : "Écrivez votre réponse en français..."}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              rows={3}
              required
            />
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {existingResponse 
                ? (lang === "ar" ? "تحديث الرد" : "Mettre à jour")
                : (lang === "ar" ? "إرسال الرد" : "Envoyer la réponse")
              }
            </button>
            
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                if (existingResponse) {
                  setResponseText({
                    ar: existingResponse.content.ar,
                    fr: existingResponse.content.fr
                  });
                } else {
                  setResponseText({ ar: "", fr: "" });
                }
                setError(null);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              <X className="w-4 h-4" />
              {lang === "ar" ? "إلغاء" : "Annuler"}
            </button>
          </div>
        </form>
      ) : existingResponse ? (
        /* Display Response */
        <div>
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 leading-relaxed mb-3">
              {lang === "ar" ? existingResponse.content.ar : existingResponse.content.fr}
            </p>
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-200">
            <span>
              {lang === "ar" ? "تاريخ الرد:" : "Répondu le:"} {formatDate(existingResponse.createdAt)}
            </span>
            {existingResponse.updatedAt && (
              <span>
                {lang === "ar" ? "آخر تحديث:" : "Modifié le:"} {formatDate(existingResponse.updatedAt)}
              </span>
            )}
          </div>
        </div>
      ) : canManageResponse ? (
        /* Add Response Button */
        <button
          onClick={() => setIsEditing(true)}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-orange-300 hover:text-orange-600 transition-colors"
        >
          <div className="flex items-center justify-center gap-2">
            <MessageSquare className="w-5 h-5" />
            <span>{lang === "ar" ? "إضافة رد" : "Ajouter une réponse"}</span>
          </div>
        </button>
      ) : null}
    </div>
  );
});

ReviewResponse.displayName = "ReviewResponse";

export default ReviewResponse;
