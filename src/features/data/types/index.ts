// types/database.ts
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
  