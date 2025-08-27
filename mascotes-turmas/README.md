# Mascotes por Turma (Next.js + Tailwind)

## Rodando no GitHub Codespaces
1. Crie um repositório e suba estes arquivos.
2. Clique em **Code → Create codespace on main**.
3. O Codespace abrirá com Node 20. O `.devcontainer` instala dependências automaticamente (ou rode `npm install`).
4. Execute `npm run dev` e abra a porta **3000** (Forwarded Ports → Open in Browser).

## Deploy na Vercel
1. Faça login em https://vercel.com e clique em **Add New → Project**.
2. Importe seu repositório GitHub.
3. A Vercel detecta **Next.js** automaticamente. Build: `npm run build`. Install: `npm install`.
4. Deploy. Após concluir, acesse a URL gerada.

## Observações
- Não há variáveis de ambiente obrigatórias.
- O componente usa `localStorage`, por isso a página importa com `ssr: false`.
- Para resetar escolhas, limpe o `localStorage` no browser (`Application → Local Storage`).