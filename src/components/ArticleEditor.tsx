import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Separator } from './ui/separator'
import { Badge } from './ui/badge'
import {
  Bold, Italic, Heading1, Heading2, Link as LinkIcon, Quote, List, ListOrdered, Code,
  Image as ImageIcon, Minus, Save, Globe, Clock, X, AlignLeft, Type, Eye, Settings, ChevronRight, ChevronLeft
} from 'lucide-react'
import { BlogArticle, blogService } from '../services/blogService'
import { toast } from 'sonner'
import DOMPurify from 'dompurify'
import { ThemeToggle } from './ThemeToggle'

/**
 * Medium‑like editor (WYSIWYG) mantendo o design dark/emerald da IntelliGem.
 * Principais recursos:
 * - Título grande + subtítulo
 * - Editor contentEditable com barra flutuante quando há seleção de texto
 * - Atalhos de markdown (#, ##, >, -, 1.) convertidos ao apertar Enter
 * - Comando “/” abre mini menu com: Heading 1/2, Lista, Citação, Código, Imagem, Divisor
 * - Colar imagem do clipboard ou inserir por URL
 * - Autosave (debounced) + indicador “Salvando…”/“Salvo”
 * - Contador de palavras + tempo de leitura
 * - Publicar (usa onSave com published=true)
 */

interface Props {
  article?: BlogArticle | null
  onSave: (article: Partial<BlogArticle>, isPublish?: boolean) => Promise<BlogArticle | void>
  onCancel: () => void
}

