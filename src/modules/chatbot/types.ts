export type Role = 'user' | 'bot'

export interface Message {
  id: string
  role: Role
  text: string
  at: number
}

export interface QAItem {
  question: string
  answer: string
  tags?: string[]
}

export type Persona = 'Bina' | 'Kina'
