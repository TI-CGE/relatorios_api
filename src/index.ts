import { isAuthorized, unauthorizedResponse } from "./middleware/auth";
import { buscarDadosRelatorio } from "./services/relatorio";
import { buildPdf } from "./pdf/builder";

const PORT = parseInt(process.env.PORT ?? "3333", 10);

function parseIdSolicitacao(value: string | null): number | null {
  if (value == null || value === "") return null;
  const n = parseInt(value, 10);
  if (Number.isNaN(n) || n < 1) return null;
  return n;
}

function jsonResponse(obj: object, status: number): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function handleRelatorio(req: Request): Promise<Response> {
  const url = new URL(req.url);
  let idSolicitacao: number | null = null;
  if (req.method === "GET") {
    idSolicitacao = parseIdSolicitacao(url.searchParams.get("idSolicitacao"));
  } else if (req.method === "POST") {
    try {
      const body = (await req.json()) as { idSolicitacao?: number | string };
      const v = body?.idSolicitacao;
      if (typeof v === "number") idSolicitacao = Number.isNaN(v) ? null : v;
      else if (typeof v === "string") idSolicitacao = parseIdSolicitacao(v);
    } catch {
      return jsonResponse({ error: "idSolicitacao inválido ou ausente" }, 400);
    }
  }
  if (idSolicitacao == null) {
    return jsonResponse({ error: "idSolicitacao ausente ou inválido" }, 400);
  }

  let rows;
  try {
    rows = await buscarDadosRelatorio(idSolicitacao);
  } catch (err) {
    console.error(err);
    return jsonResponse({ error: "Erro ao buscar dados" }, 500);
  }

  if (rows.length === 0) {
    return jsonResponse({ error: "Solicitação não encontrada" }, 404);
  }

  let pdfBuffer: Buffer;
  try {
    pdfBuffer = await buildPdf(rows);
  } catch (err) {
    console.error(err);
    return jsonResponse({ error: "Erro ao gerar PDF" }, 500);
  }

  const protocolo = rows[0].protocolo || "relatorio";
  const filename = `relatorio-${protocolo}.pdf`;
  return new Response(pdfBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}

const config = {
  async fetch(req: Request) {
    const url = new URL(req.url);
    if (url.pathname === "/health") {
      return new Response(JSON.stringify({ status: "ok" }), {
        headers: { "Content-Type": "application/json" },
      });
    }
    if (url.pathname !== "/relatorio") {
      return jsonResponse({ error: "Not found" }, 404);
    }
    if (req.method !== "GET" && req.method !== "POST") {
      return jsonResponse({ error: "Method not allowed" }, 405);
    }
    if (!isAuthorized(req)) {
      return unauthorizedResponse();
    }
    return handleRelatorio(req);
  },
  error(error: Error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  },
};

let server: ReturnType<typeof Bun.serve> | undefined;
for (let p = PORT; p < PORT + 10; p++) {
  try {
    server = Bun.serve({ ...config, port: p });
    break;
  } catch (e: unknown) {
    const err = e as { code?: string };
    if (err?.code === "EADDRINUSE") continue;
    throw e;
  }
}
if (!server) throw new Error("Nenhuma porta disponível entre " + PORT + " e " + (PORT + 9));

console.log(`Servidor em http://localhost:${server.port}`);
