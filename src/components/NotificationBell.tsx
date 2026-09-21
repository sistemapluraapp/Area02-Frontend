'use client'

import { useEffect, useRef, useState } from 'react'
import GlassCard from './GlassCard'
import Button from './Button'
import { BellIcon } from './icons'
import { api, type Notificacao } from '@/lib/api'

export default function NotificationBell() {
  const [aberto, setAberto] = useState(false)
  const [naoLidas, setNaoLidas] = useState(0)
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([])
  const [carregando, setCarregando] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let ativo = true

    async function atualizarContagem() {
      try {
        const { total } = await api.contarNaoLidas()
        if (ativo) setNaoLidas(total)
      } catch {
        // contagem é best-effort, ignora falhas pontuais
      }
    }

    atualizarContagem()
    const intervalo = setInterval(atualizarContagem, 60000)
    return () => {
      ativo = false
      clearInterval(intervalo)
    }
  }, [])

  useEffect(() => {
    function handleClickFora(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setAberto(false)
      }
    }
    document.addEventListener('mousedown', handleClickFora)
    return () => document.removeEventListener('mousedown', handleClickFora)
  }, [])

  async function alternar() {
    const novoEstado = !aberto
    setAberto(novoEstado)
    if (!novoEstado) return

    setCarregando(true)
    try {
      const { notificacoes: itens } = await api.listarNotificacoes()
      setNotificacoes(itens)
    } catch {
      // painel fica vazio em caso de falha pontual
    } finally {
      setCarregando(false)
    }
  }

  async function marcarComoLida(notificacao: Notificacao) {
    if (notificacao.lida) return
    setNotificacoes((prev) => prev.map((n) => (n.id === notificacao.id ? { ...n, lida: true } : n)))
    setNaoLidas((n) => Math.max(0, n - 1))
    try {
      await api.marcarNotificacaoComoLida(notificacao.id)
    } catch {
      // ignora falha pontual, estado local já foi atualizado de forma otimista
    }
  }

  async function marcarTodasComoLidas() {
    setNotificacoes((prev) => prev.map((n) => ({ ...n, lida: true })))
    setNaoLidas(0)
    try {
      await api.marcarTodasNotificacoesComoLidas()
    } catch {
      // ignora falha pontual
    }
  }

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <button
        onClick={alternar}
        aria-label="Notificações"
        style={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '2.25rem',
          height: '2.25rem',
          borderRadius: '0.75rem',
          background: 'transparent',
          border: '1px solid var(--c-btn-ghost-border)',
          color: 'var(--c-btn-ghost-text)',
          cursor: 'pointer',
        }}
      >
        <BellIcon />
        {naoLidas > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-3px',
              right: '-3px',
              minWidth: '1.1rem',
              height: '1.1rem',
              padding: '0 0.25rem',
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: '#ffffff',
              fontSize: '0.625rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1,
              boxShadow: '0 0 0 2px var(--c-bg)',
            }}
          >
            {naoLidas > 99 ? '99+' : naoLidas}
          </span>
        )}
      </button>

      {aberto && (
        <GlassCard
          variant="lg"
          style={{
            position: 'absolute',
            top: 'calc(100% + 0.5rem)',
            right: 0,
            width: '320px',
            maxWidth: 'calc(100vw - 2rem)',
            maxHeight: '420px',
            overflowY: 'auto',
            padding: '0.75rem',
            zIndex: 200,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', gap: '0.5rem' }}>
            <span
              className="label-mono"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--c-text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}
            >
              Notificações
            </span>
            {notificacoes.some((n) => !n.lida) && (
              <Button variant="ghost" size="sm" onClick={marcarTodasComoLidas} style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}>
                Marcar todas como lidas
              </Button>
            )}
          </div>

          {carregando ? (
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--c-text-3)', padding: '0.5rem 0.25rem' }}>carregando…</p>
          ) : notificacoes.length === 0 ? (
            <p style={{ fontSize: '0.8125rem', color: 'var(--c-text-3)', padding: '0.5rem 0.25rem' }}>Nenhuma notificação por aqui.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {notificacoes.map((n) => (
                <div
                  key={n.id}
                  onClick={() => marcarComoLida(n)}
                  style={{
                    padding: '0.6rem 0.7rem',
                    borderRadius: '0.65rem',
                    background: n.lida ? 'var(--c-glass-bg-sm)' : 'var(--c-glass-bg-blue)',
                    border: n.lida ? '1px solid transparent' : 'var(--c-border-blue)',
                    cursor: n.lida ? 'default' : 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    {!n.lida && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--blue-500)', flexShrink: 0 }} />}
                    <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{n.titulo}</span>
                  </div>
                  <p
                    style={{
                      margin: '0.2rem 0 0',
                      fontSize: '0.8rem',
                      color: 'var(--c-text-2)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {n.corpo}
                  </p>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      )}
    </div>
  )
}
