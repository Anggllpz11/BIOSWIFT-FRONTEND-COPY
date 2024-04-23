export type Orden = {
  _id: string;
  id_solicitud_servicio?: any;
  id_orden_estado?: any;
  ids_visitas?: any[];
  orden_cambios?: OrdenCambio[];
  id_creador?: any;
  id_cerrador?: any;
  ids_fallas_acciones?: any[];
  ids_fallas_causas?: any[];
  ids_falla_modos?: any[];
  modos_fallas_ids?: any[];
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
  }; // Asumiendo que es un string, ajusta según tu modelo
  id_creador?: any; // Asumiendo que es un string, ajusta según tu modelo
  date_created?: string;
  comentario?: string;
};

