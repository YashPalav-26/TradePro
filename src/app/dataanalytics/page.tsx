import HeroSection from "@/components/HeroSection";
import Header from "@/components/Header";

export default function Page() {
  return (
    <div className="bg-gradient-to-br from-background via-background to-background/95 min-h-screen">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <HeroSection />
      </main>
    </div>
  );
}