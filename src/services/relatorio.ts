import { pool } from "../db/client";

export interface LinhaRelatorio {
  protocolo: string;
  Solicitante: string;
  Tema: string;
  Assunto: string;
  OrgaoEntidade: string;
  TipoManifestacao: string;
  Status: string;
  DataInicial: Date | string;
  DataLimite: Date | string;
  dataMensagem: Date | string;
  textoMensagem: string | null;
  idUsuario: number;
  nome: string;
  idMensagem: number;
}

function toDateOrString(v: unknown): Date | string {
  if (v instanceof Date) return v;
  if (v == null) return "";
  return String(v);
}

function mapRow(r: Record<string, unknown>): LinhaRelatorio {
  return {
    protocolo: String(r?.protocolo ?? ""),
    Solicitante: String(r?.Solicitante ?? ""),
    Tema: String(r?.Tema ?? ""),
    Assunto: String(r?.Assunto ?? ""),
    OrgaoEntidade: String(r?.OrgaoEntidade ?? ""),
    TipoManifestacao: String(r?.TipoManifestacao ?? ""),
    Status: String(r?.Status ?? ""),
    DataInicial: toDateOrString(r?.DataInicial),
    DataLimite: toDateOrString(r?.DataLimite),
    dataMensagem: toDateOrString(r?.dataMensagem),
    textoMensagem: r?.textoMensagem != null ? String(r.textoMensagem) : null,
    idUsuario: Number(r?.idUsuario ?? 0),
    nome: String(r?.nome ?? ""),
    idMensagem: Number(r?.idMensagem ?? 0),
  };
}

export async function buscarDadosRelatorio(
  idSolicitacao: number
): Promise<LinhaRelatorio[]> {
  const [result] = await pool.execute("CALL sp_get_manifestacao_por_solicitacao(?)", [idSolicitacao]);
  const firstSet = Array.isArray(result) && result.length > 0 && Array.isArray(result[0]) ? result[0] : result;
  const arr = Array.isArray(firstSet) ? firstSet : [];
  return (arr as Record<string, unknown>[]).map(mapRow);
}
