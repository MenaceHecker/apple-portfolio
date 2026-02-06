export default function Section({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="relative px-6 py-20 sm:py-28 md:py-32"
      style={{ scrollMarginTop: 96 }}
    >
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}
