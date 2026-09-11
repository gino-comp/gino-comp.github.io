"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { Locale } from "@/lib/i18n";

const navItems = [
  ["about", "About"],
  ["technology", "Technology"],
  ["news", "What’s New"],
] as const;

export default function Header({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const otherLocale: Locale = locale === "ko" ? "en" : "ko";
  const otherPath = pathname.replace(/^\/(ko|en)(?=\/|$)/, `/${otherLocale}`);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href={`/${locale}`} className="brand" aria-label="RiDM Technology home">
          <Image src="/brand/ridm-logo.png" alt="RiDM" width={86} height={86} priority />
          <span>
            <strong>RiDM Technology</strong>
            <small>Programmable Near-Sensor Computing</small>
          </span>
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map(([path, label]) => (
            <Link key={path} href={`/${locale}/${path}`}>
              {label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <Link className="contact-link" href={`/${locale}/contact`}>
            Contact
          </Link>
          <Link className="locale-link" href={otherPath} aria-label={`Switch to ${otherLocale.toUpperCase()}`}>
            {otherLocale.toUpperCase()}
          </Link>
          <button
            className="menu-button"
            aria-label={locale === "ko" ? "메뉴 열기" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen((value) => !value)}
          >
            <span />
          </button>
        </div>
      </div>

      <nav id="mobile-navigation" className={`mobile-nav ${open ? "open" : ""}`} aria-label="Mobile navigation">
        {navItems.map(([path, label]) => (
          <Link key={path} href={`/${locale}/${path}`} onClick={() => setOpen(false)}>
            {label}
          </Link>
        ))}
        <Link href={`/${locale}/contact`} onClick={() => setOpen(false)}>
          Contact
        </Link>
        <Link href={otherPath} onClick={() => setOpen(false)}>
          {otherLocale.toUpperCase()}
        </Link>
      </nav>
    </header>
  );
}
