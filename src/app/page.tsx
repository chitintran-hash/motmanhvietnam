import Hero from "@/components/sections/Hero";
import AboutTeaser from "@/components/sections/AboutTeaser";
import CollectionPreview from "@/components/sections/CollectionPreview";
import TeamSection from "@/components/sections/TeamSection";

export const revalidate = 0;

export default function Home() {
  return (
    <>
      <Hero />
      <AboutTeaser />
      <CollectionPreview />
      <TeamSection />
    </>
  );
}
