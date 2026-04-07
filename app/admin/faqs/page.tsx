'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Trash2, Search, Loader2, ChevronLeft, ChevronRight, Plus, Pencil } from 'lucide-react'
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog'

interface FAQ {
  id: string
  question?: string
  answer?: string
  metadata?: any
  payload?: {
    question?: string
    answer?: string
    metadata?: any
  }
}

function resolveFaqId(faq: Partial<FAQ> & Record<string, any>): string {
  const candidates = [
    faq.id,
    faq.payload?.id,
    faq._id,
    faq.point_id,
    faq.pointId,
    faq.metadata?.id,
    faq.metadata?._id,
    faq.metadata?.point_id,
    faq.metadata?.pointId,
    faq.payload?.metadata?.id,
    faq.payload?.metadata?._id,
    faq.payload?.metadata?.point_id,
    faq.payload?.metadata?.pointId,
  ]

  const resolved = candidates.find((value) => value !== undefined && value !== null && String(value).trim().length > 0)
  return resolved !== undefined && resolved !== null ? String(resolved).trim() : ''
}

function normalizeFaq(raw: any): FAQ {
  const payload = raw?.payload && typeof raw.payload === 'object' ? raw.payload : undefined
  return {
    ...raw,
    id: resolveFaqId(raw),
    question: raw?.question ?? payload?.question,
    answer: raw?.answer ?? payload?.answer,
    metadata: raw?.metadata ?? payload?.metadata,
    payload,
  }
}

