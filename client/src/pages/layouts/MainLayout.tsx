import type { ReactNode } from "react";
import { Navbar, Footer } from "@/components";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-light text-dark flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
