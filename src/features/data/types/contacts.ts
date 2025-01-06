export interface Contact {
    id: number;
    numero: string;
    nome: string;
    foto: string;
    mainid: number;
    saldo: number | null;
    saldoadd: string;
    bloqueado: number;
    comprando: number;
  }
  
  export interface Instance {
    instance: {
      instanceName: string;
    };
  }
  
  export interface PrefabText {
    id: number;
    texto_contas: string;
    texto_telas: string;
    texto_titulo: string;
    texto_info: string;
    texto_suporte: string;
    mainid: number;
  }