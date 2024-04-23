import React, { useEffect, useState } from 'react';
import { Cotizacion } from '../../utils/types/Cotizacion.type';

import './styles/CotizacionPDF.css'; // Asegúrate de crear este archivo CSS
import memcoLogo from '../../../../utils/img/memco-logotype.png';
import ziriuzQR from '../../../../utils/img/ziriuzqrcode.png';

interface CotizacionesPDFProps {
  cotizacion: Cotizacion;
}

const CotizacionesPDF: React.FC<CotizacionesPDFProps> = ({ cotizacion }) => {

  const repuestos = cotizacion.ids_repuestos || [];
  const itemsAdicionales = cotizacion.items_adicionales || [];
  const [totalCotizacion, setTotalCotizacion] = useState(0);

  const formatCurrency = (cantidad: number, valorUnitario: number) => {
    const total = cantidad * valorUnitario;
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(total);
  };

  const formatCurrencyValorU = (value: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);
  };

  useEffect(() => {
    // Función para calcular el total de la cotización
    const calcularTotalCotizacion = () => {
      const totalRepuestos = repuestos.reduce((acc, repuesto) => acc + (repuesto.cantidad || 0) * (repuesto.valor_unitario || 0), 0);
      const totalItemsAdicionales = itemsAdicionales.reduce((acc, item) => acc + (item.cantidad || 0) * (item.valor_unitario || 0), 0);
      return totalRepuestos + totalItemsAdicionales;
    };

    setTotalCotizacion(calcularTotalCotizacion());
  }, [repuestos, itemsAdicionales]);


  return (
      <div id="pdf-container" className="cotizacionespdf-box">
            <div className="div">
              <img className="memco-logo" alt="Memco logo" src={memcoLogo} />
              <div className="overlap-group">
                <div className="cotizacion-title">COTIZACIÓN</div>
              </div>
              <p className="memco-info">
                MEMCO S.A.S. NIT: 900454322-1 <br />
                Bogotá: Cra. 70 # 21A - 16 / Medellín: Cra. 50FF # 6 Sur - 75 <br />
                Cali: Av. 4N # 17N - 51 / Barranquilla: Cl. 75B # 42F - 83, Local 7 <br />
                Celular: 321 343 9040 / E-mail: info@memcosas.com
              </p>
              <div className="cotizacion-id">ID: {cotizacion._id}</div>
              <div className="fecha-title">Creada en la fecha</div>
              <div className="date-created">{cotizacion.fecha_creation}</div>
              <img className="bioswiftqr" alt="Bioswiftqr" src={ziriuzQR} />
              <div className="greeting">Señores,</div>
              <div className="client-name">{cotizacion.id_cliente.client_name}</div>
              <div className="client-nit">NIT: {cotizacion.id_cliente.client_nit}</div>
              <p className="body">De acuerdo a la solicitud se realiza la siguiente cotización:</p>
              <div className="overlap">
                <div className="costos-t">COSTOS</div>
              </div>
              <div className="costos-titles">
                <div className="cantidad-t">Cantidad</div>
                <div className="reference-t">Referencia</div>
                <div className="description-t">Descripción</div>
                <div className="valor-t">Valor Unitario</div>
                <div className="total-t">Total</div>
              </div>
              {repuestos.map((repuesto, index) => (
                <div key={index} className="repuestos-list">
                  <div className="cantidad-value">{repuesto.cantidad || 'N/A'}</div>
                  <div className="reference-value">{repuesto.id_repuesto._id || 'N/A'}</div>
                  <div className="description-value">{repuesto.id_repuesto.repuesto_name || 'N/A'}</div>
                  <div className="valor-value">{repuesto.valor_unitario ? formatCurrencyValorU(repuesto.valor_unitario) : 'N/A'}</div>
                  <div className="total-value">{repuesto.cantidad && repuesto.valor_unitario ? formatCurrency(repuesto.cantidad, repuesto.valor_unitario) : 'N/A'}</div>
                </div>
               ))}
               {itemsAdicionales.map((item, index) => (
                <div key={index} className="repuestos-list">
                  <div className="cantidad-value">{item.cantidad || 'N/A'}</div>
                  <div className="reference-value">N/A</div>
                  <div className="description-value">{item.descripcion || 'N/A'}</div>
                  <div className="valor-value">{item.valor_unitario ? formatCurrencyValorU(item.valor_unitario) : 'N/A'}</div>
                  <div className="total-value">{item.cantidad && item.valor_unitario ? formatCurrency(item.cantidad, item.valor_unitario) : 'N/A'}</div>
                </div>
               ))}
              <div className="overlap-2">
                <div className="total-rectangle" />
                <div className="totalsiniva">Total sin IVA</div>
                <div className="total-cotizacion">{formatCurrencyValorU(totalCotizacion)}</div>
              </div>
              <p className="time-period">La vigencia de esta cotización es de 30 días una vez aprobada la propuesta.</p>
              <div className="cordially">Cordialmente,</div>
              {cotizacion.firma && (
                    <img className="firma-img" src={cotizacion.firma || 'N/A'} alt="Firma" />

                )}
              <div className="firma-name">{cotizacion.firma_username}</div>
            </div>
          </div>
  );
};

export default CotizacionesPDF;
