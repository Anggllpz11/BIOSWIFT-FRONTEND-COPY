export type Equipo = {
    _id: string;
    id_sede?: any; // Asegúrate de importar ISede desde el lugar correcto
    modelo_equipos: any;
    id_area: any;
    id_tipo: any;
    serie: string;
    ubicacion: string;
    frecuencia: number;
    activo_fijo: string;
    mtto: string;
  };
  