import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SUST CSE 23/24 Academic Portal | Shahjalal University of Science & Technology",
  description: "Academic & Student Management System for Department of CSE, SUST (2023-2024 Session, 4th Semester)",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full">
      <body className="min-h-screen bg-[#090d16] text-slate-100 antialiased selection:bg-cyan-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
