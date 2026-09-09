import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AboutIntro, { MilestonesSection, OriginSection, TeamSection } from "@/components/About";
import { getDictionary, isLocale } from "@/lib/i18n";
import { makeMetadata } from "@/lib/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? makeMetadata(locale, "about", "About Us") : {};
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  return (
    <div className="subpage">
      <AboutIntro dict={dict} />
      <OriginSection dict={dict} />
      <TeamSection dict={dict} />
      <MilestonesSection dict={dict} />
    </div>
  );
}
