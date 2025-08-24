import type { ReactNode } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-light text-dark flex min-h-screen flex-col">
      <Navbar />
      <main className="container mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        {children}
      </main>
      <Footer />
    </div>
  );
}
