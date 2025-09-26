import React, { useEffect, useMemo, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Separator } from './ui/separator'
import { Badge } from './ui/badge'
import {
  Bold, Italic, Heading1, Heading2, Link as LinkIcon, Quote, List, ListOrdered, Code,
  Image as ImageIcon, Minus, Save, Globe, Clock, X, AlignLeft, Type, Eye, Settings, 
  ChevronRight, ChevronLeft, Underline as UnderlineIcon, Palette, Highlighter
} from 'lucide-react'
import { BlogArticle, blogService } from '../services/blogService'
import { toast } from 'sonner'

interface Props {
  article?: BlogArticle | null
  onSave: (article: Partial<BlogArticle>, isPublish?: boolean) => Promise<BlogArticle | void>
  onCancel: () => void
}

export function TipTapEditor({ article, onSave, onCancel }: Props) {
  const [title, setTitle] = useState(article?.title || '')
  const [subtitle, setSubtitle] = useState(article?.excerpt || '')
  const [author, setAuthor] = useState(article?.author || '')
  const [category, setCategory] = useState(article?.category || '')
  const [tags, setTags] = useState<string[]>(Array.isArray(article?.tags) ? (article!.tags as string[]) : [])
  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [articleId, setArticleId] = useState<string | null>(article?.id || null)
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<Date | null>(null)
  const [dirty, setDirty] = useState(false)

  // Configuração do editor TipTap
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg my-4',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-emerald-400 hover:text-emerald-300 underline',
        },
      }),
      Placeholder.configure({
        placeholder: 'Comece a escrever seu artigo...',
        showOnlyWhenEditable: true,
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
    ],
    content: article?.content || '',
    onUpdate: ({ editor }) => {
      setDirty(true)
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none outline-none leading-relaxed text-lg min-h-[600px] focus:outline-none px-4 py-8',
      },
    },
  })

  // Autosave com TipTap
  const saveArticleDirect = async () => {
    console.log('🔄 saveArticleDirect iniciado - SALVAMENTO DIRETO');
    setSaving(true)
    try {
      const html = editor?.getHTML() || ''
      console.log('📄 HTML do editor:', html.substring(0, 100) + '...');
      
      const articleData = {
        id: articleId || article?.id,
        title: title.trim(),
        excerpt: subtitle.trim(),
        author: author.trim(),
        category: category.trim(),
        tags,
        content: html,
        image_url: firstImageSrc(html) || article?.image_url || '',
        slug: title ? slugify(title) : '',
        date: article?.date || new Date().toISOString(),
        created_at: article?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        published: false,
        read_time: article?.read_time || '1 min',
        featured: article?.featured || false
      }
      
      console.log('💾 Salvando DIRETAMENTE via blogService:', { 
        id: articleData.id, 
        title: articleData.title, 
        excerpt: articleData.excerpt, 
        author: articleData.author, 
        category: articleData.category,
        tagsCount: articleData.tags?.length,
        contentLength: articleData.content?.length,
        slug: articleData.slug,
        published: articleData.published
      });
      
      let result: BlogArticle;
      if (articleData.id) {
        console.log('📝 Atualizando artigo existente diretamente:', articleData.id);
        result = await blogService.updateArticle(articleData.id, articleData) as BlogArticle;
      } else {
        console.log('🆕 Criando novo artigo diretamente');
        result = await blogService.createArticle(articleData);
      }
      
      console.log('✅ Artigo salvo DIRETAMENTE com sucesso:', result);
      
      if (!articleId && result && typeof result === 'object' && 'id' in result) {
        console.log('🆔 Novo artigo criado, salvando ID:', result.id);
        setArticleId(result.id as string)
      }
      
      setSavedAt(new Date()); 
      setDirty(false)
      console.log('✅ saveArticleDirect concluído com sucesso');
    } catch (err) {
      console.error('❌ Erro no saveArticleDirect:', err);
      toast.error('Erro ao salvar rascunho')
    } finally {
      setSaving(false)
    }
  }

  // Autosave com setTimeout
  useEffect(() => {
    if (dirty && !saving) {
      console.log('💾 dirty=true, agendando autosave DIRETO em 1 segundo');
      const timer = setTimeout(() => {
        console.log('⏰ Timer executado, chamando saveArticleDirect');
        saveArticleDirect();
      }, 1000);
      
      return () => {
        console.log('🧹 Limpando timer');
        clearTimeout(timer);
      };
    }
  }, [dirty, saving]);

  const publish = async () => {
    // Validação obrigatória
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
    
    const html = editor?.getHTML() || ''
    if (!html.trim() || html === '<p></p>') {
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
        content: html,
        slug: title ? slugify(title) : '',
        image_url: firstImageSrc(html) || article?.image_url || '',
        date: article?.date || new Date().toISOString(),
        created_at: article?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        published: true,
        read_time: article?.read_time || '1 min',
        featured: article?.featured || false
      }
      
      console.log('📤 Publicando artigo DIRETAMENTE:', articleData);
      
      let result: BlogArticle;
      if (articleData.id) {
        console.log('📝 Atualizando artigo existente para publicação:', articleData.id);
        result = await blogService.updateArticle(articleData.id, articleData) as BlogArticle;
      } else {
        console.log('🆕 Criando novo artigo para publicação');
        result = await blogService.createArticle(articleData);
      }
      
      console.log('✅ Artigo publicado DIRETAMENTE com sucesso:', result);
      
      if (!articleId && result && typeof result === 'object' && 'id' in result) {
        console.log('🆔 Novo artigo publicado, salvando ID:', result.id);
        setArticleId(result.id as string)
      }
      
      toast.success('Artigo publicado!')
      
      // Redirecionar manualmente após publicação
      console.log('📤 Redirecionando para admin após publicação');
      window.history.replaceState({}, '', '/admin');
      window.dispatchEvent(new PopStateEvent('popstate'));
      
    } catch (err) {
      console.error('❌ Erro ao publicar:', err);
      toast.error('Falha ao publicar')
    }
  }

  const wordCount = useMemo(() => {
    const text = editor?.getText() || ''
    return text.split(/\s+/).filter(Boolean).length
  }, [editor?.getText()])

  const readTime = useMemo(() => {
    const wordsPerMinute = 200
    const minutes = Math.ceil(wordCount / wordsPerMinute)
    return `${minutes} min`
  }, [wordCount])

  const renderCoverImagePreview = () => {
    const currentImageUrl = firstImageSrc(editor?.getHTML() || '') || article?.image_url || '';
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

  // Funções auxiliares
  const insertImage = (src: string) => {
    if (editor && src.trim()) {
      editor.chain().focus().setImage({ src: src.trim() }).run()
      setImageDialogOpen(false)
      setImageUrl('')
    }
  }

  const addLink = () => {
    const url = window.prompt('Digite a URL:')
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  const setTextColor = (color: string) => {
    if (editor) {
      editor.chain().focus().setColor(color).run()
    }
  }

  const setHighlight = (color: string) => {
    if (editor) {
      editor.chain().focus().setHighlight({ color }).run()
    }
  }

  return (
    <>
      <style>{`
        .ProseMirror {
          outline: none;
        }
        
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #6b7280;
          pointer-events: none;
          height: 0;
        }
        
        .ProseMirror ul, .ProseMirror ol {
          padding-left: 1.5rem;
        }
        
        .ProseMirror li {
          margin: 0.25rem 0;
        }
        
        .ProseMirror blockquote {
          border-left: 4px solid #10b981;
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
          color: #9ca3af;
        }
        
        .ProseMirror code {
          background-color: #374151;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-family: 'Courier New', monospace;
        }
        
        .ProseMirror pre {
          background-color: #1f2937;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
        }
        
        .ProseMirror pre code {
          background-color: transparent;
          padding: 0;
        }
        
        .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1rem 0;
        }
        
        .ProseMirror h1, .ProseMirror h2, .ProseMirror h3 {
          color: #ffffff;
          font-weight: bold;
          margin: 1.5rem 0 0.5rem 0;
        }
        
        .ProseMirror h1 {
          font-size: 2rem;
        }
        
        .ProseMirror h2 {
          font-size: 1.5rem;
        }
        
        .ProseMirror h3 {
          font-size: 1.25rem;
        }
      `}</style>
      
      <div className="min-h-screen bg-[#0b0f12] text-gray-100">
        {/* Header minimalista */}
        <div className="sticky top-0 z-10 bg-[#0f1418]/80 backdrop-blur border-b border-gray-800">
          <div className="max-w-screen-lg mx-auto px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" className="text-gray-300 hover:text-emerald-300 hover:bg-emerald-500/20 transition-all duration-300 hover:border-emerald-500/30" onClick={onCancel}><X className="w-6 h-6"/> Sair</Button>
              <Separator orientation="vertical" className="h-6 bg-gray-800"/>
              <span className="text-sm text-white/70 flex items-center gap-2">
                {saving ? (<><Clock className="w-6 h-6 animate-spin"/> Salvando…</>) : (savedAt ? <>Salvo • {savedAt.toLocaleTimeString()}</> : '—')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={saveArticleDirect} className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg transition-all duration-300 hover:shadow-emerald-500/25 hover:scale-105"><Save className="w-6 h-6 mr-2"/>Salvar</Button>
              <Button onClick={publish} className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg transition-all duration-300 hover:shadow-green-500/25 hover:scale-105"><Globe className="w-6 h-6 mr-2"/>Publicar</Button>
            </div>
          </div>
        </div>

        {/* Área principal estilo Medium */}
        <main className="max-w-screen-md mx-auto px-6 py-8">
          {/* Título */}
          <Input
            value={title}
            onChange={(e) => { 
              console.log('📝 Título mudou:', e.target.value.substring(0, 20));
              setTitle(e.target.value); 
              setDirty(true);
            }}
            placeholder="Título"
            className="bg-transparent border-0 text-4xl md:text-5xl font-extrabold tracking-tight placeholder:text-white/20 focus-visible:ring-0 focus-visible:border-0 px-0"
          />
          {/* Subtítulo */}
          <Input
            value={subtitle}
            onChange={(e) => { 
              console.log('📝 Subtítulo mudou:', e.target.value.substring(0, 20));
              setSubtitle(e.target.value); 
              setDirty(true);
            }}
            placeholder="Escreva um subtítulo (opcional)"
            className="bg-transparent border-0 text-lg md:text-xl text-white/70 placeholder:text-white/30 mt-3 focus-visible:ring-0 focus-visible:border-0 px-0"
          />

          {/* Editor com borda e toolbar fixo */}
          <div className="mt-12 border border-gray-700 rounded-lg overflow-hidden bg-[#0f1418]">
            {/* Toolbar fixo */}
            <div className="sticky top-0 z-10 bg-[#0f1418] border-b border-gray-700 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Formatação básica */}
                <IconBtn 
                  onClick={() => editor?.chain().focus().toggleBold().run()} 
                  icon={<Bold className="w-6 h-6"/>} 
                  title="Negrito"
                  active={editor?.isActive('bold')}
                />
                <IconBtn 
                  onClick={() => editor?.chain().focus().toggleItalic().run()} 
                  icon={<Italic className="w-6 h-6"/>} 
                  title="Itálico"
                  active={editor?.isActive('italic')}
                />
                <IconBtn 
                  onClick={() => editor?.chain().focus().toggleUnderline().run()} 
                  icon={<UnderlineIcon className="w-6 h-6"/>} 
                  title="Sublinhado"
                  active={editor?.isActive('underline')}
                />
                
                <div className="w-px h-6 bg-gray-600 mx-1"/>
                
                {/* Cabeçalhos */}
                <IconBtn 
                  onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} 
                  icon={<Heading1 className="w-6 h-6"/>} 
                  title="Título 1"
                  active={editor?.isActive('heading', { level: 1 })}
                />
                <IconBtn 
                  onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} 
                  icon={<Heading2 className="w-6 h-6"/>} 
                  title="Título 2"
                  active={editor?.isActive('heading', { level: 2 })}
                />
                
                <div className="w-px h-6 bg-gray-600 mx-1"/>
                
                {/* Blocos */}
                <IconBtn 
                  onClick={() => editor?.chain().focus().toggleBlockquote().run()} 
                  icon={<Quote className="w-6 h-6"/>} 
                  title="Citação"
                  active={editor?.isActive('blockquote')}
                />
                <IconBtn 
                  onClick={() => editor?.chain().focus().toggleBulletList().run()} 
                  icon={<List className="w-6 h-6"/>} 
                  title="Lista"
                  active={editor?.isActive('bulletList')}
                />
                <IconBtn 
                  onClick={() => editor?.chain().focus().toggleOrderedList().run()} 
                  icon={<ListOrdered className="w-6 h-6"/>} 
                  title="Lista Numerada"
                  active={editor?.isActive('orderedList')}
                />
                
                <div className="w-px h-6 bg-gray-600 mx-1"/>
                
                {/* Código */}
                <IconBtn 
                  onClick={() => editor?.chain().focus().toggleCode().run()} 
                  icon={<Code className="w-6 h-6"/>} 
                  title="Código Inline"
                  active={editor?.isActive('code')}
                />
                <IconBtn 
                  onClick={() => editor?.chain().focus().toggleCodeBlock().run()} 
                  icon={<Type className="w-6 h-6"/>} 
                  title="Bloco de Código"
                  active={editor?.isActive('codeBlock')}
                />
                
                <div className="w-px h-6 bg-gray-600 mx-1"/>
                
                {/* Links e imagens */}
                <IconBtn 
                  onClick={addLink} 
                  icon={<LinkIcon className="w-6 h-6"/>} 
                  title="Link"
                  active={editor?.isActive('link')}
                />
                <IconBtn 
                  onClick={() => setImageDialogOpen(true)} 
                  icon={<ImageIcon className="w-6 h-6"/>} 
                  title="Imagem"
                />
                
                <div className="w-px h-6 bg-gray-600 mx-1"/>
                
                {/* Cores */}
                <IconBtn 
                  onClick={() => setTextColor('#10b981')} 
                  icon={<Palette className="w-6 h-6"/>} 
                  title="Cor Verde"
                />
                <IconBtn 
                  onClick={() => setHighlight('#fbbf24')} 
                  icon={<Highlighter className="w-6 h-6"/>} 
                  title="Destaque Amarelo"
                />
              </div>
              
              {/* Botão de Configurações */}
              <Button
                variant="outline"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="border-emerald-500 text-emerald-300 hover:bg-emerald-600 hover:text-white hover:border-emerald-400 gap-2 shadow-lg transition-all duration-300 hover:shadow-emerald-500/25 hover:scale-105"
              >
                <Settings className="w-4 h-4" />
                Configurações
              </Button>
            </div>
            
            {/* Editor TipTap */}
            <EditorContent editor={editor} />
          </div>

          {/* Rodapé do editor */}
          <div className="mt-4 flex justify-between items-center text-gray-500 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{readTime} • {wordCount} palavras</span>
            </div>
            <Button variant="ghost" className="text-emerald-400 hover:text-white hover:bg-emerald-400/20 p-0 h-auto">
              <Eye className="w-4 h-4 mr-1"/> Visualizar
            </Button>
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
                          style={{
                            backgroundColor: '#1f2937',
                            color: '#ffffff',
                            borderColor: '#4b5563'
                          }}
                        >
                          <option value="" style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>Selecione uma categoria</option>
                          <option value="Tendências" style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>Tendências</option>
                          <option value="Inteligência Artificial" style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>Inteligência Artificial</option>
                          <option value="Automação" style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>Automação</option>
                          <option value="Business Intelligence" style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>Business Intelligence</option>
                          <option value="Análise de Dados" style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>Análise de Dados</option>
                          <option value="Tecnologia" style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>Tecnologia</option>
                          <option value="Negócios" style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>Negócios</option>
                          <option value="Tutorial" style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>Tutorial</option>
                          <option value="Case Study" style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>Case Study</option>
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

// Componente auxiliar para botões da toolbar
function IconBtn({ icon, onClick, title, active = false }: { icon: React.ReactNode; onClick: () => void; title?: string; active?: boolean }) {
  return (
    <button 
      type="button" 
      onClick={onClick} 
      title={title} 
      className={`p-1.5 rounded-md transition-all duration-300 hover:scale-110 ${
        active 
          ? 'bg-emerald-500/30 text-emerald-300' 
          : 'hover:bg-emerald-500/20 text-white/90 hover:text-emerald-300'
      }`}
    >
      {icon}
    </button>
  )
}

// Funções auxiliares
function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
}

function firstImageSrc(html: string): string | null {
  const div = document.createElement('div'); 
  div.innerHTML = html; 
  const img = div.querySelector('img'); 
  return img?.getAttribute('src') || null
}
