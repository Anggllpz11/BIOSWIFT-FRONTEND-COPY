export type Preventivo = {
  _id: string;
  title: string;
  codigo: string;
  version: number;
  fecha: string;
  cualitativo: any[];
  mantenimiento: any[];
  cuantitativo: Array<{
    campo: string; 
    minimo: number;
    maximo: number;
    unidad: string;
    _id: string;
  }>;
  otros: any[];

};
