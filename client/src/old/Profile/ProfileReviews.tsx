import { useProfile } from "../ProfileContext";
import SectionCard from "../../components/ui/SectionCard";

export default function ProfileReviews() {
  const profile = useProfile();
  const avg =
    profile.reviews.length > 0
      ? profile.reviews.reduce((s, r) => s + r.rating, 0) /
        profile.reviews.length
      : 0;

  return (
    <SectionCard
      className="rounded-b-2xl"
      title="تقييمات الزبناء"
      right={
        <div className="text-sm text-gray-700">
          ⭐ {avg.toFixed(1)} · {profile.reviews.length} تقييم
        </div>
      }
    >
      {profile.reviews.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-gray-500">
          لا توجد تقييمات حالياً.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {profile.reviews.map((r) => (
            <div
              key={r.id}
              className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm ring-1 ring-gray-50"
            >
              <div className="mb-1 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 font-semibold text-orange-700">
                    {r.name?.[0] || "ز"}
                  </div>
                  <span className="font-semibold text-gray-900">{r.name}</span>
                </div>
                <div className="text-sm text-yellow-500">
                  {"★".repeat(r.rating)}
                  {"☆".repeat(5 - r.rating)}
                </div>
              </div>
              <p className="text-sm text-gray-700">{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
