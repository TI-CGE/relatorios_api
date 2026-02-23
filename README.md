# CGE – API de Relatórios em PDF

Microserviço em Bun que gera PDF de solicitações a partir do banco MySQL. Um único endpoint, autenticação por token e chamada à procedure `sp_get_manifestacao_por_solicitacao`.

## Variáveis de ambiente

Copie `.env.example` para `.env` e preencha:

- `API_TOKEN` – token fixo para autorizar as requisições
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` – conexão MySQL

## Execução local

```bash
bun install
bun run dev
```

## Docker

Build:

```bash
docker build -t relatorios-api .
```

Execução (porta 3333, env em arquivo):

```bash
docker run -p 3333:3333 --env-file .env relatorios-api
```

Ou passando variáveis:

```bash
docker run -p 3333:3333 \
  -e API_TOKEN=seu-token \
  -e DB_HOST=host \
  -e DB_PORT=3306 \
  -e DB_USER=user \
  -e DB_PASSWORD=pass \
  -e DB_NAME=esic \
  relatorios-api
```

A API usa a variável `PORT` (padrão 3333) dentro do container.

## Endpoints

- `GET /health` – health check (sem autenticação)
- `GET /relatorio?idSolicitacao=<id>` – gera PDF (requer header `Authorization: Bearer <API_TOKEN>` ou `x-api-key: <API_TOKEN>`)
- `POST /relatorio` – body `{ "idSolicitacao": <id> }` – gera PDF (mesma autenticação)

## Teste com dados mockados

```bash
bun run test:pdf
```

Gera `relatorio-mock.pdf` na raiz do projeto.
