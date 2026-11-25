import { MotionConfig } from 'motion/react';
import { AboutSection } from './components/AboutSection';
import { BackToTopButton } from './components/BackToTopButton';
import { ContactSection } from './components/ContactSection';
import { FeaturesSection } from './components/FeaturesSection';
import { Footer } from './components/Footer';
import { GallerySection } from './components/GallerySection';
import { HeroSection } from './components/HeroSection';
import { MenuSection } from './components/MenuSection';
import { Navbar } from './components/Navbar';
import { SwotSection } from './components/SwotSection';
import { TargetMarketSection } from './components/TargetMarketSection';

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#FAF6F0] text-[#24150E]">
        <Navbar />
        <main>
          <HeroSection />
          <AboutSection />
          <MenuSection />
          <FeaturesSection />
          <GallerySection />
          <SwotSection />
          <TargetMarketSection />
          <ContactSection />
        </main>
        <Footer />
        <BackToTopButton />
      </div>
    </MotionConfig>
  );
}
