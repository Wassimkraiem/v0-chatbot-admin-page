'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Loader2, Send } from 'lucide-react'

interface TestResult {
  question: string
  answer: string
  sourceChunks: Array<{
    id: string
    text: string
    similarity: number
  }>
  timestamp: string
}

export default function TestPage() {
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<TestResult | null>(null)

  const handleTest = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!question.trim()) {
      return
    }

    setLoading(true)

    try {
      const apiKey = localStorage.getItem('api_key') || ''
      const response = await fetch('/api/test', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        },
        body: JSON.stringify({ question })
      })

      if (response.ok) {
        const data = await response.json()
        setResult({
          question,
          answer: data.answer,
          sourceChunks: data.sourceChunks || [],
          timestamp: new Date().toLocaleTimeString(),
        })
        setQuestion('')
      } else {
        console.error('Failed to test chatbot')
      }
    } catch (error) {
      console.error('Error testing chatbot:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border p-6">
        <h1 className="text-3xl font-bold text-foreground">Test Chatbot</h1>
        <p className="text-muted-foreground mt-2">Test your chatbot responses and see which FAQs it uses</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl">
          {/* Input Section */}
          <Card className="lg:col-span-1 bg-card border-border h-fit sticky top-6">
            <div className="p-6 space-y-4">
              <h2 className="font-semibold text-foreground">Send a Test Question</h2>
              <form onSubmit={handleTest} className="space-y-4">
                <Input
                  placeholder="Ask a question..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  disabled={loading}
                  className="bg-muted border-border"
                />
                <Button
                  type="submit"
                  disabled={loading || !question.trim()}
                  className="w-full bg-accent hover:bg-accent/90"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Test
                    </>
                  )}
                </Button>
              </form>
              <div className="p-3 bg-muted/30 border border-border rounded-lg">
                <p className="text-xs text-muted-foreground">
                  Your question will be embedded and compared against the vector database to find relevant FAQs.
                </p>
              </div>
            </div>
          </Card>

          {/* Results Section */}
          <div className="lg:col-span-2 space-y-6">
            {result ? (
              <>
                {/* Chatbot Response */}
                <Card className="bg-card border-border">
                  <div className="p-6 space-y-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">QUESTION</p>
                      <p className="text-foreground font-medium">{result.question}</p>
                    </div>
                    <div className="h-px bg-border" />
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">CHATBOT RESPONSE</p>
                      <p className="text-foreground">{result.answer}</p>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <p className="text-xs text-muted-foreground/60">Tested at {result.timestamp}</p>
                    </div>
                  </div>
                </Card>

                {/* Source Chunks */}
                <div>
                  <h3 className="font-semibold text-foreground mb-3">
                    Source FAQs ({result.sourceChunks.length})
                  </h3>
                  <div className="space-y-3">
                    {result.sourceChunks.map((chunk, idx) => (
                      <Card key={chunk.id} className="bg-card border-border p-4">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded">
                                #{idx + 1}
                              </span>
                              <span className="text-xs text-muted-foreground/60">
                                Similarity: {(chunk.similarity * 100).toFixed(0)}%
                              </span>
                            </div>
                            <p className="text-sm text-foreground">{chunk.text}</p>
                          </div>
                          <div className="flex-shrink-0">
                            <div className="text-right">
                              <div className="text-lg font-semibold text-accent">
                                {(chunk.similarity * 100).toFixed(0)}%
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <Card className="bg-card border-border p-12 text-center h-64 flex flex-col items-center justify-center">
                <p className="text-muted-foreground mb-4">No test results yet</p>
                <p className="text-sm text-muted-foreground/60">
                  Send a test question to see how your chatbot responds
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
