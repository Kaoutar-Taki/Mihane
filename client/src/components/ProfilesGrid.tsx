import type { ReactNode } from "react";

export default function ProfilesGrid({ children }: { children: ReactNode }) {
  return (
    <ul
      className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3"
      aria-label="Profiles list"
    >
      {children}
    </ul>
  );
}
