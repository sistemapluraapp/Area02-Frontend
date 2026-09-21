'use client'

const TOKEN_KEY = 'plura_token'
const USER_KEY = 'plura_user'

export function salvarSessao(auth: { access_token: string; user: { id: string; email?: string } }) {
  localStorage.setItem(TOKEN_KEY, auth.access_token)
  localStorage.setItem(USER_KEY, JSON.stringify(auth.user))
}

export function limparSessao() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function estaLogado(): boolean {
  return typeof window !== 'undefined' && !!localStorage.getItem(TOKEN_KEY)
}
