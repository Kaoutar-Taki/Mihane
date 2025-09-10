import { useState } from "react";
import { useAuth } from "../auth/AuthContext";

export default function AddReview({
  onSubmit,
}: {
  onSubmit: (rating: number, comment: string) => void;
}) {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  if (!user) {
    return (
      <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 text-sm text-orange-900">
        يلزم تسجيل الدخول لوضع تقييم.
      </div>
    );
  }
  if (user.role !== "client") {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
        الحسابات المهنية لا يمكنها وضع تقييمات.
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            className={`text-lg ${n <= rating ? "text-yellow-500" : "text-gray-300"}`}
          >
            ★
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        placeholder="شارك تجربتك بإيجاز..."
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
      />
      <button
        onClick={() => onSubmit(rating, comment.trim())}
        className="bg-primary rounded-lg px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
      >
        إرسال التقييم
      </button>
    </div>
  );
}
