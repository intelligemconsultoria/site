import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://abfowubusomlibuihqrz.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiZm93dWJ1c29tbGlidWlocXJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4MDc3NDIsImV4cCI6MjA3NDM4Mzc0Mn0.-m8263Lv_RYqJhuaiy_VXP727h_KbucuNl1RMG2-ITk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface AuthUser {
  id: string;
  email: string;
  role?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

class AuthService {
  // Fazer login com email e senha
  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return {
          success: false,
          error: this.getErrorMessage(error.message)
        };
      }

      if (data.user) {
        // Verificar se o usuário tem permissão de admin
        const isAdmin = await this.checkAdminPermission(data.user.email);
        
        if (!isAdmin) {
          await this.signOut(); // Deslogar se não for admin
          return {
            success: false,
            error: 'Acesso negado. Apenas administradores podem acessar esta área.'
          };
        }

        // Salvar sessão no localStorage para persistência
        this.saveSessionToStorage({
          id: data.user.id,
          email: data.user.email || '',
          role: 'admin'
        });
        
        // Forçar atualização da sessão no Supabase
        await supabase.auth.getSession();

        return {
          success: true,
          user: {
            id: data.user.id,
            email: data.user.email || '',
            role: 'admin'
          }
        };
      }

      return {
        success: false,
        error: 'Erro desconhecido durante o login'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Erro de conexão. Tente novamente.'
      };
    }
  }

  // Fazer logout
  async signOut(): Promise<void> {
    await supabase.auth.signOut();
    this.clearSessionFromStorage();
  }

  // Verificar se o usuário está autenticado
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const isAdmin = await this.checkAdminPermission(user.email);
        
        if (isAdmin) {
          return {
            id: user.id,
            email: user.email || '',
            role: 'admin'
          };
        }
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }

  // Verificar permissão de admin
  private async checkAdminPermission(email: string | undefined): Promise<boolean> {
    if (!email) return false;
    
    // Lista de emails autorizados (em produção, isso viria de uma tabela no banco)
    const adminEmails = [
      'intelligemconsultoria@gmail.com',
      'admin@intelligem.com',
      'gil@intelligem.com',
      'contato@intelligem.com'
    ];
    
    return adminEmails.includes(email.toLowerCase());
  }

  // Converter mensagens de erro do Supabase para português
  private getErrorMessage(error: string): string {
    const errorMessages: { [key: string]: string } = {
      'Invalid login credentials': 'Email ou senha incorretos',
      'Email not confirmed': 'Email não confirmado',
      'Too many requests': 'Muitas tentativas. Tente novamente em alguns minutos',
      'User not found': 'Usuário não encontrado',
      'Invalid email': 'Email inválido',
      'Password should be at least 6 characters': 'Senha deve ter pelo menos 6 caracteres'
    };

    return errorMessages[error] || 'Erro durante o login. Tente novamente.';
  }

  // Criar usuário admin (apenas para desenvolvimento)
  async createAdminUser(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin`
        }
      });

      if (error) {
        return {
          success: false,
          error: this.getErrorMessage(error.message)
        };
      }

      return {
        success: true,
        user: data.user ? {
          id: data.user.id,
          email: data.user.email || '',
          role: 'admin'
        } : undefined
      };
    } catch (error) {
      return {
        success: false,
        error: 'Erro ao criar usuário. Tente novamente.'
      };
    }
  }

  // Verificar se há sessão ativa
  async checkSession(): Promise<boolean> {
    try {
      console.log('🔍 [AUTH] Iniciando verificação de sessão...');
      
      // Sempre verifica primeiro no Supabase para garantir que a sessão está ativa
      console.log('🌐 [AUTH] Verificando sessão no Supabase...');
      const { data: { session } } = await supabase.auth.getSession();
      console.log('📊 [AUTH] Sessão do Supabase:', { 
        hasSession: !!session, 
        hasUser: !!(session?.user),
        userId: session?.user?.id,
        userEmail: session?.user?.email
      });
      
      if (session?.user) {
        console.log('👤 [AUTH] Usuário encontrado no Supabase');
        const isAdmin = await this.checkAdminPermission(session.user.email);
        console.log('🔐 [AUTH] É admin?', isAdmin);
        
        if (isAdmin) {
          console.log('✅ [AUTH] Usuário admin válido - salvando sessão');
          // Salva a sessão válida no localStorage para persistência
          this.saveSessionToStorage({
            id: session.user.id,
            email: session.user.email || '',
            role: 'admin'
          });
          return true;
        } else {
          console.log('❌ [AUTH] Usuário não tem permissão de admin');
        }
      } else {
        console.log('❌ [AUTH] Nenhuma sessão ativa no Supabase');
      }
      
      // Se não há sessão válida no Supabase, verifica se há sessão salva localmente
      console.log('📦 [AUTH] Verificando sessão salva localmente...');
      const savedSession = this.getSessionFromStorage();
      console.log('📊 [AUTH] Sessão local:', savedSession ? 'ENCONTRADA' : 'NÃO ENCONTRADA');
      
      if (savedSession) {
        console.log('📋 [AUTH] Detalhes da sessão local:', {
          hasUser: !!savedSession.user,
          timestamp: savedSession.timestamp,
          expiresAt: savedSession.expiresAt,
          isExpired: Date.now() >= savedSession.expiresAt,
          timeUntilExpiry: savedSession.expiresAt - Date.now()
        });
      }
      
      if (savedSession && this.isSessionValid(savedSession)) {
        console.log('🔄 [AUTH] Sessão local válida - tentando renovar no Supabase...');
        // Tenta renovar a sessão do Supabase
        try {
          const { data: { session: renewedSession } } = await supabase.auth.refreshSession();
          console.log('🔄 [AUTH] Resultado da renovação:', { 
            hasSession: !!renewedSession, 
            hasUser: !!(renewedSession?.user) 
          });
          
          if (renewedSession?.user) {
            const isAdmin = await this.checkAdminPermission(renewedSession.user.email);
            console.log('🔐 [AUTH] Usuário renovado é admin?', isAdmin);
            
            if (isAdmin) {
              console.log('✅ [AUTH] Sessão renovada com sucesso - atualizando localStorage');
              // Atualiza a sessão salva
              this.saveSessionToStorage({
                id: renewedSession.user.id,
                email: renewedSession.user.email || '',
                role: 'admin'
              });
              return true;
            } else {
              console.log('❌ [AUTH] Usuário renovado não tem permissão de admin');
            }
          } else {
            console.log('❌ [AUTH] Falha na renovação - nenhum usuário retornado');
          }
        } catch (refreshError) {
          console.error('❌ [AUTH] Erro ao renovar sessão:', refreshError);
        }
      } else {
        console.log('❌ [AUTH] Sessão local inválida ou expirada');
      }
      
      // Se não há sessão válida, limpa o localStorage
      console.log('🧹 [AUTH] Limpando sessão inválida');
      this.clearSessionFromStorage();
      return false;
    } catch (error) {
      console.error('❌ [AUTH] Erro ao verificar sessão:', error);
      this.clearSessionFromStorage();
      return false;
    }
  }

  // Salvar sessão no localStorage
  private saveSessionToStorage(user: AuthUser): void {
    console.log('💾 [STORAGE] Salvando sessão no localStorage...');
    const sessionData = {
      user,
      timestamp: Date.now(),
      expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 dias
    };
    
    console.log('📊 [STORAGE] Dados da sessão:', {
      userId: sessionData.user.id,
      userEmail: sessionData.user.email,
      timestamp: sessionData.timestamp,
      expiresAt: sessionData.expiresAt,
      expiresIn: sessionData.expiresAt - Date.now()
    });
    
    // Limpar dados antigos que podem causar conflito
    this.clearOldStorageData();
    
    try {
      localStorage.setItem('admin_session', JSON.stringify(sessionData));
      console.log('✅ [STORAGE] Sessão salva com sucesso no localStorage');
    } catch (error) {
      console.error('❌ [STORAGE] Erro ao salvar sessão no localStorage:', error);
    }
  }
  
  // Limpar dados antigos do localStorage que podem causar conflito
  private clearOldStorageData(): void {
    try {
      // Limpar dados antigos do admin
      localStorage.removeItem('admin_authenticated');
      localStorage.removeItem('admin_auth_time');
      localStorage.removeItem('admin_user_email');
      
      // Limpar tokens antigos do Supabase
      localStorage.removeItem('sb-access-token');
      localStorage.removeItem('sb-refresh-token');
      
      console.log('🧹 Dados antigos do localStorage limpos');
    } catch (error) {
      console.error('❌ Erro ao limpar dados antigos:', error);
    }
  }

  // Recuperar sessão do localStorage
  private getSessionFromStorage(): { user: AuthUser; timestamp: number; expiresAt: number } | null {
    try {
      console.log('📦 [STORAGE] Tentando recuperar sessão do localStorage...');
      const sessionData = localStorage.getItem('admin_session');
      console.log('📄 [STORAGE] Dados brutos:', sessionData ? 'ENCONTRADOS' : 'NÃO ENCONTRADOS');
      
      if (sessionData && typeof sessionData === 'string') {
        console.log('🔍 [STORAGE] Fazendo parse dos dados...');
        const parsed = JSON.parse(sessionData);
        console.log('✅ [STORAGE] Sessão recuperada com sucesso:', {
          hasUser: !!parsed.user,
          timestamp: parsed.timestamp,
          expiresAt: parsed.expiresAt,
          isExpired: Date.now() >= parsed.expiresAt
        });
        return parsed;
      } else {
        console.log('❌ [STORAGE] Dados não encontrados ou não são string');
      }
    } catch (error) {
      console.error('❌ [STORAGE] Erro ao recuperar sessão do localStorage:', error);
      console.log('📄 [STORAGE] Dados corrompidos:', localStorage.getItem('admin_session'));
      // Limpar dados corrompidos
      localStorage.removeItem('admin_session');
      console.log('🧹 [STORAGE] Dados corrompidos removidos');
    }
    return null;
  }

  // Verificar se a sessão é válida
  private isSessionValid(session: { user: AuthUser; timestamp: number; expiresAt: number }): boolean {
    return Date.now() < session.expiresAt;
  }

  // Limpar sessão do localStorage
  private clearSessionFromStorage(): void {
    localStorage.removeItem('admin_session');
  }
  
  // Limpar todos os dados relacionados ao admin (para resolver conflitos)
  public clearAllAdminData(): void {
    try {
      this.clearOldStorageData();
      this.clearSessionFromStorage();
      
      // Limpeza mais agressiva para resolver conflitos com extensões
      this.clearSupabaseData();
      
      console.log('🧹 Todos os dados do admin limpos');
    } catch (error) {
      console.error('❌ Erro ao limpar dados do admin:', error);
    }
  }
  
  // Limpar dados específicos do Supabase que podem causar conflito
  private clearSupabaseData(): void {
    try {
      // NÃO limpar dados do Supabase (sb-*) pois são necessários para manter a sessão
      console.log('⚠️ [STORAGE] Pulando limpeza de dados do Supabase para manter sessão');
      
      // Limpar apenas dados que podem estar corrompidos (não relacionados ao Supabase)
      const allKeys = Object.keys(localStorage);
      allKeys.forEach(key => {
        // Pular chaves do Supabase
        if (key.startsWith('sb-')) {
          return;
        }
        
        try {
          const value = localStorage.getItem(key);
          if (value && value.includes('[object Object]')) {
            localStorage.removeItem(key);
            console.log('🗑️ Removido dado corrompido:', key);
          }
        } catch (error) {
          // Se não conseguir ler, remove (mas não chaves do Supabase)
          if (!key.startsWith('sb-')) {
            localStorage.removeItem(key);
            console.log('🗑️ Removido dado inválido:', key);
          }
        }
      });
      
    } catch (error) {
      console.error('❌ Erro ao limpar dados corrompidos:', error);
    }
  }
}

export const authService = new AuthService();
