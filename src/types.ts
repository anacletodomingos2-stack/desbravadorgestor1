export interface InvestiduraClass {
  classe: string;
  data: string;
  nome?: string;
  dataConclusao?: string;
}

export interface Member {
  id: string;
  foto?: string;
  nomeCompleto: string;
  dataNascimento: string;
  sexo: "M" | "F" | "";
  telefone: string;
  endereco: string;
  bairro: string;
  municipio: string;
  provincia: string;
  escola: string;
  classeEscolar?: string;
  igreja: string;
  distrito: string;
  regiao: string;
  cedula: string;
  nomeEncarregado1: string;
  nomeEncarregado2: string;
  nomePai?: string;
  nomeMae?: string;
  contatoPai: string;
  contatoMae: string;
  email: string;
  classe: string;
  unidade: string;
  cargo: string;
  dataEntrada: string;
  ativo: boolean;
  observacoes: string;
  membroBaptizado: boolean;
  numeroBaptismo: string;
  dataBaptismo: string;
  classeAtual: string;
  dataInvestidura: string;
  classesAnteriores: InvestiduraClass[];
  numeroIdentificacao: string;
}

export interface AuditRecord {
  id: string;
  date: string;
  user: string;
  operation: "CREATE" | "UPDATE" | "STATUS" | "DELETE" | string;
  entity: string;
  entityId: string;
  previousValueJson?: string;
  newValueJson?: string;
  origin: string;
}

export type NavPage = "dashboard" | "membros" | "cadastrar" | "editar" | "detalhe" | "relatorios" | "auditoria";
