'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { MessageSquare, Plus, TestTube2, MessageCircle, BookOpen } from 'lucide-react'

const navItems = [
  {
    label: 'FAQs',
    href: '/admin/faqs',
    icon: BookOpen,
    description: 'View and manage FAQs'
  },
  {
    label: 'Add FAQ',
    href: '/admin/add-faq',
    icon: Plus,
    description: 'Add new FAQ to vector DB'
  },
  {
    label: 'Test Chatbot',
    href: '/admin/test',
    icon: TestTube2,
    description: 'Test responses'
  },
  {
    label: 'Chat',
    href: '/admin/chat',
    icon: MessageCircle,
    description: 'Converse with chatbot'
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 border-r border-border bg-card flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h1 className="font-semibold text-foreground">ChatBot</h1>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-accent/10 text-accent font-medium'
                  : 'text-foreground hover:bg-muted/50'
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <p className="text-xs text-muted-foreground">v0.1.0</p>
      </div>
    </div>
  )
}
