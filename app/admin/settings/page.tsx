'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Settings as SettingsIcon } from 'lucide-react'

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    // Load existing key on mount
    const existing = localStorage.getItem('api_key')
    if (existing) setApiKey(existing)
  }, [])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem('api_key', apiKey)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border p-6">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your admin dashboard configuration</p>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <Card className="bg-card border-border max-w-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <SettingsIcon className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">API Configuration</h2>
              <p className="text-sm text-muted-foreground">Set your backend API Key credentials</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium text-foreground mb-2">
                Bearer API Key
              </label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter your API Key..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="bg-muted border-border font-mono"
              />
              <p className="text-xs text-muted-foreground mt-2">
                This key is stored locally in your browser and sent securely to the proxy server to authenticate with the backend.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button 
                type="submit" 
                className="bg-accent hover:bg-accent/90 min-w-24"
              >
                {saved ? 'Saved!' : 'Save Key'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
