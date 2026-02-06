"use client";

export default function Section({
  id,
  children,
  tight = false,
}: {
  id: string;
  children: React.ReactNode;
  tight?: boolean;
}) {
  return (
    <section
      id={id}
      className={`
        relative
        ${tight ? "py-16 md:py-20" : "py-20 md:py-24"}
      `}
    >
      {children}
    </section>
  );
}
