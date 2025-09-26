import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";
import intelligemLogo from "figma:asset/6b92ef4371fead8d661263f615c56e4cb4e3ce7f.png";

interface HeaderProps {
  onNavigateToAdmin?: () => void;
}

export function Header({ onNavigateToAdmin }: HeaderProps = {}) {
  return (
    <header className="fixed top-0 w-full z-50 bg-background/90 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img 
            src={intelligemLogo} 
            alt="IntelliGem" 
            className="w-10 h-10"
          />
          <span className="text-foreground font-semibold text-xl">IntelliGem</span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#sobre" className="text-foreground/80 hover:text-foreground transition-colors">
            Sobre
          </a>
          <a href="#solucoes" className="text-foreground/80 hover:text-foreground transition-colors">
            Soluções
          </a>
          <a href="#cases" className="text-foreground/80 hover:text-foreground transition-colors">
            Cases
          </a>
          <a href="#blog" className="text-foreground/80 hover:text-foreground transition-colors">
            Blog
          </a>
          <a href="#contato" className="text-foreground/80 hover:text-foreground transition-colors">
            Contato
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button className="bg-gradient-to-r from-emerald-400 to-blue-500 hover:from-emerald-500 hover:to-blue-600 text-white border-0 shadow-lg shadow-emerald-400/25 hover:shadow-emerald-400/40 transition-all">
            Agendar Conversa
          </Button>
        </div>
      </div>
    </header>
  );
}