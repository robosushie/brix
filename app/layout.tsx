import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ReactQueryProvider } from "@/contexts/react-query-provider";
import "./globals.css";

const display = Inter({
  weight: "300",
  subsets: ["latin"],
  variable: "--font-display-face",
});

const sans = Inter({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-sans-face",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Brix",
  description: "Pick a stack. Copy one command. Let an agent build the repo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-eggshell font-sans text-ink antialiased">
        <ThemeProvider>
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
