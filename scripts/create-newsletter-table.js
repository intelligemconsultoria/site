// Script para criar a tabela newsletter_subscribers no Supabase
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Precisa da service role key

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ VITE_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórios');
  console.log('💡 Adicione SUPABASE_SERVICE_ROLE_KEY ao arquivo .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createNewsletterTable() {
  try {
    console.log('🚀 Criando tabela newsletter_subscribers...');

    // SQL para criar a tabela
    const createTableSQL = `
      -- Criar tabela newsletter_subscribers
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Criar índices
      CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);
      CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_active ON newsletter_subscribers(active);

      -- Habilitar RLS
      ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

      -- Políticas de segurança
      CREATE POLICY "Allow public subscription" ON newsletter_subscribers
        FOR INSERT WITH CHECK (true);

      CREATE POLICY "Allow authenticated read" ON newsletter_subscribers
        FOR SELECT USING (auth.role() = 'authenticated');

      CREATE POLICY "Allow authenticated update" ON newsletter_subscribers
        FOR UPDATE USING (auth.role() = 'authenticated');

      -- Função para updated_at
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$ language 'plpgsql';

      -- Trigger para updated_at
      CREATE TRIGGER update_newsletter_subscribers_updated_at 
        BEFORE UPDATE ON newsletter_subscribers 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `;

    // Executar SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql: createTableSQL });
    
    if (error) {
      console.error('❌ Erro ao criar tabela:', error);
      return;
    }

    console.log('✅ Tabela newsletter_subscribers criada com sucesso!');

    // Inserir dados de exemplo
    console.log('📝 Inserindo dados de exemplo...');
    
    const { data: insertData, error: insertError } = await supabase
      .from('newsletter_subscribers')
      .upsert([
        { email: 'exemplo@intelligem.com.br', active: true },
        { email: 'teste@intelligem.com.br', active: true }
      ], { 
        onConflict: 'email',
        ignoreDuplicates: true 
      });

    if (insertError) {
      console.log('⚠️ Erro ao inserir dados de exemplo:', insertError.message);
    } else {
      console.log('✅ Dados de exemplo inseridos!');
    }

    // Verificar se a tabela foi criada
    const { data: checkData, error: checkError } = await supabase
      .from('newsletter_subscribers')
      .select('count', { count: 'exact', head: true });

    if (checkError) {
      console.error('❌ Erro ao verificar tabela:', checkError);
    } else {
      console.log(`📊 Tabela criada! Total de subscribers: ${checkData}`);
    }

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Executar
createNewsletterTable();
