import React from 'react';
import { Orden } from '../../../utils/types/Orden.type';

import './styles/OrdenAbiertaCorrectivoPDF.css'
import memcoLogo from '../../../../../utils/img/memco-logotype.png';
import ziriuzQR from '../../../../../utils/img/ziriuzqrcode.png';

interface OrdenAbiertaCorrectivoPDFProps {
  orden: Orden;
  onBack?: () => void;
}

const OrdenAbiertaCorrectivoPDF: React.FC<OrdenAbiertaCorrectivoPDFProps> = ({ orden, onBack }) => {
  return (
      <div className="OrdenAbiertaCorrectivoPDF-box">
        <div className="OrdenAbiertaCorrectivoPDF-overlap-wrapper">
          <div className="OrdenAbiertaCorrectivoPDF-overlap">
            <div className="OrdenAbiertaCorrectivoPDF-header-group">
              <img className="OrdenAbiertaCorrectivoPDF-memco-logo" alt="Memco logo" src={memcoLogo}  />
              <div className="OrdenAbiertaCorrectivoPDF-overlap-group">
                <div className="OrdenAbiertaCorrectivoPDF-orden-title">ORDEN DE SERVICIO</div>
              </div>
              <p className="OrdenAbiertaCorrectivoPDF-memco-info">
                MEMCO S.A.S. NIT: 900454322-1 <br />
                Bogotá: Cra. 70 # 21A - 16 / Medellín: Cra. 50FF # 6 Sur - 75 <br />
                Cali: Av. 4N # 17N - 51 / Barranquilla: Cl. 75B # 42F - 83, Local 7 <br />
                Celular: 321 343 9040 / E-mail: info@memcosas.com
              </p>
              <div className="OrdenAbiertaCorrectivoPDF-orden-id">ID: {orden._id}</div>
              <div className="OrdenAbiertaCorrectivoPDF-fecha-title">Fecha de Cierre</div>
              <div className="OrdenAbiertaCorrectivoPDF-date-created">DD/MM/AAAA 00:00</div>
              <img className="OrdenAbiertaCorrectivoPDF-bioswiftqr" alt="Bioswiftqr" src={ziriuzQR} />
            </div>
            <div className="OrdenAbiertaCorrectivoPDF-div">
              <div className="OrdenAbiertaCorrectivoPDF-client-group">
                <div className="OrdenAbiertaCorrectivoPDF-div-wrapper">
                  <div className="OrdenAbiertaCorrectivoPDF-text-wrapper">CLIENTE</div>
                </div>
                <div className="OrdenAbiertaCorrectivoPDF-client-namet">Nombre:</div>
                <div className="OrdenAbiertaCorrectivoPDF-client-namev">{orden.id_solicitud_servicio.id_equipo.id_sede.id_client.client_name}</div>
                <div className="OrdenAbiertaCorrectivoPDF-sede-namet">Sede:</div>
                <div className="OrdenAbiertaCorrectivoPDF-sede-namev">{orden.id_solicitud_servicio.id_equipo.id_sede.sede_nombre}</div>
                <div className="OrdenAbiertaCorrectivoPDF-nit-valuet">NIT:</div>
                <div className="OrdenAbiertaCorrectivoPDF-nit-valuev">{orden.id_solicitud_servicio.id_equipo.id_sede.id_client.client_nit}</div>
                <div className="OrdenAbiertaCorrectivoPDF-address-t">Dirección:</div>
                <div className="OrdenAbiertaCorrectivoPDF-address-v">{orden.id_solicitud_servicio.id_equipo.id_sede.sede_address}</div>
              </div>
              <div className="OrdenAbiertaCorrectivoPDF-solicitud-group">
                <div className="OrdenAbiertaCorrectivoPDF-div-wrapper">
                  <div className="OrdenAbiertaCorrectivoPDF-text-wrapper">SOLICITUD</div>
                </div>
                <div className="OrdenAbiertaCorrectivoPDF-date-t">Fecha:</div>
                <div className="OrdenAbiertaCorrectivoPDF-date-value">{orden.id_solicitud_servicio.creacion}</div>
                <div className="OrdenAbiertaCorrectivoPDF-creator-t">Creador:</div>
                <div className="OrdenAbiertaCorrectivoPDF-creator-v">{orden.id_solicitud_servicio.id_creador.name}</div>
                <div className="OrdenAbiertaCorrectivoPDF-service-t">Servicio:</div>
                <div className="OrdenAbiertaCorrectivoPDF-text-wrapper-2">{orden.id_solicitud_servicio.id_servicio.servicio}</div>
              </div>
              <div className="OrdenAbiertaCorrectivoPDF-equipo-group">
                <div className="OrdenAbiertaCorrectivoPDF-div-wrapper">
                  <div className="OrdenAbiertaCorrectivoPDF-equipo-title">EQUIPO</div>
                </div>
                <div className="OrdenAbiertaCorrectivoPDF-overlap-2">
                  <div className="OrdenAbiertaCorrectivoPDF-overlap-3">
                    <div className="OrdenAbiertaCorrectivoPDF-id-t">ID:</div>
                    <div className="OrdenAbiertaCorrectivoPDF-overlap-4">
                      <div className="OrdenAbiertaCorrectivoPDF-id-value">{orden.id_solicitud_servicio.id_equipo._id}</div>
                      <div className="OrdenAbiertaCorrectivoPDF-equipo-t">Equipo:</div>
                    </div>
                    <p className="OrdenAbiertaCorrectivoPDF-equipo-v"> {orden.id_solicitud_servicio.id_equipo.modelo_equipos.id_clase.clase}</p>
                  </div>
                  <div className="OrdenAbiertaCorrectivoPDF-marca-t">Marca:</div>
                </div>
                <div className="OrdenAbiertaCorrectivoPDF-text-wrapper-2">{orden.id_solicitud_servicio.id_equipo.modelo_equipos.id_marca.marca}</div>
                <div className="OrdenAbiertaCorrectivoPDF-model-t">Modelo:</div>
                <div className="OrdenAbiertaCorrectivoPDF-model-v">{orden.id_solicitud_servicio.id_equipo.modelo_equipos.modelo}</div>
                <div className="OrdenAbiertaCorrectivoPDF-serie-t">Serie:</div>
                <div className="OrdenAbiertaCorrectivoPDF-serie-v">{orden.id_solicitud_servicio.id_equipo.serie}</div>
                <div className="OrdenAbiertaCorrectivoPDF-activo-t">Activo:</div>
                <div className="OrdenAbiertaCorrectivoPDF-activo-v">{orden.id_solicitud_servicio.id_equipo.activo_fijo || 'N/A'}</div>
                <div className="OrdenAbiertaCorrectivoPDF-ubicacion-t">Ubicacion:</div>
                <div className="OrdenAbiertaCorrectivoPDF-ubucacion-v">{orden.id_solicitud_servicio.id_equipo.ubicacion}</div>
                <div className="OrdenAbiertaCorrectivoPDF-type-t">Tipo:</div>
                <div className="OrdenAbiertaCorrectivoPDF-type-v">{orden.id_solicitud_servicio.id_equipo.id_tipo.tipo}</div>
              </div>
              <div className="OrdenAbiertaCorrectivoPDF-opened-title">ORDEN ABIERTA</div>
            </div>
            <div className="OrdenAbiertaCorrectivoPDF-firmas-section">
              <div className="OrdenAbiertaCorrectivoPDF-firma-entrega-group">
                <div className="OrdenAbiertaCorrectivoPDF-overlap-5">
                  <div className="OrdenAbiertaCorrectivoPDF-entrega-t">ENTREGA</div>
                </div>
                <div className="OrdenAbiertaCorrectivoPDF-overlap-group-2">
                  <div className="OrdenAbiertaCorrectivoPDF-firma-t">Firma</div>
                  <div className="OrdenAbiertaCorrectivoPDF-firma-space" />
                </div>
                <div className="OrdenAbiertaCorrectivoPDF-name-t">Nombre</div>
                <div className="OrdenAbiertaCorrectivoPDF-cedula-t">Cedula</div>
              </div>
              <div className="OrdenAbiertaCorrectivoPDF-firma-recibe-group">
                <div className="OrdenAbiertaCorrectivoPDF-overlap-5">
                  <div className="OrdenAbiertaCorrectivoPDF-recibe-t">RECIBE</div>
                </div>
                <div className="OrdenAbiertaCorrectivoPDF-overlap-6">
                  <div className="OrdenAbiertaCorrectivoPDF-firma-t">Firma</div>
                  <div className="OrdenAbiertaCorrectivoPDF-firma-space" />
                </div>
                <div className="OrdenAbiertaCorrectivoPDF-name">Nombre</div>
                <div className="OrdenAbiertaCorrectivoPDF-cedula">Cedula</div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default OrdenAbiertaCorrectivoPDF;


{/* <p><strong>Estado:</strong> {orden.id_orden_estado.estado}</p>
<p><strong>Fecha de Creación:</strong> {orden.creacion}</p> */}