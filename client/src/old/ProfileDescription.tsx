import { useProfile } from "./ProfileContext";
import SectionCard from "../components/ui/SectionCard";

export default function ProfileDescription() {
  const profile = useProfile();
  return (
    <SectionCard title="نبذة عن الحرفي">
      <p className="text-sm leading-relaxed text-gray-700 md:text-base">
        {profile.description || "—"}
      </p>
    </SectionCard>
  );
}
