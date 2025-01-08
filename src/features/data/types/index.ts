import { RowDataPacket } from "mysql2";

// Tipos para contactos

export interface MessageTemplate {
  id: number;
  mainid: number;
  mensagem: string;
}

export interface ContactUpdate {
  numero: string;
  saldo: number;
  mainid: string;
}

// Tipos para usuarios
export interface User {
  id: number;
  login: string;
  senha: string;
  permissao: number;
  status: string;
  expirado: number;
}

export interface UserProfile {
  id: number;
  login: string;
  permissao: number;
  status: string;
  expirado: number;
  img?: string;
  bonus?: number;
  bonus_pix?: number;
  token?: string;
  lastLogin: string;
}

// Tipos para textos
export interface Texto extends RowDataPacket {
  id: number;
  texto_titulo: string;
  texto_info: string;
  texto_contas: string;
  texto_suporte: string;
  mainid: number;
}

export interface TextoInput {
  texto_titulo: string;
  texto_info: string;
  texto_contas: string;
  texto_suporte: string;
  mainid: number;
}

export interface Gift {
  id: number;
  mainid: number;
  valor: number;
  numero: string;
  codigo: string;
  resgatado: number;
  created_at?: string;
}


export interface Category {
  id: number;
  nome: string;
  mainid: number;
  valor: number;
  descricao: string;
  status: number;
  img: string;
  tipo: string;
}

export interface Product {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  descricao: any;
  id: number;
  categoria: number;
  mainid: number;
  dados: string;
  tipoConta: string;
  produto: string;
  disponivel: number;
  email: string;
  senha: string;
  dono: string;
  cc: string;
  gg: string;
  tipo: string;
}

export interface Contact extends RowDataPacket {
  id: number;
  numero: string;
  nome: string;
  foto: string | null;
  mainid: number;
  saldo: string | number;
  saldoadd: string | null;
  bloqueado: number;
  comprando: number;
  total_purchases?: number;
  total_spent?: number;
}

export interface Store {
  id: number;
  numero: string;
  mainid: number;
  texto: string;
  id_produto: string;
  data: Date;
  valor: number;
  nome: string;
  notificado: number | null;
  vencido: number | null;
}

export interface Payment {
  id: number;
  idpag: string;
  numero: string;
  valor: string;
  nome: string;
  status: string;
  mainid: number;
  data: Date;
  tokenmp: string | null;
  instance: string | null;
  notas: string | null;
  tipo: string | null;
}

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export type CategoryInput = Omit<Category, 'id'>;
export type ProductInput = Omit<Product, 'id'>;

