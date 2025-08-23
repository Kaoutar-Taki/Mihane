import { Link } from "react-router-dom";

export type ProfileCardProps = {
  id: number;
  fullName: string;
  image: string;
  profession: string;
  city?: string;
  region?: string;
  genre_id?: 1 | 2; 
};

export default function ProfileCard({
  id,
  fullName,
  image,
  profession,
  city,
  region,
  genre_id,
}: ProfileCardProps) {
  return (
    <Link
      to={`/profile/${id}`}
      className="block rounded-lg bg-white p-4 shadow transition duration-300 hover:scale-[1.02] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary"
      aria-label={fullName}
    >
      <img
        src={image}
        alt={fullName}
        loading="lazy"
        width={128}
        height={128}
        className="mx-auto mb-4 h-32 w-32 rounded-full border-2 border-orange-500 object-cover shadow-md"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src =
            genre_id === 2 ? "/assets/profiles/defaultWomen.png" : "/assets/profiles/defaultMan.png";
        }}
      />

      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800">{fullName}</h3>
        <p className="text-sm text-gray-600">{profession}</p>
        {(city || region) && (
          <p className="mt-1 text-xs text-gray-500">
            {city ?? "—"}{region ? ` - ${region}` : ""}
          </p>
        )}
      </div>
    </Link>
  );
}
