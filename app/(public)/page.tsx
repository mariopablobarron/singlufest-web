import { HeroV2 } from "@/components/v2/Hero";
import { MarqueeV2 } from "@/components/v2/Marquee";
import { ManifestoV2 } from "@/components/v2/Manifesto";
import { CartelV2 } from "@/components/v2/Cartel";
import { TicketsV2 } from "@/components/v2/Tickets";
import { ProtocolV2 } from "@/components/v2/Protocol";
import { AftermovieV2 } from "@/components/v2/Aftermovie";
import { SocialWallV2 } from "@/components/v2/SocialWall";
import { PartnersBannerV2 } from "@/components/v2/PartnersBanner";
import { FaqV2 } from "@/components/v2/Faq";
import { FinalCtaV2 } from "@/components/v2/FinalCta";
import { prisma } from "@/lib/db";

async function loadHomeData() {
  try {
    const settings = await prisma.siteSettings.findFirst();
    return { bookingsOpen: settings?.bookingsOpen ?? false };
  } catch {
    return { bookingsOpen: false };
  }
}

export default async function HomePage() {
  const { bookingsOpen } = await loadHomeData();

  return (
    <>
      <HeroV2 bookingsOpen={bookingsOpen} ticketsLeft={312} generalPrice={18} />
      <MarqueeV2 />
      <ManifestoV2 />
      <div id="cartel" />
      <CartelV2 />
      <TicketsV2 />
      <ProtocolV2 />
      <AftermovieV2 />
      <SocialWallV2 />
      <PartnersBannerV2 />
      <FaqV2 />
      <FinalCtaV2 bookingsOpen={bookingsOpen} ticketsLeft={312} generalPrice={18} />
    </>
  );
}
