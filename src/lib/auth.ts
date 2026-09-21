'use client'

const TOKEN_KEY = 'plura_token'
const USER_KEY = 'plura_user'
const REFRESH_KEY = 'plura_refresh_token'

export function salvarSessao(auth: { access_token: string; refresh_token: string; user: { id: string; email?: string } }) {
  localStorage.setItem(TOKEN_KEY, auth.access_token)
  localStorage.setItem(USER_KEY, JSON.stringify(auth.user))
  localStorage.setItem(REFRESH_KEY, auth.refresh_token)
}

export function limparSessao() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  localStorage.removeItem(REFRESH_KEY)
}

export function estaLogado(): boolean {
  return typeof window !== 'undefined' && !!localStorage.getItem(TOKEN_KEY)
}

export function obterRefreshToken(): string | null {
  return typeof window !== 'undefined' ? localStorage.getItem(REFRESH_KEY) : null
}
