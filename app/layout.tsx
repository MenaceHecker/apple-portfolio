import "./globals.css";

export const metadata = {
  title: "Tushar Mishra — Portfolio",
  description: "Apple-ish 3D portfolio SPA",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
