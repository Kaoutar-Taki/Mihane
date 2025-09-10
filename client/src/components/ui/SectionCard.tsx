import React from "react";

export default function SectionCard({
  title,
  children,
}: {
  title?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      {title && (
        <h3 className="mb-3 text-lg font-semibold text-gray-800">{title}</h3>
      )}
      {children}
    </div>
  );
}
