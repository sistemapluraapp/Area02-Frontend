import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Plura — Área 02',
  description: 'Painel B2B de empreendimentos — Plura',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
