'use client'

import { useRouter } from 'next/navigation'
import Button from './Button'
import NotificationBell from './NotificationBell'
import ModoToggle from './ModoToggle'
import PainelAcessibilidade from './PainelAcessibilidade'
import { UserIcon } from './icons'
import { limparSessao } from '@/lib/auth'
import { LOGO_DATA_URI } from '@/lib/logo'

export default function Header() {
  const router = useRouter()

  function sair() {
    limparSessao()
    router.push('/login')
  }

  return (
    <header
      style={{
        position: 'sticky', top: 0, zIndex: 100, display: 'flex', alignItems: 'center', padding: '0.875rem 1.5rem', gap: '1rem',
        background: 'var(--c-glass-bg)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--c-divider)',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={LOGO_DATA_URI} alt="Plura" style={{ height: '28px', width: 'auto', objectFit: 'contain' }} draggable={false} />
      <span className="label-mono" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--c-text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        área b2b
      </span>
      <div style={{ flex: 1 }} />
      <PainelAcessibilidade />
      <ModoToggle />
      <NotificationBell />
      <Button variant="ghost" size="sm" onClick={sair}>
        <UserIcon /> Sair
      </Button>
    </header>
  )
}
