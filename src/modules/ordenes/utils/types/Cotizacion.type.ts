export type Cotizacion = {
    _id: string;
    id_cliente?: any;
    id_orden?: any;
    id_creador?: any;
    id_cambiador?: any;
    id_estado?: any;
    ids_repuestos?: any[];
    items_adicionales?: any[];
    fecha_creation?: string;
    cambio_estado?: string;
    mensaje?: string;
    observacion_estado?: string;
    condiciones?: string;
    firma?: any;
    presignedImageUrl?: string;
    firma_username?: string;
  }