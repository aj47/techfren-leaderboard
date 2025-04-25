import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "@techfrens Coding LLM Benchmarks",
  description: "Unofficial Aider Polyglot Benchmarks for various LLM models",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
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
