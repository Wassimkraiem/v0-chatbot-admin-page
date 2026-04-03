'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AddFAQPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!question.trim()) {
      setError('Question is required')
      return
    }

    if (!answer.trim()) {
      setError('Answer is required')
      return
    }

    setLoading(true)

    // TODO: Replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log('FAQ submitted:', { question, answer })
    
    setQuestion('')
    setAnswer('')
    setLoading(false)
    
    // Show success message and redirect
    router.push('/admin/faqs?success=true')
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border p-6">
        <Link href="/admin/faqs" className="inline-flex items-center gap-2 text-accent hover:text-accent/80 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to FAQs
        </Link>
        <h1 className="text-3xl font-bold text-foreground">Add New FAQ</h1>
        <p className="text-muted-foreground mt-2">Add a new Q&A pair to your vector database</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <Card className="bg-card border-border max-w-2xl">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Question Field */}
            <div>
              <label htmlFor="question" className="block text-sm font-medium text-foreground mb-2">
                Question
              </label>
              <Input
                id="question"
                placeholder="What is your most asked question?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                disabled={loading}
                className="bg-muted border-border"
              />
            </div>

            {/* Answer Field */}
            <div>
              <label htmlFor="answer" className="block text-sm font-medium text-foreground mb-2">
                Answer
              </label>
              <Textarea
                id="answer"
                placeholder="Provide a detailed answer..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={loading}
                rows={8}
                className="bg-muted border-border resize-none"
              />
            </div>

            {/* Info */}
            <div className="p-4 bg-muted/30 border border-border rounded-lg">
              <p className="text-sm text-muted-foreground">
                This Q&A pair will be embedded and stored in your vector database for semantic search and retrieval.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <Link href="/admin/faqs">
                <Button variant="outline" disabled={loading}>
                  Cancel
                </Button>
              </Link>
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-accent hover:bg-accent/90"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  'Add FAQ'
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
