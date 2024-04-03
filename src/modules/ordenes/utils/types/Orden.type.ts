export type Orden = {
  _id: string;
  id_solicitud_servicio?: any;
  id_orden_estado?: any;
  ids_visitas?: any[];
  ids_orden_sub_estados?: any[];
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

