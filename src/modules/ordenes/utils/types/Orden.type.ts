export type Orden = {
  _id: string;
  id_solicitud_servicio?: any;
  id_orden_estado?: any;
  ids_visitas?: any[];
  orden_cambios?: OrdenCambio[];
  resultado_orden?: ResultadoOrden;
  id_creador?: any;
  id_cerrador?: any;
  id_anulador?: any;
  entrega?: {
    id_entrega?: any;
    firma?: any;
  };
  recibe?: {
    cedula_recibe?: string;
    nombre_recibe?: string;
    firma_recibe?: any;
  };
  fecha_sub_estado?: string;
  creacion?: string;
  cierre?: string;
  observaciones_cierre?: string;
  anulacion_date?: string;
  observaciones_anulacion?: string;
  total?: number;
  solicitar_dado_baja?: boolean;
};

// Definiendo el tipo para un cambio individual en la orden
export type OrdenCambio = {
  _id?: string;
  ids_orden_sub_estado?: {
    _id?: string;
    id_orden_estado?: any;
    sub_estado?: string;
  }; 
  id_creador?: any; 
  date_created?: string;
  comentario?: string;
};

export type ResultadoOrden = {
  _id?: string;
  id_fallo_sistema?: string;
  ids_modos_fallos?: any;
  ids_causas_fallos?: any;
  comentarios_finales?: string;
  solicitud_dar_baja?: boolean;
  accion_ejecutada?: string;
};


