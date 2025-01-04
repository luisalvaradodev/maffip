import { RowDataPacket } from "mysql2";

// Tipos para contactos
export interface Contact {
  id: number;
  mainid: string;
  numero: string;
  nome: string;
  foto: string;
  saldo: number;
  saldoadd?: number;
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
  id: number
  mainid: number
  valor: number
  numero: string
  resgatado: number
  codigo: string
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
  id: number;
  categoria: number;
  mainid: number;
  produto: string;
  disponivel: number;
  email: string;
  senha: string;
  dono: string;
  cc: string;
  gg: string;
  tipo: string;
}

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export type CategoryInput = Omit<Category, 'id'>;
export type ProductInput = Omit<Product, 'id'>;

