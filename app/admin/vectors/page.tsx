'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Loader2, Database, ChevronLeft, ChevronRight } from 'lucide-react'

export default function VectorsPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [offsetHistory, setOffsetHistory] = useState<string[]>(['']) // Start with empty offset
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0)
  const [nextOffset, setNextOffset] = useState<string | null>(null)

  const limit = 20

  const currentOffset = offsetHistory[currentHistoryIndex]

  useEffect(() => {
    const fetchVectors = async () => {
      setLoading(true)
      setError('')
      try {
        const apiKey = localStorage.getItem('api_key') || ''
        let url = `/api/vectorize?limit=${limit}`
        if (currentOffset) {
          url += `&offset=${currentOffset}`
        }
        
        const response = await fetch(url, {
          headers: { 'x-api-key': apiKey }
        })
        
        if (response.ok) {
          const data = await response.json()
          setItems(data.items || [])
          setNextOffset(data.next_offset || null)
        } else {
          setError('Failed to fetch vectors')
        }
      } catch (err) {
         setError('An error occurred while fetching vectors')
      } finally {
        setLoading(false)
      }
    }
    fetchVectors()
  }, [currentOffset, limit])

  const handleNextPage = () => {
    if (nextOffset) {
      if (currentHistoryIndex === offsetHistory.length - 1) {
        setOffsetHistory([...offsetHistory, nextOffset])
      }
      setCurrentHistoryIndex(currentHistoryIndex + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentHistoryIndex > 0) {
      setCurrentHistoryIndex(currentHistoryIndex - 1)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border p-6 flex items-center gap-3">
         <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
            <Database className="w-6 h-6 text-accent" />
         </div>
         <div>
            <h1 className="text-3xl font-bold text-foreground">Vectors Database</h1>
            <p className="text-muted-foreground mt-1">Browse all vectorized document segments</p>
         </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg mb-6 max-w-4xl">
              <p className="text-sm text-destructive">{error}</p>
            </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-accent animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <Card className="p-12 text-center bg-card border-border max-w-4xl">
            <p className="text-muted-foreground">No vectors found</p>
          </Card>
        ) : (
          <div className="flex flex-col max-w-4xl">
            <div className="flex items-center justify-between mb-4">
               <span className="text-sm text-muted-foreground">
                 Showing vectors {currentHistoryIndex * limit + 1} to {currentHistoryIndex * limit + items.length}
               </span>
               <div className="flex gap-2">
                 <Button 
                   variant="outline" 
                   size="sm" 
                   onClick={handlePrevPage} 
                   disabled={currentHistoryIndex === 0 || loading}
                 >
                   <ChevronLeft className="w-4 h-4 mr-1" /> Prev
                 </Button>
                 <Button 
                   variant="outline" 
                   size="sm" 
                   onClick={handleNextPage} 
                   disabled={!nextOffset || loading}
                 >
                   Next <ChevronRight className="w-4 h-4 ml-1" />
                 </Button>
               </div>
            </div>

            <div className="grid gap-4">
              {items.map((item, index) => (
                <Card key={item.id || index} className="p-5 bg-card border-border">
                  <div className="mb-2 flex items-center justify-between">
                     <span className="text-xs font-mono text-muted-foreground/80 bg-muted px-2 py-1 rounded">ID: {item.id}</span>
                  </div>
                  <pre className="text-sm font-mono whitespace-pre-wrap break-all text-foreground mt-3 p-3 bg-muted/40 rounded-lg border border-border">
                    {JSON.stringify(item.payload, null, 2)}
                  </pre>
                </Card>
              ))}
            </div>
            
            <div className="flex items-center justify-end mt-6 gap-2">
                 <Button 
                   variant="outline" 
                   onClick={handlePrevPage} 
                   disabled={currentHistoryIndex === 0 || loading}
                 >
                   <ChevronLeft className="w-4 h-4 mr-1" /> Previous Page
                 </Button>
                 <Button 
                   variant="outline" 
                   onClick={handleNextPage} 
                   disabled={!nextOffset || loading}
                 >
                   Next Page <ChevronRight className="w-4 h-4 ml-1" />
                 </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
