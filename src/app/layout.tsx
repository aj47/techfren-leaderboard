import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "@techfrens Coding LLM Benchmarks",
  description: "Unofficial Aider Polyglot Benchmarks for various LLM models",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
