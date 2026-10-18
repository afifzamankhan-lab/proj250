import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SUST CSE Portal | Shahjalal University of Science & Technology",
  description: "Student Academic Portal for Department of Computer Science & Engineering, SUST — Batch 2023–2024",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-white text-gray-900 antialiased font-inter">
        {children}
      </body>
    </html>
  );
}
