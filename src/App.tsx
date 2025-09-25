import { useState } from "react";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { AboutSection } from "./components/AboutSection";
import { SolutionsSection } from "./components/SolutionsSection";
import { CasesSection } from "./components/CasesSection";
import { BlogSection } from "./components/BlogSection";
import { CTASection } from "./components/CTASection";
import { Footer } from "./components/Footer";
import { BlogPage } from "./components/BlogPage";
import { BlogAdmin } from "./components/BlogAdmin";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'blog' | 'admin'>('home');

  const navigateToBlog = () => setCurrentPage('blog');
  const navigateToHome = () => setCurrentPage('home');
  const navigateToAdmin = () => setCurrentPage('admin');

  if (currentPage === 'blog') {
    return (
      <>
        <BlogPage onBack={navigateToHome} />
        <Toaster />
      </>
    );
  }

  if (currentPage === 'admin') {
    return (
      <>
        <BlogAdmin onBack={navigateToHome} />
        <Toaster />
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-black">
        <Header onNavigateToAdmin={navigateToAdmin} />
        <HeroSection />
        <AboutSection />
        <SolutionsSection />
        <CasesSection />
        <BlogSection onNavigateToBlog={navigateToBlog} />
        <CTASection />
        <Footer />
      </div>
      <Toaster />
    </>
  );
}