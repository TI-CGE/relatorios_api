import PDFDocument from "pdfkit";
import type { LinhaRelatorio } from "../services/relatorio";

const MARGIN = 48;
const SECTION_SIZE = 11;
const BODY_SIZE = 10;
const BG = "#f5f6f8";
const TEXT = "#1a1d21";
const MUTED = "#5c6370";
const ACCENT = "#0d9488";
const ACCENT_SEC = "#2563eb";
const FOOTER_MARGIN = 52;

function formatDateShort(v: Date | string): string {
  if (v instanceof Date) return v.toLocaleDateString("pt-BR");
  if (typeof v === "string") {
    const d = new Date(v);
    return isNaN(d.getTime()) ? v : d.toLocaleDateString("pt-BR");
  }
  return String(v);
}

function collectBuffer(doc: InstanceType<typeof PDFDocument>): Promise<Buffer> {
  const chunks: Buffer[] = [];
  return new Promise((resolve, reject) => {
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });
}

export async function buildPdf(rows: LinhaRelatorio[]): Promise<Buffer> {
  const doc = new PDFDocument({ margin: MARGIN, size: "A4", autoFirstPage: true });
  const bufferPromise = collectBuffer(doc);

  doc.rect(0, 0, doc.page.width, doc.page.height).fill(BG);

  if (rows.length === 0) {
    doc.fillColor(TEXT).fontSize(BODY_SIZE).text("Nenhum dado encontrado.");
    doc.end();
    return bufferPromise;
  }

  const first = rows[0];
  const contentWidth = doc.page.width - 2 * MARGIN;
  const pageHeight = doc.page.height;
  const maxY = pageHeight - FOOTER_MARGIN;
  let y = MARGIN;

  doc.fillColor(ACCENT).font("Helvetica-Bold").fontSize(SECTION_SIZE).text("DADOS DA SOLICITAÇÃO", MARGIN, y, { width: contentWidth });
  y = doc.y + 14;
  doc.strokeColor(ACCENT).lineWidth(0.8).moveTo(MARGIN, y).lineTo(MARGIN + 120, y).stroke();
  y += 12;

  const fields: [string, string][] = [
    ["Protocolo", first.protocolo],
    ["Solicitante", first.Solicitante],
    ["Tema", first.Tema],
    ["Assunto", first.Assunto],
    ["Órgão / Entidade", first.OrgaoEntidade],
    ["Tipo de manifestação", first.TipoManifestacao],
    ["Status", first.Status],
    ["Data Inicial", formatDateShort(first.DataInicial)],
    ["Data Limite", formatDateShort(first.DataLimite)],
  ];

  for (const [label, value] of fields) {
    doc.fillColor(MUTED).font("Helvetica").fontSize(BODY_SIZE).text(label + " ", MARGIN, y, { continued: true, width: contentWidth });
    doc.fillColor(TEXT).text(value);
    y = doc.y + 8;
  }

  y += 16;
  doc.fillColor(ACCENT_SEC).font("Helvetica-Bold").fontSize(SECTION_SIZE).text("MENSAGENS / HISTÓRICO", MARGIN, y, { width: contentWidth });
  y = doc.y + 14;
  doc.strokeColor(ACCENT_SEC).lineWidth(0.8).moveTo(MARGIN, y).lineTo(MARGIN + 140, y).stroke();
  y += 14;

  for (const row of rows) {
    if (y >= maxY) break;
    const texto = row.textoMensagem ?? "";
    const availableHeight = maxY - y;
    doc.fillColor(TEXT).font("Helvetica").fontSize(BODY_SIZE).text(texto, MARGIN, y, {
      align: "left",
      lineGap: 4,
      width: contentWidth,
      height: availableHeight,
    });
    y = doc.y + 12;
  }

  const footerY = pageHeight - 36;
  doc.strokeColor(ACCENT).lineWidth(0.5).moveTo(MARGIN, footerY).lineTo(doc.page.width - MARGIN, footerY).stroke();
  doc.fillColor(MUTED).fontSize(9).text("1", 0, pageHeight - 28, { align: "center", width: doc.page.width });
  doc.end();
  return bufferPromise;
}
