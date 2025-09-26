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
          background-color: #13182F !important;
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
        className="border-gray-300 text-gray-600 hover:bg-gray-50 px-8 py-3"
      >
        <Share2 className="w-4 h-4 mr-2" />
        Compartilhar
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="share-modal-content bg-white border border-gray-200 text-gray-900 max-w-md shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">
              Compartilhar Artigo
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Escolha como deseja compartilhar "{article.title}"
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Opção 1: Copiar Link */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Link className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Compartilhar com Link</h3>
                  <p className="text-sm text-gray-600">Copie o link para compartilhar em qualquer lugar</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Input 
                  value={articleUrl} 
                  readOnly 
                  className="bg-gray-50 border-gray-200 text-gray-700"
                />
                <Button 
                  onClick={handleCopyLink}
                  className={`px-4 ${copied ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* Separador */}
            <div className="border-t border-gray-200"></div>

            {/* Opção 2: LinkedIn */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Linkedin className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Compartilhar no LinkedIn</h3>
                  <p className="text-sm text-gray-600">Redireciona para a página da IntelliGem no LinkedIn</p>
                </div>
              </div>
              
              <Button 
                onClick={handleLinkedInShare}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3"
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
