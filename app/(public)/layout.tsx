import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { FestivalBackground } from "@/components/Background";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FestivalBackground />
      <NavBar />
      <main className="flex-1 relative">{children}</main>
      <Footer />
    </>
  );
}
