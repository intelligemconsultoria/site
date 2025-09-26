import React, { useEffect, useMemo, useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Separator } from './ui/separator'
import { Save, Globe, Clock, X, Settings, ChevronRight } from 'lucide-react'
import { BlogArticle, blogService } from '../services/blogService'
import { toast } from 'sonner'
import { ThemeToggle } from './ThemeToggle'

interface Props {
  article?: BlogArticle | null
  onSave: (article: Partial<BlogArticle>, isPublish?: boolean) => Promise<BlogArticle | void>
  onCancel: () => void
}

export function ModernEditor({ article, onSave, onCancel }: Props) {
  const [title, setTitle] = useState(article?.title || '')
  const [subtitle, setSubtitle] = useState(article?.excerpt || '')
  const [author, setAuthor] = useState(article?.author || '')
  const [category, setCategory] = useState(article?.category || '')
  const [tags, setTags] = useState<string[]>(Array.isArray(article?.tags) ? (article!.tags as string[]) : [])
  const [content, setContent] = useState(article?.content || '')
  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [articleId, setArticleId] = useState<string | null>(article?.id || null)
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<Date | null>(null)
  const [dirty, setDirty] = useState(false)

  // Configuração do React Quill
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      [{ 'align': [] }],
      ['clean']
    ],
  }

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet', 'indent',
    'blockquote', 'code-block',
    'link', 'image',
    'align'
  ]

  // Autosave
  const saveArticleDirect = async () => {
    console.log('🔄 saveArticleDirect iniciado - SALVAMENTO DIRETO');
    setSaving(true)
    try {
      const articleData = {
        id: articleId || article?.id,
        title: title.trim(),
        excerpt: subtitle.trim(),
        author: author.trim(),
        category: category.trim(),
        tags,
        content: content.trim(),
        image_url: firstImageSrc(content) || article?.image_url || '',
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
      
      if (!articleId && result && typeof result === 'object' && 'id' in result) {
        setArticleId(result.id as string)
      }
      
      setSavedAt(new Date()); 
      setDirty(false)
      console.log('✅ Artigo salvo com sucesso');
    } catch (err) {
      console.error('❌ Erro ao salvar:', err);
      toast.error('Erro ao salvar rascunho')
    } finally {
      setSaving(false)
    }
  }

  // Autosave com setTimeout
  useEffect(() => {
    if (dirty && !saving) {
      const timer = setTimeout(() => {
        saveArticleDirect();
      }, 1000);
      
      return () => {
        clearTimeout(timer);
      };
    }
  }, [dirty, saving]);

  const publish = async () => {
    if (!title.trim()) {
      toast.error('Título é obrigatório para publicar')
      return
    }
    if (!subtitle.trim()) {
      toast.error('Subtítulo é obrigatório para publicar')
      return
    }
    if (!author.trim()) {
      toast.error('Autor é obrigatório para publicar')
      return
    }
    if (!category.trim()) {
      toast.error('Categoria é obrigatória para publicar')
      return
    }
    if (tags.length === 0) {
      toast.error('Pelo menos uma tag é obrigatória para publicar')
      return
    }
    if (!content.trim() || content === '<p><br></p>') {
      toast.error('Conteúdo é obrigatório para publicar')
      return
    }

    try {
      const articleData = {
        id: articleId || article?.id,
        title, 
        excerpt: subtitle, 
        author, 
        category, 
        tags, 
        content,
        slug: title ? slugify(title) : '',
        image_url: firstImageSrc(content) || article?.image_url || '',
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
      
      if (!articleId && result && typeof result === 'object' && 'id' in result) {
        setArticleId(result.id as string)
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

  const wordCount = useMemo(() => {
    const text = content.replace(/<[^>]*>/g, '')
    return text.split(/\s+/).filter(Boolean).length
  }, [content])

  const readTime = useMemo(() => {
    const wordsPerMinute = 200
    const minutes = Math.ceil(wordCount / wordsPerMinute)
    return `${minutes} min`
  }, [wordCount])

  const insertImage = (src: string) => {
    if (src.trim()) {
      const quill = document.querySelector('.ql-editor') as any
      if (quill) {
        const range = quill.getSelection()
        quill.insertEmbed(range.index, 'image', src.trim())
        setImageDialogOpen(false)
        setImageUrl('')
        setDirty(true)
      }
    }
  }

  const renderCoverImagePreview = () => {
    const currentImageUrl = firstImageSrc(content) || article?.image_url || '';
    if (currentImageUrl) {
      return (
        <div className="relative w-full h-32 bg-gray-800 rounded-md overflow-hidden">
          <img src={currentImageUrl} alt="Capa do Artigo" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-sm font-medium">
            Pré-visualização da Capa
          </div>
        </div>
      );
    }
    return (
      <div className="w-full h-32 bg-gray-800 rounded-md flex items-center justify-center text-gray-400 text-sm">
        Sem imagem de capa
      </div>
    );
  };

  return (
    <>
      <style jsx global>{`
        .ql-toolbar {
          background: #f9fafb !important;
          border: 1px solid #d1d5db !important;
          border-bottom: none !important;
          border-radius: 8px 8px 0 0 !important;
        }
        
        .dark .ql-toolbar {
          background: #1f2937 !important;
          border: 1px solid #374151 !important;
          border-bottom: none !important;
          border-radius: 8px 8px 0 0 !important;
        }
        
        .ql-container {
          background: #ffffff !important;
          border: 1px solid #d1d5db !important;
          border-top: none !important;
          border-radius: 0 0 8px 8px !important;
          min-height: 600px !important;
        }
        
        .dark .ql-container {
          background: #0f1418 !important;
          border: 1px solid #374151 !important;
          border-top: none !important;
          border-radius: 0 0 8px 8px !important;
          min-height: 600px !important;
        }
        
        .ql-editor {
          color: #111827 !important;
          font-size: 16px !important;
          line-height: 1.6 !important;
          padding: 20px !important;
        }
        
        .dark .ql-editor {
          color: #ffffff !important;
          font-size: 16px !important;
          line-height: 1.6 !important;
          padding: 20px !important;
        }
        
        .ql-editor.ql-blank::before {
          color: #9ca3af !important;
          font-style: normal !important;
        }
        
        .dark .ql-editor.ql-blank::before {
          color: #6b7280 !important;
          font-style: normal !important;
        }
        
        .ql-toolbar .ql-stroke {
          stroke: #6b7280 !important;
        }
        
        .dark .ql-toolbar .ql-stroke {
          stroke: #9ca3af !important;
        }
        
        .ql-toolbar .ql-fill {
          fill: #6b7280 !important;
        }
        
        .dark .ql-toolbar .ql-fill {
          fill: #9ca3af !important;
        }
        
        .ql-toolbar button:hover .ql-stroke {
          stroke: #10b981 !important;
        }
        
        .ql-toolbar button:hover .ql-fill {
          fill: #10b981 !important;
        }
        
        .ql-toolbar button.ql-active .ql-stroke {
          stroke: #10b981 !important;
        }
        
        .ql-toolbar button.ql-active .ql-fill {
          fill: #10b981 !important;
        }
        
        .ql-toolbar .ql-picker-label {
          color: #6b7280 !important;
        }
        
        .dark .ql-toolbar .ql-picker-label {
          color: #9ca3af !important;
        }
        
        .ql-toolbar .ql-picker-label:hover {
          color: #10b981 !important;
        }
        
        .ql-toolbar .ql-picker.ql-expanded .ql-picker-label {
          color: #10b981 !important;
        }
        
        .ql-toolbar .ql-picker-options {
          background: #ffffff !important;
          border: 1px solid #d1d5db !important;
          border-radius: 6px !important;
        }
        
        .dark .ql-toolbar .ql-picker-options {
          background: #1f2937 !important;
          border: 1px solid #374151 !important;
          border-radius: 6px !important;
        }
        
        .ql-toolbar .ql-picker-item {
          color: #111827 !important;
        }
        
        .dark .ql-toolbar .ql-picker-item {
          color: #ffffff !important;
        }
        
        .ql-toolbar .ql-picker-item:hover {
          background: #f3f4f6 !important;
          color: #10b981 !important;
        }
        
        .dark .ql-toolbar .ql-picker-item:hover {
          background: #374151 !important;
          color: #10b981 !important;
        }
        
        .ql-editor h1 {
          color: #111827 !important;
          font-size: 2rem !important;
          font-weight: bold !important;
          margin: 1.5rem 0 0.5rem 0 !important;
        }
        
        .dark .ql-editor h1 {
          color: #ffffff !important;
          font-size: 2rem !important;
          font-weight: bold !important;
          margin: 1.5rem 0 0.5rem 0 !important;
        }
        
        .ql-editor h2 {
          color: #111827 !important;
          font-size: 1.5rem !important;
          font-weight: bold !important;
          margin: 1.25rem 0 0.5rem 0 !important;
        }
        
        .dark .ql-editor h2 {
          color: #ffffff !important;
          font-size: 1.5rem !important;
          font-weight: bold !important;
          margin: 1.25rem 0 0.5rem 0 !important;
        }
        
        .ql-editor h3 {
          color: #111827 !important;
          font-size: 1.25rem !important;
          font-weight: bold !important;
          margin: 1rem 0 0.5rem 0 !important;
        }
        
        .dark .ql-editor h3 {
          color: #ffffff !important;
          font-size: 1.25rem !important;
          font-weight: bold !important;
          margin: 1rem 0 0.5rem 0 !important;
        }
        
        .ql-editor blockquote {
          color: #6b7280 !important;
          border-left: 4px solid #d1d5db !important;
          padding-left: 1rem !important;
          margin: 1rem 0 !important;
          font-style: italic !important;
        }
        
        .dark .ql-editor blockquote {
          color: #9ca3af !important;
          border-left: 4px solid #10b981 !important;
          padding-left: 1rem !important;
          margin: 1rem 0 !important;
          font-style: italic !important;
        }
        
        .ql-editor code {
          background-color: #f3f4f6 !important;
          color: #111827 !important;
          padding: 0.125rem 0.25rem !important;
          border-radius: 0.25rem !important;
          font-family: 'Courier New', monospace !important;
        }
        
        .dark .ql-editor code {
          background-color: #374151 !important;
          color: #ffffff !important;
          padding: 0.125rem 0.25rem !important;
          border-radius: 0.25rem !important;
          font-family: 'Courier New', monospace !important;
        }
        
        .ql-editor pre {
          background-color: #f3f4f6 !important;
          color: #111827 !important;
          padding: 1rem !important;
          border-radius: 0.5rem !important;
          overflow-x: auto !important;
        }
        
        .dark .ql-editor pre {
          background-color: #1f2937 !important;
          color: #ffffff !important;
          padding: 1rem !important;
          border-radius: 0.5rem !important;
          overflow-x: auto !important;
        }
        
        .ql-editor pre code {
          background-color: transparent !important;
          color: inherit !important;
          padding: 0 !important;
        }
        
        .ql-editor ul, .ql-editor ol {
          color: #111827 !important;
          padding-left: 1.5rem !important;
        }
        
        .dark .ql-editor ul, .dark .ql-editor ol {
          color: #ffffff !important;
          padding-left: 1.5rem !important;
        }
        
        .ql-editor li {
          margin: 0.25rem 0 !important;
        }
        
        .ql-editor img {
          max-width: 100% !important;
          height: auto !important;
          border-radius: 0.5rem !important;
          margin: 1rem 0 !important;
        }
        
        .ql-editor a {
          color: #10b981 !important;
          text-decoration: underline !important;
        }
        
        .ql-editor a:hover {
          color: #34d399 !important;
        }
      `}</style>
      
      <div className="min-h-screen bg-white dark:bg-[#0b0f12] text-gray-900 dark:text-gray-100">
        {/* Header minimalista */}
        <div className="sticky top-0 z-10 bg-white/80 dark:bg-[#0f1418]/80 backdrop-blur border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-screen-lg mx-auto px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" className="text-gray-600 dark:text-gray-300 hover:text-emerald-300 hover:bg-emerald-500/20 transition-all duration-300" onClick={onCancel}>
                <X className="w-6 h-6"/> Sair
              </Button>
              <Separator orientation="vertical" className="h-6 bg-gray-300 dark:bg-gray-800"/>
              <span className="text-sm text-gray-500 dark:text-white/70 flex items-center gap-2">
                {saving ? (<><Clock className="w-6 h-6 animate-spin"/> Salvando…</>) : (savedAt ? <>Salvo • {savedAt.toLocaleTimeString()}</> : '—')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button onClick={saveArticleDirect} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg transition-all duration-300 hover:shadow-blue-500/25 hover:scale-105">
                <Save className="w-6 h-6 mr-2"/>Salvar
              </Button>
              <Button onClick={publish} className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg transition-all duration-300 hover:shadow-orange-500/25 hover:scale-105">
                <Globe className="w-6 h-6 mr-2"/>Publicar
              </Button>
              <Button
                variant="outline"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="border border-gray-300 dark:border-emerald-500 text-gray-700 dark:text-emerald-300 hover:bg-gray-100 dark:hover:bg-emerald-600 hover:text-gray-900 dark:hover:text-white hover:border-gray-400 dark:hover:border-emerald-400 gap-2 shadow-lg transition-all duration-300 hover:shadow-emerald-500/25 hover:scale-105"
              >
                <Settings className="w-4 h-4" />
                Configurações
              </Button>
            </div>
          </div>
        </div>

        {/* Área principal estilo Medium */}
        <main className="max-w-screen-md mx-auto px-6 py-8">
          {/* Título */}
          <Input
            value={title}
            onChange={(e) => { 
              setTitle(e.target.value); 
              setDirty(true);
            }}
            placeholder="Título"
            className="bg-transparent border-0 text-4xl md:text-5xl font-extrabold tracking-tight placeholder:text-gray-400 dark:placeholder:text-white/20 focus-visible:ring-0 focus-visible:border-0 px-0 text-gray-900 dark:text-white"
          />
          
          {/* Subtítulo */}
          <Input
            value={subtitle}
            onChange={(e) => { 
              setSubtitle(e.target.value); 
              setDirty(true);
            }}
            placeholder="Escreva um subtítulo (opcional)"
            className="bg-transparent border-0 text-lg md:text-xl text-gray-600 dark:text-white/70 placeholder:text-gray-400 dark:placeholder:text-white/30 mt-3 focus-visible:ring-0 focus-visible:border-0 px-0"
          />

          {/* Editor React Quill */}
          <div className="mt-12">
            <ReactQuill
              theme="snow"
              value={content}
              onChange={(value) => {
                setContent(value)
                setDirty(true)
              }}
              modules={modules}
              formats={formats}
              placeholder="Comece a escrever seu artigo..."
            />
          </div>

          {/* Rodapé do editor */}
          <div className="mt-4 flex justify-between items-center text-gray-500 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{readTime} • {wordCount} palavras</span>
            </div>
          </div>
        </main>

        {/* Sidebar deslizante de configurações */}
        {sidebarOpen && (
          <>
            {/* Overlay */}
            <div 
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setSidebarOpen(false)}
            />
          
            {/* Sidebar */}
            <div 
              className="fixed top-0 right-0 h-full w-80 bg-gray-900 border-l border-gray-600 shadow-2xl z-50 transform transition-transform duration-300 ease-out"
              style={{
                transform: 'translateX(0)',
                animation: 'slideInFromRight 0.3s ease-out forwards'
              }}
            >
              <div className="p-6 h-full overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Configurações</h2>
                  <Button variant="ghost" onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-emerald-300 hover:bg-emerald-500/20 p-2 transition-all duration-300">
                    <ChevronRight className="w-6 h-6" />
                  </Button>
                </div>

                {/* Seção Configurações */}
                <div className="space-y-6">
                  <Card className="bg-gray-800 border-gray-700 text-white">
                    <CardHeader className="border-b border-gray-700">
                      <CardTitle className="text-base font-semibold text-white">Detalhes do Artigo</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-4">
                      {/* Autor */}
                      <div className="space-y-3">
                        <Label htmlFor="author" className="text-sm font-medium text-gray-300">Autor</Label>
                        <Input
                          id="author"
                          value={author}
                          onChange={(e) => { setAuthor(e.target.value); setDirty(true) }}
                          placeholder="Nome do Autor"
                          className="bg-[#0f1418] border-gray-700 text-white placeholder:text-gray-500 focus:border-emerald-500"
                        />
                      </div>

                      {/* Categoria */}
                      <div className="space-y-3">
                        <Label htmlFor="category" className="text-sm font-medium text-gray-300">Categoria</Label>
                        <select
                          id="category"
                          value={category}
                          onChange={(e) => { setCategory(e.target.value); setDirty(true) }}
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

                      {/* Tags */}
                      <div className="space-y-3">
                        <Label htmlFor="tags" className="text-sm font-medium text-gray-300">Tags</Label>
                        <Input
                          id="tags"
                          value={tags.join(', ')}
                          onChange={(e) => { setTags(e.target.value.split(',').map(t => t.trim()).filter(Boolean)); setDirty(true) }}
                          placeholder="tag1, tag2, tag3"
                          className="bg-[#0f1418] border-gray-700 text-white placeholder:text-gray-500 focus:border-emerald-500"
                        />
                      </div>

                      {/* Imagem de Capa */}
                      <div className="space-y-3">
                        <Label htmlFor="image-url" className="text-sm font-medium text-gray-300">URL da Imagem de Capa</Label>
                        <Input
                          id="image-url"
                          value={imageUrl}
                          onChange={(e) => { setImageUrl(e.target.value); setDirty(true) }}
                          placeholder="https://exemplo.com/imagem.jpg"
                          className="bg-[#0f1418] border-gray-700 text-white placeholder:text-gray-500 focus:border-emerald-500"
                        />
                        {renderCoverImagePreview()}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Seção Status */}
                  <Card className="bg-gray-800 border-gray-700 text-white">
                    <CardHeader className="border-b border-gray-700">
                      <CardTitle className="text-base font-semibold text-white">Status</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-4">
                      {/* Publicado */}
                      <div className="flex items-center justify-between">
                        <Label htmlFor="published" className="text-sm font-medium text-gray-300">Publicado</Label>
                        <input
                          type="checkbox"
                          id="published"
                          checked={article?.published || false}
                          onChange={(e) => setDirty(true)}
                          className="h-5 w-5 text-emerald-600 bg-gray-700 border-gray-600 rounded focus:ring-emerald-500"
                        />
                      </div>

                      {/* Em Destaque */}
                      <div className="flex items-center justify-between">
                        <Label htmlFor="featured" className="text-sm font-medium text-gray-300">Em Destaque</Label>
                        <input
                          type="checkbox"
                          id="featured"
                          checked={article?.featured || false}
                          onChange={(e) => setDirty(true)}
                          className="h-5 w-5 text-emerald-600 bg-gray-700 border-gray-600 rounded focus:ring-emerald-500"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Diálogo de Imagem */}
        <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
          <DialogContent className="bg-gray-900 text-white border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Inserir Imagem</DialogTitle>
              <DialogDescription>Informe uma URL para inserir a imagem no editor.</DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <Label htmlFor="img-url">URL</Label>
              <Input id="img-url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://…" className="bg-[#0f1418] border-gray-700"/>
              <div className="flex gap-2 justify-end mt-4">
                <Button variant="outline" className="border-gray-700 hover:bg-emerald-500/20 hover:text-emerald-300 hover:border-emerald-500 transition-all duration-300" onClick={() => setImageDialogOpen(false)}>Cancelar</Button>
                <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg transition-all duration-300 hover:shadow-emerald-500/25 hover:scale-105" onClick={() => insertImage(imageUrl)}>Inserir</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
}

function firstImageSrc(html: string): string | null {
  const div = document.createElement('div'); 
  div.innerHTML = html; 
  const img = div.querySelector('img'); 
  return img?.getAttribute('src') || null
}
