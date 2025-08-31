'use client'
import type { Message } from '../types'

export default function MessageBubble({ m }: { m: Message }) {
  const isUser = m.role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} my-1`}>
      <div
        className={`max-w-[78%] px-4 py-2 rounded-2xl shadow-sm text-sm leading-relaxed whitespace-pre-wrap ${isUser ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-white text-gray-800 border rounded-bl-sm'}`}
        title={new Date(m.at).toLocaleString('id-ID')}
      >
        {m.text}
      </div>
    </div>
  )
}
