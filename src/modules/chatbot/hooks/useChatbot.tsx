'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { Message, Persona, QAItem } from '../types'
import { bestMatch } from '../lib/fuzzy'
import data from '../data/qa-id.json'

const STORAGE_KEY = 'chat_history_v1'
const PERSONA_KEY = 'chat_persona_v1'

export function useChatbot() {
  const qa: QAItem[] = useMemo(() => data as QAItem[], [])
  const [persona, setPersona] = useState<Persona | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      const saved = raw ? (JSON.parse(raw) as Message[]) : []
      setMessages(saved)
      const p = localStorage.getItem(PERSONA_KEY) as Persona | null
      if (p) setPersona(p)
    } catch (e) { console.warn(e) }
  }, [])

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages)) } catch {}
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    try { if (persona) localStorage.setItem(PERSONA_KEY, persona) } catch {}
  }, [persona])

  const reset = () => {
    setMessages([])
    setPersona(null)
    try {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(PERSONA_KEY)
    } catch {}
  }

  const greet = (p: Persona) => {
    setPersona(p)
    setMessages(prev => [
      ...prev,
      { id: crypto.randomUUID(), role: 'bot', at: Date.now(), text: `Halo, aku ${p}! Ada yang bisa kubantu hari ini?` }
    ])
  }

  const ask = (text: string) => {
    const q: Message = { id: crypto.randomUUID(), role: 'user', text, at: Date.now() }
    setMessages(prev => [...prev, q])

    const hit = bestMatch(text, qa, 0.48)
    const reply = hit ? hit.item.answer : 'Maaf, aku belum menemukan jawaban yang pas. Coba ubah pertanyaanmu atau berikan detail tambahan ya.'

    const a: Message = { id: crypto.randomUUID(), role: 'bot', text: reply, at: Date.now() }
    setTimeout(() => setMessages(prev => [...prev, a]), 350)
  }

  return { persona, messages, ask, greet, reset, bottomRef }
}
