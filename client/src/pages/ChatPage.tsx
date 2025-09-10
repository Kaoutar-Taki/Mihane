import { useParams } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

export default function ChatPage() {
  const { proId } = useParams();
  return (
    <MainLayout>
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">المراسلة</h1>
        <p className="text-gray-700">محادثة تجريبية مع الحرفي رقم: {proId}</p>
      </div>
    </MainLayout>
  );
}
