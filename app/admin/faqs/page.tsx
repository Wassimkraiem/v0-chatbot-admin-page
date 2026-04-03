'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Trash2, Search, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface FAQ {
  id: string
  question: string
  answer: string
  createdAt: string
}

export default function FAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    // TODO: Replace with actual API call
    const mockFaqs: FAQ[] = [
      {
        id: '1',
        question: 'What is your pricing?',
        answer: 'Our pricing starts at $29/month for the basic plan and scales based on your needs.',
        createdAt: '2024-01-15'
      },
      {
        id: '2',
        question: 'Do you offer customer support?',
        answer: 'Yes, we offer 24/7 customer support through email, chat, and phone.',
        createdAt: '2024-01-14'
      },
      {
        id: '3',
        question: 'Can I cancel anytime?',
        answer: 'Yes, you can cancel your subscription at any time without any penalties.',
        createdAt: '2024-01-13'
      },
    ]
    setFaqs(mockFaqs)
    setLoading(false)
  }, [])

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = async (id: string) => {
    setDeleting(id)
    // TODO: Replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    setFaqs(faqs.filter((faq) => faq.id !== id))
    setDeleting(null)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground">FAQs</h1>
            <p className="text-muted-foreground mt-2">View and manage all FAQs in your vector database</p>
          </div>
          <Link href="/admin/add-faq">
            <Button className="bg-accent hover:bg-accent/90">Add New FAQ</Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Search */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search FAQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-card border-border"
          />
        </div>

        {/* FAQ List */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-accent animate-spin" />
          </div>
        ) : filteredFaqs.length === 0 ? (
          <Card className="p-12 text-center bg-card border-border">
            <p className="text-muted-foreground mb-4">No FAQs found</p>
            <Link href="/admin/add-faq">
              <Button variant="outline">Create your first FAQ</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredFaqs.map((faq) => (
              <Card key={faq.id} className="p-5 bg-card border-border hover:border-muted transition-colors group">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-2">{faq.question}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{faq.answer}</p>
                    <p className="text-xs text-muted-foreground/60">Added {faq.createdAt}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(faq.id)}
                    disabled={deleting === faq.id}
                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    {deleting === faq.id ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
