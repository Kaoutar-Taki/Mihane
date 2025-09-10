import { useProfile } from "./ProfileContext";
import SectionCard from "../components/ui/SectionCard";

export default function ProfileGallery() {
  const profile = useProfile();
  const images = profile.gallery || [];

  return (
    <SectionCard title="معرض الصور">
      {images.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-gray-500">
          لا توجد صور بعد.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((src, i) => (
            <a
              key={i}
              href={src}
              target="_blank"
              rel="noreferrer"
              className={`group overflow-hidden rounded-xl ring-1 ring-gray-100 ${
                i === 0 && images.length >= 3 ? "col-span-2 row-span-2" : ""
              }`}
            >
              <img
                src={src}
                alt={`gallery ${i + 1}`}
                className="h-36 w-full object-cover transition duration-300 group-hover:scale-105 sm:h-40 md:h-44"
                loading="lazy"
              />
            </a>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
