import SearchFilter from "./SearchFilter";
import SearchCard from "./SearchCard";

const dummyResults = [
  {
    id: 1,
    name: "محمد الزهر",
    job: "كهربائي",
    city: "الرباط",
    rating: 4.5,
  },
  {
    id: 2,
    name: "Fatima B.",
    job: "Coiffeuse",
    city: "Casablanca",
    rating: 5,
  },
];

export default function SearchResults() {

  return (
    <div className="p-6 grid md:grid-cols-4 gap-6">
      <aside className="md:col-span-1">
        <SearchFilter />
      </aside>
      <section className="md:col-span-3 space-y-4">
        {dummyResults.map((item) => (
          <SearchCard key={item.id} {...item} />
        ))}
      </section>
    </div>
  );
}
