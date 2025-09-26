import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Lock, Eye, EyeOff, Mail } from "lucide-react";
import { toast } from "sonner";
import { authService } from "../services/authService";
import { ThemeToggle } from "./ThemeToggle";

interface AdminLoginProps {
  onLogin: () => void;
  onCancel: () => void;
}

export function AdminLogin({ onLogin, onCancel }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.signIn(email, password);
      
      if (response.success) {
        // Salvar autenticação no localStorage
        localStorage.setItem('admin_authenticated', 'true');
        localStorage.setItem('admin_auth_time', Date.now().toString());
        localStorage.setItem('admin_user_email', email);
        
        toast.success('Acesso autorizado!');
        onLogin();
      } else {
        toast.error(response.error || 'Erro durante o login');
      }
    } catch (error) {
      toast.error('Erro de conexão. Tente novamente.');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-black dark:to-gray-900 flex items-center justify-center p-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_50%)]"></div>
      
      <div className="relative z-10 w-full max-w-md">
        {/* Theme Toggle */}
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-400/25">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Acesso Administrativo</h1>
          <p className="text-gray-600 dark:text-white/60 text-sm leading-relaxed">
            Digite a senha para acessar o painel de administração do blog IntelliGem
          </p>
        </div>

        {/* Login Form */}
        <Card className="bg-white dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 shadow-2xl">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-900 dark:text-white font-medium">
                  Email de Administração
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-white/50 pl-12 h-12 text-lg focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all"
                    placeholder="admin@intelligem.com.br"
                    required
                    autoFocus
                  />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-white/50" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-900 dark:text-white font-medium">
                  Senha
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-white/50 pr-12 h-12 text-lg focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all"
                    placeholder="Digite sua senha..."
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/50 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </Button>
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="flex-1 h-12 border border-gray-300 dark:border-white/20 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 hover:border-gray-400 dark:hover:border-white/30 transition-all"
                >
                  Cancelar
                </Button>
                    <Button
                      type="submit"
                      disabled={loading || !email.trim() || !password.trim()}
                      className="flex-1 h-12 bg-gradient-to-r from-emerald-400 to-blue-500 text-white hover:from-emerald-500 hover:to-blue-600 shadow-lg shadow-emerald-400/25 transition-all disabled:opacity-50"
                    >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Verificando...
                    </div>
                  ) : (
                    'Acessar'
                  )}
                </Button>
              </div>
            </form>

            {/* Security Notice */}
            <div className="mt-12 p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-400/20 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 text-amber-400 mt-0.5">⚠️</div>
                <p className="text-amber-400 text-sm leading-relaxed">
                  <strong>Área Restrita:</strong> Apenas administradores autorizados devem ter acesso a esta seção.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-white/40 text-xs">
            IntelliGem © 2025 - Sistema de Administração
          </p>
        </div>
      </div>
    </div>
  );
}
