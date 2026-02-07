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
      className="scroll-mt-24 py-12 md:py-16"
    >
      {children}
    </section>
  );
}
