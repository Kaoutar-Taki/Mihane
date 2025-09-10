export default function SearchFilter() {
  return (
    <div className="bg-white shadow rounded p-4 space-y-4">
      <h3 className="font-bold text-lg mb-2">🔎 فلترة</h3>
      <select className="w-full border p-2 rounded">
        <option>المدينة</option>
        <option>الرباط</option>
        <option>فاس</option>
        <option>الدار البيضاء</option>
      </select>
      <select className="w-full border p-2 rounded">
        <option>نوع الخدمة</option>
        <option>سباكة</option>
        <option>نقش</option>
        <option>طبخ</option>
      </select>
      <select className="w-full border p-2 rounded">
        <option>التقييم</option>
        <option>+4 ⭐</option>
        <option>+3 ⭐</option>
      </select>
    </div>
  );
}
