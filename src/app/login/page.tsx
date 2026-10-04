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
import { api, ApiError } from '@/lib/api'
import { salvarSessao } from '@/lib/auth'
import { destinoSeguro } from '@/lib/destino'
import { LOGO_DATA_URI } from '@/lib/logo'
import { useTituloPagina } from '@/lib/useTituloPagina'

const AREA01_URL = process.env.NEXT_PUBLIC_AREA01_URL ?? 'https://plura.app.br'

export default function LoginPage() {
  useTituloPagina('Área do empreendedor')
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  // Atalhos quando a conta é de outra área ou ainda não existe
  const [atalhos, setAtalhos] = useState<{ texto: string; link: string }[]>([])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      setErro('Preencha e-mail e senha')
      return
    }
    setLoading(true)
    setErro('')
    setAtalhos([])
    try {
      const auth = await api.login({ email: email.trim(), password })
      salvarSessao(auth)
      router.push(destinoSeguro(new URLSearchParams(window.location.search).get('destino')))
    } catch (err) {
      if (err instanceof ApiError && err.codigo === 'conta_gov') {
        setErro(err.message)
        setAtalhos([{ texto: 'Entrar na Plura Gov', link: err.link ?? 'https://gov.plura.app.br' }])
      } else {
        setErro('E-mail ou senha incorretos.')
        setAtalhos([
          { texto: 'Criar conta Plura', link: `${AREA01_URL}/signup` },
          { texto: 'Esqueci minha senha', link: '/esqueci-senha' },
        ])
      }
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
              {atalhos.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.5rem', marginTop: '0.625rem' }}>
                  {atalhos.map((a) => (
                    <a key={a.link} href={a.link} style={{ padding: '0.35rem 0.75rem', borderRadius: '9999px', border: '1px solid var(--c-danger-border)', color: 'inherit', fontWeight: 700, textDecoration: 'none', fontSize: '0.8125rem' }}>
                      {a.texto}
                    </a>
                  ))}
                </div>
              )}
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
              <div style={{ textAlign: 'right', marginTop: '-0.25rem' }}>
                <a href="/esqueci-senha" style={{ color: 'var(--c-text-blue)', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none' }}>Esqueci minha senha</a>
              </div>
              <Button type="submit" size="lg" loading={loading} style={{ width: '100%' }}>
                {loading ? 'Entrando…' : 'Entrar'}
              </Button>
            </div>
          </form>

          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--c-text-3)', marginTop: '1.5rem' }}>
            Não tem conta ainda?{' '}
            <a href={`${AREA01_URL}/signup`} style={{ color: 'var(--c-text-blue)', fontWeight: 600, textDecoration: 'none' }}>Crie sua conta Plura</a>{' '}
            e depois volte aqui para criar a página da sua empresa.
          </p>
        </GlassCard>
        <Footer />
      </div>
    </>
  )
}
