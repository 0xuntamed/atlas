import type { Metadata } from "next";
import Link from "next/link";
import { AuthProvider, HeaderAuth } from "@/components/auth";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "ATLAS — Your personal map of the world",
  description:
    "Plan journeys, collect places, and preserve everywhere you've been.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <html lang="en">
        <body>
          <Providers>
            <header className="flex items-center justify-between border-b border-ink/10 px-6 py-4">
              <Link href="/" className="text-lg font-semibold tracking-tight">
                ATLAS
              </Link>
              <nav className="flex items-center gap-4 text-sm">
                <HeaderAuth />
              </nav>
            </header>
            <main className="mx-auto max-w-3xl px-6 py-10">{children}</main>
          </Providers>
        </body>
      </html>
    </AuthProvider>
  );
}
