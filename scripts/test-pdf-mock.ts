import { writeFileSync } from "fs";
import { join } from "path";
import type { LinhaRelatorio } from "../src/services/relatorio";
import { buildPdf } from "../src/pdf/builder";

const mockRows: LinhaRelatorio[] = [
  {
    protocolo: "45888/26-4",
    Solicitante: "VALDIRENE VITOR DOS SANTOS",
    Tema: "Outros",
    Assunto: "Cirurgia de Hérnia",
    OrgaoEntidade: "SES - Secretaria de Estado da Saúde",
    TipoManifestacao: "Solicitação",
    Status: "Tramitando",
    DataInicial: "2026-02-23 14:36:33",
    DataLimite: "2026-03-25",
    dataMensagem: "2026-02-23 14:36:33",
    textoMensagem: `Manifestação:
VALDIRENE VITOR DOS SANTOS - 23/02/2026 14:36
Recebemos manifestação presencialmente neste departamento de ouvidoria do SUS/SES Sergipe, cujo teor segue transcrito na íntegra:

"Venho por meio desta ouvidoria, solicitar informação se há alguma previsão para minha cirurgia de hérnia que esta pendente no sistema. Solicito urgência. Portadora do cns: (702.9005.8085.9471).

Agradeço desde já pela atenção e fico no aguardo de um retorno."`,
    idUsuario: 38491,
    nome: "VALDIRENE VITOR DOS SANTOS",
    idMensagem: 333618,
  },
  {
    protocolo: "45888/26-4",
    Solicitante: "VALDIRENE VITOR DOS SANTOS",
    Tema: "Outros",
    Assunto: "Cirurgia de Hérnia",
    OrgaoEntidade: "SES - Secretaria de Estado da Saúde",
    TipoManifestacao: "Solicitação",
    Status: "Tramitando",
    DataInicial: "2026-02-23 14:36:33",
    DataLimite: "2026-03-25",
    dataMensagem: "2026-02-23 14:36:47",
    textoMensagem: `Histórico:
Sistema - 23/02/2026 14:36:47
Manifestação 45888/26-4 foi visualizada por Jéssica Menezes Souza.`,
    idUsuario: 2,
    nome: "Sistema",
    idMensagem: 333619,
  },
  {
    protocolo: "45888/26-4",
    Solicitante: "VALDIRENE VITOR DOS SANTOS",
    Tema: "Outros",
    Assunto: "Cirurgia de Hérnia",
    OrgaoEntidade: "SES - Secretaria de Estado da Saúde",
    TipoManifestacao: "Solicitação",
    Status: "Tramitando",
    DataInicial: "2026-02-23 14:36:33",
    DataLimite: "2026-03-25",
    dataMensagem: "2026-02-23 14:36:33",
    textoMensagem: `Histórico:
Sistema - 23/02/2026 14:36:33
Manifestação 45888/26-4 foi recebida no sistema da entidade Secretaria de Estado da Saúde.`,
    idUsuario: 2,
    nome: "Sistema",
    idMensagem: 333617,
  },
];

const outPath = join(process.cwd(), "relatorio-mock.pdf");

const buffer = await buildPdf(mockRows);
writeFileSync(outPath, buffer);
console.log("PDF gerado:", outPath);
