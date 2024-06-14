export type SolicitudBodega = {
    _id: string;
    id_cliente?: any;
    id_orden?: any;
    id_estado?: any;
    id_creador?: any;
    date_created?: string;
    ids_repuestos?: any[];
    items_adicionales?: any[];
    id_aprobador?: any;
    date_aprobacion?: string;
    observacion_aprobacion?: string;
    id_rechazador?: any;
    date_rechazo?: string;
    observacion_rechazo?: string;
    id_despachador?: any;
    date_despacho?: string;
    observacion_despacho?: string;
    id_finalizador?: any;
    date_finalizacion?: string;
    observacion_finalizacion?: string;
    novedades?: any[];
  }