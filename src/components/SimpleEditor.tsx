import React, { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Label } from './ui/label'
import { Separator } from './ui/separator'
import { Save, Globe, Clock, X } from 'lucide-react'
import { BlogArticle, blogService } from '../services/blogService'
import { toast } from 'sonner'

interface Props {
  article?: BlogArticle | null
  onSave: (article: Partial<BlogArticle>, isPublish?: boolean) => Promise<BlogArticle | void>
  onCancel: () => void
}

export function SimpleEditor({ article, onSave, onCancel }: Props) {
  const [title, setTitle] = useState(article?.title || '')
  const [subtitle, setSubtitle] = useState(article?.excerpt || '')
  const [author, setAuthor] = useState(article?.author || '')
  const [category, setCategory] = useState(article?.category || '')
  const [tags, setTags] = useState<string[]>(Array.isArray(article?.tags) ? (article!.tags as string[]) : [])
  const [content, setContent] = useState(article?.content || '')
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<Date | null>(null)

  const saveArticle = async () => {
    setSaving(true)
    try {
      const articleData = {
        id: article?.id,
        title: title.trim(),
        excerpt: subtitle.trim(),
        author: author.trim(),
        category: category.trim(),
        tags,
        content: content.trim(),
        slug: title ? slugify(title) : '',
        date: article?.date || new Date().toISOString(),
        created_at: article?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        published: false,
        read_time: article?.read_time || '1 min',
        featured: article?.featured || false
      }
      
      let result: BlogArticle;
      if (articleData.id) {
        result = await blogService.updateArticle(articleData.id, articleData) as BlogArticle;
      } else {
        result = await blogService.createArticle(articleData);
      }
      
      setSavedAt(new Date());
      toast.success('Artigo salvo!')
    } catch (err) {
      console.error('❌ Erro ao salvar:', err);
      toast.error('Erro ao salvar artigo')
    } finally {
      setSaving(false)
    }
  }

  const publish = async () => {
    if (!title.trim()) {
      toast.error('Título é obrigatório para publicar')
      return
    }
    if (!content.trim()) {
      toast.error('Conteúdo é obrigatório para publicar')
      return
    }

    try {
      const articleData = {
        id: article?.id,
        title, 
        excerpt: subtitle, 
        author, 
        category, 
        tags, 
        content,
        slug: title ? slugify(title) : '',
        date: article?.date || new Date().toISOString(),
        created_at: article?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        published: true,
        read_time: article?.read_time || '1 min',
        featured: article?.featured || false
      }
      
      let result: BlogArticle;
      if (articleData.id) {
        result = await blogService.updateArticle(articleData.id, articleData) as BlogArticle;
      } else {
        result = await blogService.createArticle(articleData);
      }
      
      toast.success('Artigo publicado!')
      
      // Redirecionar após publicação
      window.history.replaceState({}, '', '/admin');
      window.dispatchEvent(new PopStateEvent('popstate'));
      
    } catch (err) {
      console.error('❌ Erro ao publicar:', err);
      toast.error('Falha ao publicar')
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0f12] text-gray-100">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#0f1418]/80 backdrop-blur border-b border-gray-800">
        <div className="max-w-screen-lg mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="text-gray-300 hover:text-emerald-300 hover:bg-emerald-500/20 transition-all duration-300" onClick={onCancel}>
              <X className="w-6 h-6"/> Sair
            </Button>
            <Separator orientation="vertical" className="h-6 bg-gray-800"/>
            <span className="text-sm text-white/70 flex items-center gap-2">
              {saving ? (<><Clock className="w-6 h-6 animate-spin"/> Salvando…</>) : (savedAt ? <>Salvo • {savedAt.toLocaleTimeString()}</> : '—')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={saveArticle} className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg transition-all duration-300 hover:shadow-emerald-500/25 hover:scale-105">
              <Save className="w-6 h-6 mr-2"/>Salvar
            </Button>
            <Button onClick={publish} className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg transition-all duration-300 hover:shadow-green-500/25 hover:scale-105">
              <Globe className="w-6 h-6 mr-2"/>Publicar
            </Button>
          </div>
        </div>
      </div>

      {/* Área principal */}
      <main className="max-w-screen-md mx-auto px-6 py-8">
        {/* Título */}
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título"
          className="bg-transparent border-0 text-4xl md:text-5xl font-extrabold tracking-tight placeholder:text-white/20 focus-visible:ring-0 focus-visible:border-0 px-0"
        />
        
        {/* Subtítulo */}
        <Input
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          placeholder="Escreva um subtítulo (opcional)"
          className="bg-transparent border-0 text-lg md:text-xl text-white/70 placeholder:text-white/30 mt-3 focus-visible:ring-0 focus-visible:border-0 px-0"
        />

        {/* Editor simples */}
        <div className="mt-12 border border-gray-700 rounded-lg overflow-hidden bg-[#0f1418]">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Comece a escrever seu artigo..."
            className="w-full min-h-[600px] bg-transparent text-white placeholder:text-gray-500 p-4 resize-none outline-none"
            style={{ fontFamily: 'inherit' }}
          />
        </div>

        {/* Configurações */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader className="border-b border-gray-700">
              <CardTitle className="text-base font-semibold text-white">Detalhes do Artigo</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="space-y-3">
                <Label htmlFor="author" className="text-sm font-medium text-gray-300">Autor</Label>
                <Input
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Nome do Autor"
                  className="bg-[#0f1418] border-gray-700 text-white placeholder:text-gray-500 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="category" className="text-sm font-medium text-gray-300">Categoria</Label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="Tendências">Tendências</option>
                  <option value="Inteligência Artificial">Inteligência Artificial</option>
                  <option value="Automação">Automação</option>
                  <option value="Business Intelligence">Business Intelligence</option>
                  <option value="Análise de Dados">Análise de Dados</option>
                  <option value="Tecnologia">Tecnologia</option>
                  <option value="Negócios">Negócios</option>
                  <option value="Tutorial">Tutorial</option>
                  <option value="Case Study">Case Study</option>
                </select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="tags" className="text-sm font-medium text-gray-300">Tags</Label>
                <Input
                  id="tags"
                  value={tags.join(', ')}
                  onChange={(e) => setTags(e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                  placeholder="tag1, tag2, tag3"
                  className="bg-[#0f1418] border-gray-700 text-white placeholder:text-gray-500 focus:border-emerald-500"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
}