export function ArticleEditor({ article, onSave, onCancel }: Props) {
  const [title, setTitle] = useState(article?.title || '')
  const [subtitle, setSubtitle] = useState(article?.excerpt || '')
  const [author, setAuthor] = useState(article?.author || '')
  const [category, setCategory] = useState(article?.category || '')
  const [tags, setTags] = useState<string[]>(Array.isArray(article?.tags) ? (article!.tags as string[]) : [])
  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [articleId, setArticleId] = useState<string | null>(article?.id || null) // ID do artigo atual

  const editorRef = useRef<HTMLDivElement>(null)
  const bubbleRef = useRef<HTMLDivElement>(null)
  const slashMenuRef = useRef<HTMLDivElement>(null)

  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<Date | null>(null)
  const [dirty, setDirty] = useState(false)
  
  // Debug: monitorar mudanças no dirty
  useEffect(() => {
    console.log('🔄 Estado dirty mudou para:', dirty);
  }, [dirty])
  const [slashOpen, setSlashOpen] = useState(false)

  // ===== Helpers de formatação =====
  const applyInline = (cmd: 'bold' | 'italic' | 'code') => {
    console.log('🔧 Aplicando formatação:', cmd);
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      console.log('❌ Nenhuma seleção encontrada');
      return;
    }
    
    const range = selection.getRangeAt(0);
    const selectedText = selection.toString();
    
    if (!selectedText) {
      console.log('❌ Nenhum texto selecionado');
      return;
    }
    
    let wrapperElement;
    switch (cmd) {
      case 'bold':
        wrapperElement = document.createElement('strong');
        break;
      case 'italic':
        wrapperElement = document.createElement('em');
        break;
      case 'code':
        wrapperElement = document.createElement('code');
        break;
    }
    
    wrapperElement.textContent = selectedText;
    range.deleteContents();
    range.insertNode(wrapperElement);
    
    // Limpar seleção e focar no editor
    selection.removeAllRanges();
    focusEditor();
    setDirty(true);
    console.log('✅ Formatação aplicada:', cmd);
  }

  const wrapBlock = (tag: 'h1' | 'h2' | 'blockquote' | 'pre') => {
    console.log('🔧 Aplicando bloco:', tag);
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      console.log('❌ Nenhuma seleção encontrada');
      return;
    }
    
    const range = selection.getRangeAt(0);
    const selectedText = selection.toString();
    
    if (!selectedText) {
      console.log('❌ Nenhum texto selecionado');
      return;
    }
    
    const blockElement = document.createElement(tag);
    blockElement.textContent = selectedText;
    
    range.deleteContents();
    range.insertNode(blockElement);
    
    // Reposicionar caret após o bloco
    placeCaretAfter(blockElement);
    setDirty(true);
    console.log('✅ Bloco aplicado:', tag);
  }

  const makeList = (ordered = false) => {
    console.log('🔧 Criando lista:', ordered ? 'ordenada' : 'não ordenada');
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      console.log('❌ Nenhuma seleção encontrada');
      return;
    }
    
    const range = selection.getRangeAt(0);
    const selectedText = selection.toString();
    
    if (!selectedText) {
      console.log('❌ Nenhum texto selecionado');
      return;
    }
    
    const listElement = document.createElement(ordered ? 'ol' : 'ul');
    const lines = selectedText.split(/\n+/).filter(Boolean);
    
    for (const line of lines) {
      const listItem = document.createElement('li');
      listItem.textContent = line;
      listElement.appendChild(listItem);
    }
    
    range.deleteContents();
    range.insertNode(listElement);
    
    // Reposicionar caret após a lista
    placeCaretAfter(listElement);
    setDirty(true);
    console.log('✅ Lista criada:', ordered ? 'ordenada' : 'não ordenada');
  }

  const insertDivider = () => {
    console.log('🔧 Inserindo divisor');
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      console.log('❌ Nenhuma seleção encontrada');
      return;
    }
    
    const range = selection.getRangeAt(0);
    const hr = document.createElement('hr');
    hr.className = 'my-4 border-gray-600';
    
    range.insertNode(hr);
    
    // Reposicionar caret após o divisor
    placeCaretAfter(hr);
    setDirty(true);
    console.log('✅ Divisor inserido');
  }

  const insertImage = (src: string) => {
    console.log('🔧 Inserindo imagem:', src);
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      console.log('❌ Nenhuma seleção encontrada');
      return;
    }
    
    const range = selection.getRangeAt(0);
    const fig = document.createElement('figure');
    fig.className = 'my-6';
    
    const img = document.createElement('img');
    img.src = src;
    img.alt = title || 'Imagem';
    img.className = 'w-full h-auto rounded-lg';
    
    const cap = document.createElement('figcaption');
    cap.textContent = 'Legenda (opcional)';
    cap.className = 'text-center text-white/50 text-sm mt-2 outline-none';
    cap.contentEditable = 'true';
    
    fig.appendChild(img);
    fig.appendChild(cap);
    
    range.insertNode(fig);
    
    // Reposicionar caret após a imagem
    placeCaretAfter(fig);
    setDirty(true);
    console.log('✅ Imagem inserida');
  }

  const insertNode = (node: Node) => {
    const sel = window.getSelection(); if (!sel || sel.rangeCount === 0) { editorRef.current?.appendChild(node); return }
    const range = sel.getRangeAt(0); range.collapse(false); range.insertNode(node)
  }

  // Fallback nativo para listas (quando não há seleção)
  const toggleNativeList = (ordered = false) => {
    document.execCommand(ordered ? 'insertOrderedList' : 'insertUnorderedList');
    setDirty(true);
  }

  const getSelectionText = () => (window.getSelection()?.toString() || '')
  const focusEditor = () => { editorRef.current?.focus() }

  // ===== Bolha flutuante =====
  const updateBubble = () => {
    const sel = window.getSelection(); const bubble = bubbleRef.current
    if (!sel || sel.isCollapsed || !bubble) { if (bubble) bubble.style.opacity = '0'; return }
    const rect = sel.getRangeAt(0).getBoundingClientRect()
    const top = rect.top + window.scrollY - 44
    const left = rect.left + window.scrollX + rect.width / 2 - 160 / 2
    bubble.style.top = `${top}px`; bubble.style.left = `${left}px`; bubble.style.opacity = '1'
  }

  useEffect(() => {
    const h = () => updateBubble()
    document.addEventListener('selectionchange', h)
    window.addEventListener('scroll', h)
    return () => { document.removeEventListener('selectionchange', h); window.removeEventListener('scroll', h) }
  }, [])

  // ===== Slash menu =====
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === '/' && !slashOpen) setSlashOpen(true)
    if (slashOpen && e.key === 'Escape') setSlashOpen(false)
    
    // Atalhos de markdown com espaço (comportamento Notion/Medium)
    if (e.key === ' ') {
      const line = getCurrentLineText()
      if (/^-\s?$/.test(line)) { e.preventDefault(); replaceCurrentLine(''); toggleNativeList(false); return; }
      if (/^1\.\s?$/.test(line)) { e.preventDefault(); replaceCurrentLine(''); toggleNativeList(true); return; }
    }
    
    // markdown shortcuts ao Enter
    if (e.key === 'Enter') {
      const line = getCurrentLineText()
      if (/^#\s/.test(line)) { e.preventDefault(); replaceCurrentLine(line.replace(/^#\s/, '')); wrapBlock('h1'); return }
      if (/^##\s/.test(line)) { e.preventDefault(); replaceCurrentLine(line.replace(/^##\s/, '')); wrapBlock('h2'); return }
      if (/^>\s/.test(line)) { e.preventDefault(); replaceCurrentLine(line.replace(/^>\s/, '')); wrapBlock('blockquote'); return }
      if (/^```$/.test(line.trim())) { e.preventDefault(); replaceCurrentLine(''); wrapBlock('pre'); return }
    }
  }

  const getCurrentLineText = () => {
    const sel = window.getSelection(); if (!sel || sel.rangeCount === 0) return ''
    const range = sel.getRangeAt(0).cloneRange()
    range.collapse(true); range.setStart(editorRef.current!, 0)
    const text = range.toString(); const lines = text.split(/\n/)
    return lines[lines.length - 1]
  }

  const replaceCurrentLine = (withText: string) => {
    const sel = window.getSelection(); if (!sel || sel.rangeCount === 0) return
    const range = sel.getRangeAt(0)
    // estratégia simples: não quebrar DOM, apenas insere texto onde está
    document.execCommand('insertText', false, withText)
  }

  // ===== Paste (imagens) =====
  const onPaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData?.items
    if (!items) return
    for (const it of items) {
      if (it.type.indexOf('image') >= 0) {
        const file = it.getAsFile(); if (!file) continue
        const reader = new FileReader()
        reader.onload = () => insertImage(reader.result as string)
        reader.readAsDataURL(file)
        e.preventDefault()
        break
      }
    }
  }

  // ===== Autosave DIRETO (sem usar onSave do App.tsx) =====
  const saveArticleDirect = async () => {
    console.log('🔄 saveArticleDirect iniciado - SALVAMENTO DIRETO');
    console.log('📊 Estado atual:', { 
      title: title.trim(), 
      subtitle: subtitle.trim(), 
      author: author.trim(), 
      category: category.trim(),
      tagsCount: tags.length,
      articleId: articleId || article?.id
    });
    setSaving(true)
    try {
      const html = editorRef.current?.innerHTML || ''
      console.log('📄 HTML do editor:', html.substring(0, 100) + '...');
      const sanitizedHtml = sanitizeHtml(html)
      console.log('🧹 HTML sanitizado:', sanitizedHtml.substring(0, 100) + '...');
      const contentMd = htmlToMarkdown(sanitizedHtml)
      console.log('📝 Markdown convertido:', contentMd.substring(0, 100) + '...');
      
      const articleData = {
        id: articleId || article?.id, // Incluir ID se existir
        title: title.trim(),
        excerpt: subtitle.trim(),
        author: author.trim(),
        category: category.trim(),
        tags,
        content: contentMd,
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
      
      // SALVAMENTO DIRETO - não usa onSave do App.tsx
      let result: BlogArticle;
      if (articleData.id) {
        console.log('📝 Atualizando artigo existente diretamente:', articleData.id);
        result = await blogService.updateArticle(articleData.id, articleData) as BlogArticle;
      } else {
        console.log('🆕 Criando novo artigo diretamente');
        result = await blogService.createArticle(articleData);
      }
      
      console.log('✅ Artigo salvo DIRETAMENTE com sucesso:', result);
      
      // Se é um novo artigo e recebemos um ID de volta, salvar o ID
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

  // Autosave DIRETO com setTimeout
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

  const onInput = () => {
    console.log('📝 onInput chamado - setando dirty=true');
    setDirty(true);
  }

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
    
    const html = editorRef.current?.innerHTML || ''
    if (!html.trim() || html === '<p><br></p>') {
      toast.error('Conteúdo é obrigatório para publicar')
      return
    }

    try {
      const sanitizedHtml = sanitizeHtml(html)
      const contentMd = htmlToMarkdown(sanitizedHtml)
      
      const articleData = {
        id: articleId || article?.id, // Incluir ID se existir
        title, 
        excerpt: subtitle, 
        author, 
        category, 
        tags, 
        content: contentMd,
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
      
      // PUBLICAR DIRETAMENTE - não usa onSave do App.tsx
      let result: BlogArticle;
      if (articleData.id) {
        console.log('📝 Atualizando artigo existente para publicação:', articleData.id);
        result = await blogService.updateArticle(articleData.id, articleData) as BlogArticle;
      } else {
        console.log('🆕 Criando novo artigo para publicação');
        result = await blogService.createArticle(articleData);
      }
      
      console.log('✅ Artigo publicado DIRETAMENTE com sucesso:', result);
      
      // Se é um novo artigo e recebemos um ID de volta, salvar o ID
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

  // ===== Métricas =====
  const plainText = useMemo(() => stripHtml((editorRef.current?.innerHTML || '').replace(/<code[^>]*>[\s\S]*?<\/code>/g, ' ')), [editorRef.current?.innerHTML])
  const words = useMemo(() => (plainText.trim().split(/\s+/).filter(Boolean).length), [plainText])
  const readTime = Math.max(1, Math.ceil(words / 200))

  // ===== Render =====
  return (
    <>
      {/* CSS para animação do sidebar e dropdown */}
      <style>{`
        @keyframes slideInFromRight {
          0% {
            transform: translateX(100%);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        /* Estilo para dropdown dark */
        select option {
          background-color: #1f2937 !important;
          color: #ffffff !important;
        }
        
        select:focus {
          background-color: #1f2937 !important;
          color: #ffffff !important;
        }
        
        /* Placeholder visível no editor */
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #9CA3AF;
          pointer-events: none;
        }
      `}</style>
      
      <div className="min-h-screen bg-white dark:bg-background text-gray-900 dark:text-foreground">
      {/* Header minimalista */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-background/80 backdrop-blur border-b border-gray-200 dark:border-border">
        <div className="max-w-screen-lg mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="text-gray-600 dark:text-muted-foreground hover:text-emerald-300 hover:bg-emerald-500/20 transition-all duration-300 hover:border-emerald-500/30" onClick={onCancel}><X className="w-6 h-6"/> Sair</Button>
            <Separator orientation="vertical" className="h-6 bg-gray-300 dark:bg-border"/>
            <span className="text-sm text-gray-500 dark:text-muted-foreground flex items-center gap-2">
              {saving ? (<><Clock className="w-6 h-6 animate-spin"/> Salvando…</>) : (savedAt ? <>Salvo • {savedAt.toLocaleTimeString()}</> : '—')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button onClick={saveArticleDirect} className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg transition-all duration-300 hover:shadow-emerald-500/25 hover:scale-105"><Save className="w-6 h-6 mr-2"/>Salvar</Button>
            <Button onClick={publish} className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg transition-all duration-300 hover:shadow-green-500/25 hover:scale-105"><Globe className="w-6 h-6 mr-2"/>Publicar</Button>
          </div>
        </div>
      </div>

      {/* Área principal estilo Medium */}
      <main className="mx-auto px-6 py-8" style={{ maxWidth: '68ch' }}>
        {/* Título */}
        <Input
          value={title}
          onChange={(e) => { 
            console.log('📝 Título mudou:', e.target.value.substring(0, 20));
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
            console.log('📝 Subtítulo mudou:', e.target.value.substring(0, 20));
            setSubtitle(e.target.value); 
            setDirty(true);
          }}
          placeholder="Escreva um subtítulo (opcional)"
          className="bg-transparent border-0 text-lg md:text-xl text-gray-600 dark:text-foreground/70 placeholder:text-gray-400 dark:placeholder:text-muted-foreground mt-3 focus-visible:ring-0 focus-visible:border-0 px-0"
        />

        {/* Editor com borda e toolbar fixo */}
        <div className="mt-12 border border-gray-300 dark:border-border rounded-lg overflow-hidden bg-white dark:bg-card">
          {/* Toolbar fixo no topo */}
          <div className="sticky top-0 z-10 bg-white dark:bg-card border-b border-gray-300 dark:border-border px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IconBtn onClick={() => applyInline('bold')} icon={<Bold className="w-6 h-6"/>} title="Negrito" ariaLabel="Negrito"/>
              <IconBtn onClick={() => applyInline('italic')} icon={<Italic className="w-6 h-6"/>} title="Itálico" ariaLabel="Itálico"/>
              <IconBtn onClick={() => wrapBlock('h1')} icon={<Heading1 className="w-6 h-6"/>} title="H1" ariaLabel="Cabeçalho 1"/>
              <IconBtn onClick={() => wrapBlock('h2')} icon={<Heading2 className="w-6 h-6"/>} title="H2" ariaLabel="Cabeçalho 2"/>
              <div className="w-px h-6 bg-gray-400 dark:bg-gray-600 mx-1"/>
              <IconBtn onClick={() => wrapBlock('blockquote')} icon={<Quote className="w-6 h-6"/>} title="Citação" ariaLabel="Citação"/>
              <IconBtn onClick={() => makeList(false)} icon={<List className="w-6 h-6"/>} title="Lista" ariaLabel="Lista não ordenada"/>
              <IconBtn onClick={() => makeList(true)} icon={<ListOrdered className="w-6 h-6"/>} title="Lista numerada" ariaLabel="Lista ordenada"/>
              <div className="w-px h-6 bg-gray-400 dark:bg-gray-600 mx-1"/>
              <IconBtn onClick={() => applyInline('code')} icon={<Code className="w-6 h-6"/>} title="Código Inline" ariaLabel="Código inline"/>
              <IconBtn onClick={() => wrapBlock('pre')} icon={<Type className="w-6 h-6"/>} title="Bloco de Código" ariaLabel="Bloco de código"/>
              <IconBtn onClick={() => setImageDialogOpen(true)} icon={<ImageIcon className="w-6 h-6"/>} title="Imagem" ariaLabel="Inserir imagem"/>
              <IconBtn onClick={() => insertDivider()} icon={<Minus className="w-6 h-6"/>} title="Divisor" ariaLabel="Inserir divisor"/>
            </div>
            
            {/* Botão de Configurações */}
            <Button
              variant="outline"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="border border-gray-300 dark:border-emerald-500 text-gray-700 dark:text-emerald-300 hover:bg-gray-100 dark:hover:bg-emerald-600 hover:text-gray-900 dark:hover:text-white hover:border-gray-400 dark:hover:border-emerald-400 gap-2 shadow-lg transition-all duration-300 hover:shadow-emerald-500/25 hover:scale-105"
            >
              <Settings className="w-4 h-4" />
              Configurações
            </Button>
          </div>
          
          {/* Editor */}
          <div
            ref={editorRef}
            className="prose prose-gray dark:prose-invert max-w-none outline-none leading-relaxed text-lg min-h-[600px] focus:outline-none px-4 py-20 text-gray-900 dark:text-white"
            contentEditable
            suppressContentEditableWarning
            role="textbox"
            aria-multiline="true"
            spellCheck={true}
            onInput={onInput}
            onPaste={onPaste}
            onKeyDown={onKeyDown}
            data-placeholder="Comece a escrever…"
            style={{ whiteSpace: 'pre-wrap' }}
            dangerouslySetInnerHTML={{ __html: article?.content ? markdownToHtml(article.content) : '' }}
          />
        </div>

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
              className="fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 border-l border-gray-300 dark:border-gray-600 shadow-2xl z-50 transform transition-transform duration-300 ease-out"
              style={{
                transform: 'translateX(0)',
                animation: 'slideInFromRight 0.3s ease-out forwards'
              }}
            >
              <div className="p-6 h-full overflow-y-auto">
                {/* Header do sidebar */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Configurações do Artigo</h3>
                  <Button
                    variant="ghost"
                    onClick={() => setSidebarOpen(false)}
                    className="text-gray-500 dark:text-gray-400 hover:text-emerald-300 hover:bg-emerald-500/20 p-2 transition-all duration-300"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Seção Configurações */}
                <Card className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 mb-6 shadow-lg">
                  <CardHeader className="pb-4 bg-gray-100 dark:bg-gray-800">
                    <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">Configurações</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 bg-gray-50 dark:bg-gray-900">
                    {/* Autor */}
                    <div className="space-y-3">
                      <Label htmlFor="author" className="text-sm font-medium text-gray-700 dark:text-gray-300">Autor</Label>
                      <Input
                        id="author"
                        value={author}
                        onChange={(e) => { setAuthor(e.target.value); setDirty(true) }}
                        placeholder="Nome do autor..."
                        className="bg-white dark:bg-input-background border border-gray-300 dark:border-border text-gray-900 dark:text-foreground placeholder:text-gray-500 dark:placeholder:text-muted-foreground focus:border-emerald-500"
                      />
                    </div>

                        {/* Categoria */}
                        <div className="space-y-3">
                          <Label htmlFor="category" className="text-sm font-medium text-gray-700 dark:text-gray-300">Categoria</Label>
                          <select
                            id="category"
                            value={category}
                            onChange={(e) => { setCategory(e.target.value); setDirty(true) }}
                            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            style={{
                              backgroundColor: 'var(--background)',
                              color: 'var(--foreground)',
                              borderColor: 'var(--border)'
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
                        className="bg-white dark:bg-input-background border border-gray-300 dark:border-border text-gray-900 dark:text-foreground placeholder:text-gray-500 dark:placeholder:text-muted-foreground focus:border-emerald-500"
                      />
                    </div>

                    {/* URL da Imagem */}
                    <div className="space-y-3">
                      <Label htmlFor="image-url" className="text-sm font-medium text-gray-300">URL da Imagem</Label>
                      <div className="flex gap-2">
                        <Input
                          id="image-url"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          placeholder="https://..."
                          className="bg-white dark:bg-input-background border border-gray-300 dark:border-border text-gray-900 dark:text-foreground placeholder:text-gray-500 dark:placeholder:text-muted-foreground focus:border-emerald-500"
                        />
                        <Button
                          variant="outline"
                          onClick={() => setImageDialogOpen(true)}
                          className="border-gray-700 text-gray-300 hover:bg-gray-700"
                        >
                          <ImageIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Seção Status */}
                <Card className="bg-gray-900 border border-gray-700 shadow-lg">
                  <CardHeader className="pb-4 bg-gray-800">
                    <CardTitle className="text-base font-semibold text-white">Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 bg-gray-50 dark:bg-gray-900">
                    {/* Artigo em Destaque */}
                    <div className="flex items-center justify-between">
                      <Label htmlFor="featured" className="text-sm font-medium text-gray-300">Artigo em Destaque</Label>
                      <input
                        type="checkbox"
                        id="featured"
                        checked={article?.featured || false}
                        onChange={(e) => setDirty(true)}
                        className="w-4 h-4 text-emerald-600 bg-gray-700 border-gray-600 rounded focus:ring-emerald-500"
                      />
                    </div>

                    {/* Publicado */}
                    <div className="flex items-center justify-between">
                      <Label htmlFor="published" className="text-sm font-medium text-gray-300">Publicado</Label>
                      <input
                        type="checkbox"
                        id="published"
                        checked={article?.published || false}
                        onChange={(e) => setDirty(true)}
                        className="w-4 h-4 text-emerald-600 bg-gray-700 border-gray-600 rounded focus:ring-emerald-500"
                      />
                    </div>

                    {/* Informações de Status */}
                    <div className="space-y-2 pt-4 border-t border-gray-700">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Globe className="w-4 h-4" />
                        <span>{article?.published ? 'Publicado' : 'Rascunho'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>Tempo de leitura: {readTime} min</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Type className="w-4 h-4" />
                        <span>{words} palavras</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            </>
        )}

        {/* Slash menu */}
        {slashOpen && (
          <div ref={slashMenuRef} className="mt-2 w-full max-w-sm rounded-xl border border-border bg-card p-2 shadow-xl">
            <SlashItem icon={<Heading1 className="w-6 h-6"/>} label="Heading 1" onClick={() => { wrapBlock('h1'); setSlashOpen(false) }}/>
            <SlashItem icon={<Heading2 className="w-6 h-6"/>} label="Heading 2" onClick={() => { wrapBlock('h2'); setSlashOpen(false) }}/>
            <SlashItem icon={<List className="w-6 h-6"/>} label="Lista" onClick={() => { makeList(false); setSlashOpen(false) }}/>
            <SlashItem icon={<ListOrdered className="w-6 h-6"/>} label="Lista ordenada" onClick={() => { makeList(true); setSlashOpen(false) }}/>
            <SlashItem icon={<Quote className="w-6 h-6"/>} label="Citação" onClick={() => { wrapBlock('blockquote'); setSlashOpen(false) }}/>
            <SlashItem icon={<Code className="w-6 h-6"/>} label="Bloco de código" onClick={() => { wrapBlock('pre'); setSlashOpen(false) }}/>
            <SlashItem icon={<ImageIcon className="w-6 h-6"/>} label="Imagem" onClick={() => { setImageDialogOpen(true); setSlashOpen(false) }}/>
            <SlashItem icon={<Minus className="w-6 h-6"/>} label="Divisor" onClick={() => { insertDivider(); setSlashOpen(false) }}/>
          </div>
        )}

        {/* Rodapé */}
        <div className="mt-10 flex items-center justify-between text-sm text-white/60">
          <div className="flex items-center gap-2"><Clock className="w-6 h-6"/> {readTime} min • {words} palavras</div>
          <div className="flex items-center gap-2">
            {tags.map((t, i) => (<Badge key={i} className="bg-emerald-500/20 text-emerald-300">{t}</Badge>))}
          </div>
        </div>
      </main>

      {/* Dialog: inserir imagem por URL */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="bg-[#11161b] border border-gray-800 text-gray-100">
          <DialogHeader>
            <DialogTitle>Inserir imagem</DialogTitle>
            <DialogDescription>Informe uma URL ou cole uma imagem no editor.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="img-url">URL</Label>
            <Input id="img-url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://…" className="bg-input-background border-border"/>
            <div className="flex gap-2 justify-end mt-4">
              <Button variant="outline" className="border-border hover:bg-emerald-500/20 hover:text-emerald-300 hover:border-emerald-500 transition-all duration-300" onClick={() => setImageDialogOpen(false)}>Cancelar</Button>
              <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg transition-all duration-300 hover:shadow-emerald-500/25 hover:scale-105" onClick={() => { if (imageUrl.trim()) insertImage(imageUrl.trim()); setImageDialogOpen(false); setImageUrl('') }}>Inserir</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </>
  )
}

// ====== Componentes auxiliares ======
function IconBtn({ icon, onClick, title, ariaLabel }: { icon: React.ReactNode; onClick: () => void; title?: string; ariaLabel?: string }) {
  return (
    <button type="button" onClick={onClick} title={title} aria-label={ariaLabel || title} className="p-1.5 rounded-md hover:bg-emerald-500/20 text-white/90 hover:text-emerald-300 transition-all duration-300 hover:scale-110">
      {icon}
    </button>
  )
}

function SlashItem({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-emerald-500/20 text-left transition-all duration-300 hover:text-emerald-300">
      <span className="opacity-80">{icon}</span>
      <span>{label}</span>
    </button>
  )
}

// ====== Utils ======
function useDebouncedCallback(fn: () => void | Promise<void>, delay: number) {
  const t = useRef<NodeJS.Timeout | null>(null)
  const cb: any = (...args: any[]) => {
    if (t.current) clearTimeout(t.current)
    t.current = setTimeout(() => fn.apply(null, args), delay)
  }
  cb.flush = () => { if (t.current) { clearTimeout(t.current); t.current = null; fn() } }
  return cb
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
}

function stripHtml(html: string) {
  const tmp = document.createElement('div'); tmp.innerHTML = html; return (tmp.textContent || tmp.innerText || '')
}

function firstImageSrc(html: string): string | null {
  const div = document.createElement('div'); div.innerHTML = html; const img = div.querySelector('img'); return img?.getAttribute('src') || null
}

// Conversor simples de HTML para Markdown (cobre os elementos mais usados)
function htmlToMarkdown(html: string): string {
  let s = html
  s = s.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, (_, t) => `# ${clean(t)}\n\n`)
  s = s.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_, t) => `## ${clean(t)}\n\n`)
  s = s.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, t) => `> ${clean(t)}\n\n`)
  s = s.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, (_, t) => '```\n' + decode(t) + '\n```\n\n')
  s = s.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, (_, t) => '`' + decode(t) + '`')
  s = s.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, t) => t.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, li) => `- ${clean(li)}\n`) + '\n')
  s = s.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, t) => {
    const lis: string[] = [];
    let match;
    const regex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
    while ((match = regex.exec(t)) !== null) {
      lis.push(clean(match[1]));
    }
    return lis.map((li, idx) => `${idx + 1}. ${li}\n`).join('') + '\n';
  })
  s = s.replace(/<hr\s*\/?>/gi, '\n---\n')
  s = s.replace(/<figure[^>]*>[\s\S]*?<img[^>]*src=["']([^"']+)["'][\s\S]*?<\/figure>/gi, (_, src) => `![imagem](${src})\n\n`)
  s = s.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, t) => clean(t) + '\n\n')
  s = s.replace(/<br\s*\/?>(?!\n)/gi, '\n')
  return clean(s).trim()
}

