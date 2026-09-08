import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "RiDM Technology",
  description: "Programmable Near-Sensor Computing"
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const headerStore = await headers();
  const locale = headerStore.get("x-ridm-locale") === "en" ? "en" : "ko";
  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  );
}