export default function FAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  // Search mode: 'semantic' or 'id'
  const [idSearch, setIdSearch] = useState('')
  const [idLoading, setIdLoading] = useState(false)
  const [idResult, setIdResult] = useState<FAQ | null>(null)
  const [idError, setIdError] = useState('')

  // Pagination
  const [offsetHistory, setOffsetHistory] = useState<string[]>([''])
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0)
  const [nextOffset, setNextOffset] = useState<string | null>(null)
  const limit = 20
  const currentOffset = offsetHistory[currentHistoryIndex]

  // Add FAQ
  const [addQuestion, setAddQuestion] = useState('')
  const [addAnswer, setAddAnswer] = useState('')
  const [addError, setAddError] = useState('')
  const [adding, setAdding] = useState(false)
  const [addDialogOpen, setAddDialogOpen] = useState(false)

  // Edit FAQ
  const [editFaq, setEditFaq] = useState<FAQ | null>(null)
  const [editQuestion, setEditQuestion] = useState('')
  const [editAnswer, setEditAnswer] = useState('')
  const [editError, setEditError] = useState('')
  const [saving, setSaving] = useState(false)

  // Debounce semantic search
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
      if (searchTerm) {
        setOffsetHistory([''])
        setCurrentHistoryIndex(0)
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    // Don't fetch list when showing an ID result
    if (idResult) return

    const fetchFaqs = async () => {
      setLoading(true)
      try {
        const apiKey = localStorage.getItem('api_key') || ''
        let url = ''
        if (debouncedSearch.trim()) {
          url = `/api/vectorize/search?q=${encodeURIComponent(debouncedSearch.trim())}&top_k=20`
        } else {
          url = `/api/vectorize?limit=${limit}`
          if (currentOffset) url += `&offset=${currentOffset}`
        }
        const response = await fetch(url, { headers: { 'x-api-key': apiKey } })
        if (response.ok) {
          const data = await response.json()
          if (debouncedSearch.trim()) {
            setFaqs((data.results || []).map(normalizeFaq))
            setNextOffset(null)
          } else {
            setFaqs((data.items || []).map(normalizeFaq))
            setNextOffset(data.next_offset || null)
          }
        }
      } catch (error) {
        console.error('Error fetching FAQs:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchFaqs()
  }, [debouncedSearch, currentOffset, limit, idResult])

  const handleIdSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!idSearch.trim()) return
    setIdLoading(true)
    setIdError('')
    setIdResult(null)
    try {
      const apiKey = localStorage.getItem('api_key') || ''
      const response = await fetch(`/api/faqs/${idSearch.trim()}`, {
        headers: { 'x-api-key': apiKey }
      })
      if (response.ok) {
        const data = await response.json()
        const doc = data.data || data
        // Ensure id is always present (backend may omit it from payload)
        const normalized = normalizeFaq(doc)
        if (!normalized.id) normalized.id = idSearch.trim()
        setIdResult(normalized)
      } else {
        setIdError('Vector not found')
      }
    } catch {
      setIdError('Error fetching vector')
    } finally {
      setIdLoading(false)
    }
  }

  const clearIdSearch = () => {
    setIdSearch('')
    setIdResult(null)
    setIdError('')
  }

  const handleDelete = async (id: string) => {
    if (!id?.trim()) {
      console.error('Delete skipped: FAQ id is missing')
      return
    }
    setDeleting(id)
    try {
      const apiKey = localStorage.getItem('api_key') || ''
      const response = await fetch(`/api/faqs/${id}`, {
        method: 'DELETE',
        headers: { 'x-api-key': apiKey }
      })
      if (response.ok) {
        setFaqs(faqs.filter((f) => f.id !== id))
        if (idResult?.id === id) clearIdSearch()
      }
    } catch (error) {
      console.error('Error deleting FAQ:', error)
    } finally {
      setDeleting(null)
    }
  }

  const openEdit = (faq: FAQ) => {
    const normalized = normalizeFaq(faq)
    setEditFaq(normalized)
    setEditQuestion(normalized.question || normalized.payload?.question || '')
    setEditAnswer(normalized.answer || normalized.payload?.answer || '')
    setEditError('')
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setEditError('')
    if (!editFaq?.id?.trim()) {
      setEditError('Cannot update this FAQ because its ID is missing.')
      return
    }
    if (!editQuestion.trim() || !editAnswer.trim()) {
      setEditError('Question and Answer are required')
      return
    }
    setSaving(true)
    try {
      const apiKey = localStorage.getItem('api_key') || ''
      const response = await fetch(`/api/faqs/${editFaq.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
        body: JSON.stringify({ question: editQuestion, answer: editAnswer })
      })
      if (!response.ok) throw new Error('Failed to update')
      
      // Update in local list
      const updated = { ...editFaq, question: editQuestion, answer: editAnswer }
      setFaqs(faqs.map((f) => f.id === editFaq.id ? updated : f))
      if (idResult?.id === editFaq.id) setIdResult(updated)
      setEditFaq(null)
    } catch {
      setEditError('Failed to update FAQ. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleAddFaq = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddError('')
    if (!addQuestion.trim() || !addAnswer.trim()) {
      setAddError('Question and Answer are required')
      return
    }
    setAdding(true)
    try {
      const apiKey = localStorage.getItem('api_key') || ''
      const response = await fetch('/api/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
        body: JSON.stringify({ question: addQuestion, answer: addAnswer })
      })
      if (!response.ok) throw new Error('Failed to add FAQ')
      setAddQuestion('')
      setAddAnswer('')
      setAddDialogOpen(false)
      setOffsetHistory([''])
      setCurrentHistoryIndex(0)
    } catch {
      setAddError('Failed to create FAQ. Please try again.')
    } finally {
      setAdding(false)
    }
  }

  const handleNextPage = () => {
    if (nextOffset) {
      if (currentHistoryIndex === offsetHistory.length - 1) {
        setOffsetHistory([...offsetHistory, nextOffset])
      }
      setCurrentHistoryIndex(currentHistoryIndex + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentHistoryIndex > 0) setCurrentHistoryIndex(currentHistoryIndex - 1)
  }

  const renderFaqCard = (faq: FAQ, index: number) => {
    const faqId = resolveFaqId(faq)
    const question = faq.question || faq.payload?.question || 'Unknown Question'
    const answer = faq.answer || faq.payload?.answer || 'No answer provided'
    const rawMeta = faq.metadata || faq.payload?.metadata || {}
    const metadata = typeof rawMeta === 'string' ? rawMeta : (rawMeta.source || 'faq')

    return (
      <Card key={faq.id || `faq-${index}`} className="p-5 bg-card border-border hover:border-muted transition-colors group">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-foreground text-lg">{question}</h3>
                <span className="text-xs font-mono bg-muted text-muted-foreground px-2 py-1 rounded">{metadata}</span>
              </div>
              <p className="text-sm text-muted-foreground">{answer}</p>
            </div>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => openEdit(faq)}
                className="p-2 text-muted-foreground hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(faqId)}
                disabled={!faqId || deleting === faqId}
                className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
              >
                {deleting === faqId ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="pt-2 border-t border-border mt-1">
            <p className="text-xs font-mono text-muted-foreground/60 break-all">ID: {faqId || 'Missing ID'}</p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">FAQs</h1>
            <p className="text-muted-foreground mt-1">View, search and manage all FAQs in your vector database</p>
          </div>
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-accent hover:bg-accent/90">
                <Plus className="w-4 h-4 mr-2" /> Add New FAQ
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New FAQ</DialogTitle>
                <DialogDescription>Enter your question and answer. It will be vectorized and saved instantly.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddFaq} className="space-y-4 py-4">
                {addError && (
                  <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
                    <p className="text-sm text-destructive">{addError}</p>
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Question</label>
                  <Input placeholder="Enter question..." value={addQuestion} onChange={(e) => setAddQuestion(e.target.value)} disabled={adding} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Answer</label>
                  <Textarea placeholder="Enter answer..." value={addAnswer} onChange={(e) => setAddAnswer(e.target.value)} disabled={adding} rows={5} className="resize-none" />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setAddDialogOpen(false)} disabled={adding}>Cancel</Button>
                  <Button type="submit" disabled={adding} className="bg-accent hover:bg-accent/90">
                    {adding && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Save FAQ
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editFaq} onOpenChange={(open) => !open && setEditFaq(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit FAQ</DialogTitle>
            <DialogDescription>Update the question and answer below.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4 py-4">
            {editError && (
              <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
                <p className="text-sm text-destructive">{editError}</p>
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium">Question</label>
              <Input value={editQuestion} onChange={(e) => setEditQuestion(e.target.value)} disabled={saving} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Answer</label>
              <Textarea value={editAnswer} onChange={(e) => setEditAnswer(e.target.value)} disabled={saving} rows={5} className="resize-none" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditFaq(null)} disabled={saving}>Cancel</Button>
              <Button type="submit" disabled={saving} className="bg-accent hover:bg-accent/90">
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Update FAQ
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Search Bar Row */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Semantic search FAQs..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); clearIdSearch() }}
              className="pl-10 bg-card border-border"
            />
          </div>
          <form onSubmit={handleIdSearch} className="flex gap-2">
            <Input
              placeholder="Search by ID (UUID)..."
              value={idSearch}
              onChange={(e) => { setIdSearch(e.target.value); setSearchTerm('') }}
              className="bg-card border-border font-mono w-72"
              disabled={idLoading}
            />
            <Button type="submit" variant="outline" disabled={idLoading || !idSearch.trim()}>
              {idLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            </Button>
            {(idResult || idError) && (
              <Button type="button" variant="ghost" onClick={clearIdSearch}>Clear</Button>
            )}
          </form>
        </div>

        {/* ID Search Result */}
        {idError && (
          <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg mb-6">
            <p className="text-sm text-destructive">{idError}</p>
          </div>
        )}
        {idResult && (
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-3">Vector found by ID:</p>
            {renderFaqCard(idResult, 0)}
          </div>
        )}

        {/* List (only if no ID result) */}
        {!idResult && !idError && (
          <>
            {/* Pagination Header */}
            {!debouncedSearch.trim() && !loading && faqs.length > 0 && (
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">
                  Showing {currentHistoryIndex * limit + 1}–{currentHistoryIndex * limit + faqs.length}
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handlePrevPage} disabled={currentHistoryIndex === 0 || loading}>
                    <ChevronLeft className="w-4 h-4 mr-1" /> Prev
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleNextPage} disabled={!nextOffset || loading}>
                    Next <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}

            {/* FAQ List */}
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-accent animate-spin" />
              </div>
            ) : faqs.length === 0 ? (
              <Card className="p-12 text-center bg-card border-border">
                <p className="text-muted-foreground mb-4">No FAQs found</p>
                <Button variant="outline" onClick={() => setAddDialogOpen(true)}>Create your first FAQ</Button>
              </Card>
            ) : (
              <div className="grid gap-4">
                {faqs.map((faq, index) => renderFaqCard(faq, index))}
              </div>
            )}

            {/* Pagination Footer */}
            {!debouncedSearch.trim() && !loading && faqs.length > 0 && (
              <div className="flex justify-end mt-6 gap-2">
                <Button variant="outline" onClick={handlePrevPage} disabled={currentHistoryIndex === 0 || loading}>
                  <ChevronLeft className="w-4 h-4 mr-1" /> Previous Page
                </Button>
                <Button variant="outline" onClick={handleNextPage} disabled={!nextOffset || loading}>
                  Next Page <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
