import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Filely | Permanent File Storage",
  description: "Upload your files and get a permanent URL. No account needed.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main style={{ minHeight: 'calc(100vh - 64px)' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
