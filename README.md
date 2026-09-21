# Area02-Frontend

Frontend da Área 02 (B2B — Empreendimentos) da Plura — Next.js (export estático) em Cloudflare Pages.

Referência de UI/UX: repositório de prototipação `marcosoliveiramaster/plura`
(telas de criação/perfil de empresa), reimplementadas aqui consumindo o
backend desta área (Hono/Workers).

## Deploy
O workflow `.github/workflows/deploy.yml` publica em Cloudflare Pages a cada push.
Precisa dos secrets do repositório: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`.
