import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "@techfrens Coding LLM Benchmarks",
  description: "Unofficial Aider Polyglot Benchmarks for various LLM models",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  openGraph: {
    title: "@techfrens Coding LLM Benchmarks",
    description: "Unofficial Aider Polyglot Benchmarks for various LLM models",
    images: ["/og-image.jpg"],  // Assuming an image in public/; adjust if needed
    url: "https://techfrens.com",  // Use the actual site URL
    siteName: "@techfrens",
  },
  twitter: {
    card: "summary_large_image",
    title: "@techfrens Coding LLM Benchmarks",
    description: "Unofficial Aider Polyglot Benchmarks for various LLM models",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
