import { useTheme } from "../hooks/useTheme";
import { Button } from "./ui/button";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="w-9 h-9 p-0 relative group"
      aria-label={`Alternar para tema ${theme === 'dark' ? 'claro' : 'escuro'}`}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Sol - visível no tema escuro */}
        <Sun 
          className={`absolute w-4 h-4 transition-all duration-300 ${
            theme === 'dark' 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 rotate-90 scale-0'
          } text-yellow-400 group-hover:text-yellow-300`}
        />
        
        {/* Lua - visível no tema claro */}
        <Moon 
          className={`absolute w-4 h-4 transition-all duration-300 ${
            theme === 'light' 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 -rotate-90 scale-0'
          } text-slate-600 group-hover:text-slate-700`}
        />
      </div>
      
      {/* Efeito de brilho sutil */}
      <div className={`absolute inset-0 rounded-md transition-all duration-300 ${
        theme === 'dark'
          ? 'group-hover:bg-yellow-400/10 group-hover:shadow-lg group-hover:shadow-yellow-400/20'
          : 'group-hover:bg-slate-100/80'
      }`} />
    </Button>
  );
}