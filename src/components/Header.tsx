'use client'

import { useRouter } from 'next/navigation'
import { IconLogout } from '@tabler/icons-react'
import Button from './Button'
import NotificationBell from './NotificationBell'
import ModoToggle from './ModoToggle'
import NavPrincipal from './NavPrincipal'
import PainelAcessibilidade from './PainelAcessibilidade'
import { limparSessao } from '@/lib/auth'
import { LOGO_DATA_URI } from '@/lib/logo'
import { urlArea01 } from '@/lib/area01'

export default function Header() {
  const router = useRouter()

  function sair() {
    limparSessao()
    router.push('/login')
  }

  return (
    <header
      style={{
        position: 'sticky', top: 0, zIndex: 100, display: 'flex', alignItems: 'center', flexWrap: 'wrap', padding: '0.75rem clamp(0.75rem, 3vw, 1.5rem)', columnGap: '0.75rem', rowGap: '0.5rem',
        background: 'var(--c-glass-bg)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--c-divider)',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={LOGO_DATA_URI} alt="Plura" style={{ height: '28px', width: 'auto', objectFit: 'contain' }} draggable={false} />
      <span className="label-mono" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--c-text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        área b2b
      </span>
      <NavPrincipal
        inicio={() => urlArea01('/')}
        minhaArea="/"
        agenda={() => urlArea01('/agenda')}
        voltarPara="/"
        notificacoes={<NotificationBell rotulo="Notificações" />}
      />
      <div style={{ flex: 1 }} />
      <PainelAcessibilidade />
      <ModoToggle />
      <Button variant="ghost" size="sm" onClick={sair}>
        <IconLogout size={16} aria-hidden /> Sair
      </Button>
    </header>
  )
}
