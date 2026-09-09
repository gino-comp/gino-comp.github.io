import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";

export default function Footer({ locale }: { locale: Locale }) {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Image src="/brand/ridm-logo.png" alt="RiDM" width={92} height={92} />
          <div>
            <strong>RiDM Technology</strong>
            <small>Programmable Near-Sensor Computing</small>
          </div>
        </div>
        <div className="footer-links">
          <Link href={`/${locale}/about`}>About</Link>
          <Link href={`/${locale}/technology`}>DODA</Link>
          <Link href={`/${locale}/applications`}>Applications</Link>
          <Link href={`/${locale}/research`}>Research</Link>
        </div>
        <div className="footer-meta">© 2026 RiDM Technology.</div>
      </div>
    </footer>
  );
}
