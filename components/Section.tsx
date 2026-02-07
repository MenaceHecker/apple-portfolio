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
      className="scroll-mt-24 py-20 md:py-24"
    >
      {children}
    </section>
  );
}
