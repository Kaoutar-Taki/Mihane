type Props = {
  name: string;
  job: string;
  city: string;
  rating: number;
};

export default function SearchCard({ name, job, city, rating }: Props) {
  return (
    <div className="bg-white p-4 rounded shadow flex justify-between items-center">
      <div>
        <h4 className="text-xl font-bold">{name}</h4>
        <p className="text-sm text-gray-600">
          {job} – {city}
        </p>
      </div>
      <div className="text-yellow-500 font-semibold">{rating} ⭐</div>
    </div>
  );
}
