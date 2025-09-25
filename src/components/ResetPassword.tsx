import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { authService } from '../services/authService';

interface ResetPasswordProps {
  onBack: () => void;
}

export function ResetPassword({ onBack }: ResetPasswordProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [hasValidToken, setHasValidToken] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);

  useEffect(() => {
    // Verificar se há token de reset válido na URL
    const urlParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = urlParams.get('access_token') || hashParams.get('access_token');
    const refreshToken = urlParams.get('refresh_token') || hashParams.get('refresh_token');
    
    if (accessToken && refreshToken) {
      // Verificar se o token é válido
      validateResetToken(accessToken, refreshToken);
    } else {
      setTokenError('Link de recuperação inválido ou expirado');
    }
  }, []);

  const validateResetToken = async (accessToken: string, refreshToken: string) => {
    try {
      // Importar o cliente Supabase
      const { createClient } = await import('@supabase/supabase-js');
      
      const supabaseUrl = 'https://abfowubusomlibuihqrz.supabase.co';
      const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiZm93dWJ1c29tbGlidWlocXJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4MDc3NDIsImV4cCI6MjA3NDM4Mzc0Mn0.-m8263Lv_RYqJhuaiy_VXP727h_KbucuNl1RMG2-ITk';
      
      const supabase = createClient(supabaseUrl, supabaseAnonKey);

      // Tentar usar o token para verificar se é válido
      const { data, error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      });

      if (error || !data.session) {
        setTokenError('Link de recuperação inválido ou expirado');
      } else {
        setHasValidToken(true);
        // Salvar tokens temporariamente (como strings JSON)
        localStorage.setItem('sb-access-token', JSON.stringify(accessToken));
        localStorage.setItem('sb-refresh-token', JSON.stringify(refreshToken));
      }
    } catch (error) {
      console.error('Erro ao validar token:', error);
      setTokenError('Erro ao validar link de recuperação');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password.trim() || !confirmPassword.trim()) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      // Importar o cliente Supabase diretamente
      const { createClient } = await import('@supabase/supabase-js');
      
      const supabaseUrl = 'https://abfowubusomlibuihqrz.supabase.co';
      const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiZm93dWJ1c29tbGlidWlocXJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4MDc3NDIsImV4cCI6MjA3NDM4Mzc0Mn0.-m8263Lv_RYqJhuaiy_VXP727h_KbucuNl1RMG2-ITk';
      
      const supabase = createClient(supabaseUrl, supabaseAnonKey);

      // Usar o cliente Supabase para atualizar senha
      const { data, error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        console.error('Erro ao atualizar senha:', error);
        toast.error('Erro ao atualizar senha: ' + error.message);
      } else {
        setSuccess(true);
        toast.success('Senha atualizada com sucesso!');
        
        // Limpar tokens temporários
        localStorage.removeItem('sb-access-token');
        localStorage.removeItem('sb-refresh-token');
      }
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast.error('Erro inesperado. Tente novamente.');
    }
    
    setLoading(false);
  };

  // Tela de erro para token inválido
  if (tokenError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-6">
        <div className="relative z-10 w-full max-w-md">
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 shadow-2xl">
            <CardContent className="p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
                <Lock className="w-8 h-8 text-red-400" />
              </div>
              
              <h1 className="text-2xl font-bold text-white mb-4">
                Acesso Negado
              </h1>
              
              <p className="text-white/70 mb-6">
                {tokenError}. Esta página só pode ser acessada através de um link de recuperação válido.
              </p>
              
              <div className="space-y-3">
                <Button
                  onClick={() => window.location.href = '/admin'}
                  className="w-full bg-gradient-to-r from-emerald-400 to-blue-500 text-white hover:from-emerald-500 hover:to-blue-600"
                >
                  Ir para Login
                </Button>
                
                <Button
                  onClick={() => window.location.href = '/'}
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10"
                >
                  Voltar ao Início
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Tela de carregamento enquanto valida o token
  if (!hasValidToken && !tokenError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-6">
        <div className="relative z-10 w-full max-w-md">
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 shadow-2xl">
            <CardContent className="p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-6">
                <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
              
              <h1 className="text-2xl font-bold text-white mb-4">
                Validando Link...
              </h1>
              
              <p className="text-white/70">
                Verificando se o link de recuperação é válido...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-6">
        <div className="relative z-10 w-full max-w-md">
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 shadow-2xl">
            <CardContent className="p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              
              <h1 className="text-2xl font-bold text-white mb-4">
                Senha Atualizada!
              </h1>
              
              <p className="text-white/70 mb-6">
                Sua senha foi atualizada com sucesso. Agora você pode fazer login no painel administrativo.
              </p>
              
              <Button
                onClick={() => window.location.href = '/admin'}
                className="w-full bg-gradient-to-r from-emerald-400 to-blue-500 text-white hover:from-emerald-500 hover:to-blue-600"
              >
                Ir para Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_50%)]"></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-400/25">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Redefinir Senha</h1>
          <p className="text-white/60 text-sm leading-relaxed">
            Digite sua nova senha para acessar o painel administrativo
          </p>
        </div>

        {/* Form */}
        <Card className="bg-white/5 backdrop-blur-sm border-white/10 shadow-2xl">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white font-medium">
                  Nova Senha
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pr-12 h-12 text-lg focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all"
                    placeholder="Digite sua nova senha..."
                    required
                    autoFocus
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white font-medium">
                  Confirmar Nova Senha
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pr-12 h-12 text-lg focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all"
                    placeholder="Confirme sua nova senha..."
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </Button>
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  className="flex-1 h-12 border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={loading || !password.trim() || !confirmPassword.trim()}
                  className="flex-1 h-12 bg-gradient-to-r from-emerald-400 to-blue-500 text-white hover:from-emerald-500 hover:to-blue-600 shadow-lg shadow-emerald-400/25 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Atualizando...
                    </div>
                  ) : (
                    'Atualizar Senha'
                  )}
                </Button>
              </div>
            </form>

            {/* Security Notice */}
            <div className="mt-8 p-4 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border border-blue-400/20 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 text-blue-400 mt-0.5">ℹ️</div>
                <p className="text-blue-400 text-sm leading-relaxed">
                  <strong>Segurança:</strong> Sua nova senha deve ter pelo menos 6 caracteres e será usada para acessar o painel administrativo.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-white/40 text-xs">
            IntelliGem © 2025 - Sistema de Redefinição de Senha
          </p>
        </div>
      </div>
    </div>
  );
}
