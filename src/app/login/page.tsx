'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import GlassCard from '@/components/GlassCard'
import Input from '@/components/Input'
import Button from '@/components/Button'
import Grain from '@/components/Grain'
import AcessoRapido from '@/components/AcessoRapido'
import Footer from '@/components/Footer'
import { EmailIcon, LockIcon, EyeIcon } from '@/components/icons'
import { api } from '@/lib/api'
import { salvarSessao } from '@/lib/auth'
import { destinoSeguro } from '@/lib/destino'
import { LOGO_DATA_URI } from '@/lib/logo'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      setErro('Preencha e-mail e senha')
      return
    }
    setLoading(true)
    setErro('')
    try {
      const auth = await api.login({ email: email.trim(), password })
      salvarSessao(auth)
      router.push(destinoSeguro(new URLSearchParams(window.location.search).get('destino')))
    } catch {
      setErro('E-mail ou senha incorretos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Grain />
      <AcessoRapido />
      <div id="conteudo" tabIndex={-1} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', position: 'relative', zIndex: 1 }}>
        <GlassCard variant="lg" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem 2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_DATA_URI} alt="Plura" style={{ height: '48px', width: 'auto', objectFit: 'contain' }} draggable={false} />
          </div>

          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.625rem', fontWeight: 800, letterSpacing: '-0.035em', marginBottom: '0.375rem' }}>Área do empreendedor</h1>
            <p style={{ fontSize: '0.9375rem', color: 'var(--c-text-2)' }}>Entre com a mesma conta Plura para gerenciar suas Páginas</p>
          </div>

          {erro && (
            <div style={{ marginBottom: '1rem', padding: '0.75rem 1rem', borderRadius: '0.75rem', background: 'var(--c-danger-soft)', border: '1px solid var(--c-danger-border)', fontSize: '0.875rem', color: 'var(--c-danger-text)', textAlign: 'center' }}>
              {erro}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
              <Input label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} leadingIcon={<EmailIcon />} />
              <Input
                label="Senha"
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leadingIcon={<LockIcon />}
                trailingIcon={
                  <button type="button" onClick={() => setShowPass((v) => !v)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', color: 'inherit' }}>
                    <EyeIcon off={showPass} />
                  </button>
                }
              />
              <Button type="submit" size="lg" loading={loading} style={{ width: '100%' }}>
                {loading ? 'Entrando…' : 'Entrar'}
              </Button>
            </div>
          </form>

          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--c-text-3)', marginTop: '1.5rem' }}>
            Não tem conta ainda? Crie a sua na Área 01 (usuário) antes de criar uma Página.
          </p>
        </GlassCard>
        <Footer />
      </div>
    </>
  )
}