function markdownToHtml(md: string): string {
  // renderização bem simples apenas para popular o editor quando vier markdown do backend
  let h = md

  // listas não ordenadas em bloco
  h = h.replace(/^(?:-\s.+\n?)+/gm, block => {
    const items = block.trim().split(/\n/).map(l => l.replace(/^-+\s*/, '').trim());
    return '<ul>' + items.map(i => `<li>${i}</li>`).join('') + '</ul>';
  });

  // listas ordenadas em bloco
  h = h.replace(/^(?:\d+\.\s.+\n?)+/gm, block => {
    const items = block.trim().split(/\n/).map(l => l.replace(/^\d+\.\s*/, '').trim());
    return '<ol>' + items.map(i => `<li>${i}</li>`).join('') + '</ol>';
  });

  h = h.replace(/^###\s(.+)$/gm, '<h3>$1</h3>')
  h = h.replace(/^##\s(.+)$/gm, '<h2>$1</h2>')
  h = h.replace(/^#\s(.+)$/gm, '<h1>$1</h1>')
  h = h.replace(/^>\s(.+)$/gm, '<blockquote>$1</blockquote>')
  h = h.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  h = h.replace(/\*(.+?)\*/g, '<em>$1</em>')
  h = h.replace(/`([^`]+)`/g, '<code>$1</code>')
  h = h.replace(/\n{2,}/g, '<p></p>')
  return h
}

function clean(s: string) { return s.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim() }
function decode(s: string) { const e = document.createElement('textarea'); e.innerHTML = s; return e.value }

function placeCaretAfter(node: Node) {
  const range = document.createRange();
  range.setStartAfter(node);
  range.collapse(true);
  const sel = window.getSelection();
  if (!sel) return;
  sel.removeAllRanges();
  sel.addRange(range);
}

// Sanitização básica para HTML do editor
function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'code', 'pre', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'blockquote', 'hr', 'figure', 'img', 'figcaption', 'a'],
    ALLOWED_ATTR: ['src', 'alt', 'href', 'title', 'class', 'contenteditable'],
    ALLOW_DATA_ATTR: false
  });
}
