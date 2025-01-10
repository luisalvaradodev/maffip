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
  senha: string;
  permissao: number | null;
  img: string | null;
  token: string | null;
  jwt: string | null;
  data: string | null;
  expirado: number | null;
  status: string | null;
  numero: string | null;
  bot: number | null;
  bonus: number | null;
  afiliado: number | null;
  tokenmp: string | null;
  dono: number | null;
  bonus_pix: number;
  bonus_pix_minimo: number;
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

export interface Contact extends RowDataPacket {
  id: number;
  numero: string;
  nome: string;
  foto: string | null;
  mainid: number;
  saldo: number;
  saldoadd: string | null;
  bloqueado: number;
  comprando: number;
  produto: string;
  valor: number;
  validade: string;
  total_purchases?: number;
  total_spent?: number;
  ultima_compra: string;
  total_payments: number;
  ultimo_pagamento: string;
  texto: string;
}

export interface Product {
  id: number;
  categoria?: number;
  mainid: number;
  produto: string;
  disponivel?: number;
  email?: string;
  senha?: string;
  dono?: string;
  cc?: string;
  gg?: string;
  tipo?: string;
  valor: number;
}

export interface Purchase {
  id: number;
  numero: string;
  mainid: number;
  texto: string;
  id_produto: string;
  data: string;
  valor: number;
  nome: string;
  notificado: number;
  vencido: number;
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
  data: string;
  tokenmp: string;
  instance: string;
  notas: string;
  tipo: string;
}

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export type CategoryInput = Omit<Category, 'id'>;
export type ProductInput = Omit<Product, 'id'>;

