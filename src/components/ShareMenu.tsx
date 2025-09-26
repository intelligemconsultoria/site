import React, { useState } from 'react'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Share2, Link, Linkedin, Copy, Check } from 'lucide-react'
import { toast } from 'sonner'

interface ShareMenuProps {
  article: {
    title: string
    slug: string
    excerpt?: string
    author?: string
  }
  articleUrl: string
}

export function ShareMenu({ article, articleUrl }: ShareMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(articleUrl)
      setCopied(true)
      toast.success('Link copiado para a área de transferência!')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error('Erro ao copiar link')
    }
  }

  const handleLinkedInShare = () => {
    // URL da página da empresa IntelliGem no LinkedIn
    const intelligemLinkedIn = 'https://www.linkedin.com/company/108613157'
    
    // Criar texto sugerido para o artigo
    const suggestedText = `Acabei de ler este artigo interessante da IntelliGem: "${article.title}"\n\n${article.excerpt || ''}\n\nLeia mais em: ${articleUrl}`
    
    // Abrir a página da empresa no LinkedIn para compartilhar como artigo
    const linkedinUrl = `${intelligemLinkedIn}?text=${encodeURIComponent(suggestedText)}`
    window.open(linkedinUrl, '_blank', 'width=800,height=600')
    setIsOpen(false)
    toast.success('Redirecionando para a página da IntelliGem no LinkedIn...')
  }

  return (
    <>
      <style>{`
        .share-modal-content {
          background-color: var(--popover) !important;
          opacity: 1 !important;
          backdrop-filter: none !important;
        }
        .share-modal-overlay {
          background-color: rgba(0, 0, 0, 0.5) !important;
          backdrop-filter: none !important;
        }
      `}</style>
      
      <Button 
        variant="outline" 
        onClick={() => setIsOpen(true)}
        className="border-border text-foreground/80 hover:bg-muted px-8 py-3"
      >
        <Share2 className="w-4 h-4 mr-2" />
        Compartilhar
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="share-modal-content bg-popover border border-border text-popover-foreground max-w-md shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-popover-foreground">
              Compartilhar Artigo
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Escolha como deseja compartilhar "{article.title}"
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Opção 1: Copiar Link */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Link className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-popover-foreground">Compartilhar com Link</h3>
                  <p className="text-sm text-muted-foreground">Copie o link para compartilhar em qualquer lugar</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Input 
                  value={articleUrl} 
                  readOnly 
                  className="bg-input-background border-border text-foreground"
                />
                <Button 
                  onClick={handleCopyLink}
                  className={`px-4 ${copied ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-primary hover:bg-primary/90'}`}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* Separador */}
            <div className="border-t border-border"></div>

            {/* Opção 2: LinkedIn */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <Linkedin className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-popover-foreground">Compartilhar no LinkedIn</h3>
                  <p className="text-sm text-muted-foreground">Redireciona para a página da IntelliGem no LinkedIn</p>
                </div>
              </div>
              
              <Button 
                onClick={handleLinkedInShare}
                className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground py-3"
              >
                <Linkedin className="w-4 h-4 mr-2" />
                Ir para LinkedIn
              </Button>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-200">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="px-6"
            >
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
