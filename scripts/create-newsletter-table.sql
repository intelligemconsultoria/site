-- Criar tabela newsletter_subscribers no Supabase
-- Execute este SQL no SQL Editor do Supabase Dashboard

-- Criar tabela newsletter_subscribers
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índice para busca rápida por email
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);

-- Criar índice para busca por status ativo
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_active ON newsletter_subscribers(active);

-- Habilitar Row Level Security (RLS)
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção de novos subscribers (qualquer um pode se inscrever)
CREATE POLICY "Allow public subscription" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

-- Política para permitir leitura apenas para usuários autenticados
CREATE POLICY "Allow authenticated read" ON newsletter_subscribers
  FOR SELECT USING (auth.role() = 'authenticated');

-- Política para permitir atualização apenas para usuários autenticados
CREATE POLICY "Allow authenticated update" ON newsletter_subscribers
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_newsletter_subscribers_updated_at 
  BEFORE UPDATE ON newsletter_subscribers 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Inserir alguns dados de exemplo (opcional)
INSERT INTO newsletter_subscribers (email, active) VALUES 
  ('exemplo@intelligem.com.br', true),
  ('teste@intelligem.com.br', true)
ON CONFLICT (email) DO NOTHING;
