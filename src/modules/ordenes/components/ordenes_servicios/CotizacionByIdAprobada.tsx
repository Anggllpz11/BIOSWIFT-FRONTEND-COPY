import React, { useState } from 'react';
import { Cotizacion } from '../../utils/types/Cotizacion.type';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import CotizacionesPDF from '../cotizaciones/CotizacionPDF';
import { loadImageAsDataUrl } from '../../../../services/loadS3imagesasUrlData';


import './styles/CotizacionByIdAprobada.css'
import SendIcon from '@mui/icons-material/Send';
import PrintIcon from '@mui/icons-material/Print';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendCotizacionEmail from '../cotizaciones/SendCotizacionEmail';


interface CotizacionByIdAprobadaProps {
  cotizacion: Cotizacion;
  onBack?: () => void;
}

const CotizacionByIdAprobada: React.FC<CotizacionByIdAprobadaProps> = ({ cotizacion, onBack }) => {
    const repuestos = cotizacion.ids_repuestos || [];
    const itemsAdicionales = cotizacion.items_adicionales || [];
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
    
    const generatePDF = async (cotizacion: Cotizacion) => {
        const pdfContainer = document.getElementById('pdf-container');
        if (!pdfContainer) {
            alert('PDF rendering element not found.');
            return null;
        }

        const pdfWidth = 595;  // width for A4 at 72 dpi
        const pdfHeight = 842; // height for A4 at 72 dpi
        const firmaDataUrl = cotizacion.firma ? await loadImageAsDataUrl(cotizacion.firma) : '';

        const canvas = await html2canvas(pdfContainer, {
            scale: 3,
            onclone: (document) => {
                const clonedContainer = document.getElementById('pdf-container');
                if (clonedContainer) {
                    clonedContainer.style.width = `${pdfWidth}px`;
                }
                const signatureImage = document.querySelector('.firma-img') as HTMLImageElement;
                if (signatureImage) {
                    signatureImage.src = firmaDataUrl;
                }
            }
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'pt',
            format: 'a4'
        });

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        return pdf.output('blob');
    };
    const handleSendEmail = () => {
      setShowEmailModal(true);
    };
  
      const handlePrint = async () => {
        const blob = await generatePDF(cotizacion);
        if (blob) {
          const pdfUrl = URL.createObjectURL(blob);
          window.open(pdfUrl, '_blank');
        }
      };
    
  return (
    <div  className="CotizacionByIdAprobada-box">
        <div className='CotizacionByIdAprobada-register-container'>
            <div className="CotizacionByIdAprobada-overlap">
                <div className="CotizacionByIdAprobada-title-t">VER COTIZACIÓN</div>
                <ArrowBackIcon className="CotizacionByIdAprobada-back-button" onClick={onBack}/>

            </div>

            <SendIcon className="CotizacionByIdAprobada-enviar-button" onClick={handleSendEmail}/>
            <div className='CotizacionByIdAprobada-enviar-text' onClick={handleSendEmail}>Enviar</div>

            {showEmailModal && (
                <div className="CotizacionByIdAprobada-modal-overlay">
                  <div className="CotizacionByIdAprobada-modal-content">
                    <CotizacionesPDF cotizacion={cotizacion} />
                    <SendCotizacionEmail 
                      onClose={() => setShowEmailModal(false)} 
                      pdfBlob={pdfBlob} 
                      cotizacion={cotizacion} 
                      generatePDF={() => generatePDF(cotizacion)}  // Pass the generatePDF function
                    />
                  </div>
                </div>
            )}
            
            <PrintIcon className="CotizacionByIdAprobada-imprimir-button" onClick={() => setShowPrintModal(true)}/>
            <div className='CotizacionByIdAprobada-imprimir-text' onClick={() => setShowPrintModal(true)}>Imprimir</div>

            {showPrintModal && (
              <div className="CotizacionByIdAprobada-modal-overlay">
                <div className="CotizacionByIdAprobada-modal-content">
                    <CotizacionesPDF cotizacion={cotizacion} />
                  <div className="CotizacionByIdAprobada-modal-actions">
                    <DownloadForOfflineIcon className='CotizacionByIdAprobada-modal-download-icon' onClick={handlePrint}/>
                    <CancelIcon className='CotizacionByIdAprobada-modal-cancel-icon' onClick={() => setShowPrintModal(false)}/>
                  </div>
                </div>
              </div>
            )}
            <div className="CotizacionByIdAprobada-register-cotizacion">
                <div className='CotizacionByIdAprobada-id-t'>ID</div>
                <div className='CotizacionByIdAprobada-id-value'>{cotizacion._id || 'N/A'}</div>
                <div className='CotizacionByIdAprobada-estado-t'>Estado</div>
                <div className='CotizacionByIdAprobada-estado-value'>{cotizacion.id_estado.estado || 'N/A'}</div>
                <div className='CotizacionByIdAprobada-client-t'>Cliente</div>
                <div className='CotizacionByIdAprobada-client-name'>{cotizacion.id_cliente.client_name || 'N/A'}</div>
                <div className='CotizacionByIdAprobada-orden-id-t'>Orden Relacionada</div>
                <div className='CotizacionByIdAprobada-orden-id'>{cotizacion.id_orden._id || 'N/A'}</div>
                <div className='CotizacionByIdAprobada-mensaje-t'>Mensaje</div>
                <div
                className="CotizacionByIdAprobada-mensaje-value"
                >{cotizacion.mensaje || 'N/A'}</div>
                <div className='CotizacionByIdAprobada-condicion-t'>Condiciones</div>
                <div
                className="CotizacionByIdAprobada-condicion-value"
                >
                {cotizacion.condiciones || 'N/A'}
                </div>
                
                <div className="CotizacionByIdAprobada-repuestos-title">Repuestos</div>
                {repuestos.map((repuesto, index) => (
                <div key={index} className='CotizacionByIdAprobada-repuestos-selected-div'>
                    <div className='CotizacionByIdAprobada-repuestos-selected-title'>Repuesto</div>
                    <p className='CotizacionByIdAprobada-repuestos-selected-value'>{repuesto.id_repuesto.repuesto_name || 'N/A'}</p>
                    <div className='CotizacionByIdAprobada-repuestos-cantidad-title'>Cantidad</div>
                    <div className='CotizacionByIdAprobada-repuestos-cantidad-input'>{repuesto.cantidad || 'N/A'}</div>
                    <div className='CotizacionByIdAprobada-repuestos-valoru-title'>Valor Unitario</div>
                    <div className='CotizacionByIdAprobada-repuestos-valoru-input'>{repuesto.valor_unitario || 'N/A'}</div>
                </div>
                ))}


                <div className='CotizacionByIdAprobada-items-div'>
                    <div className='CotizacionByIdAprobada-items-title'>Items Adicionales</div>
                    {itemsAdicionales.map((item, index) => (
                        <div key={index} className='CotizacionByIdAprobada-items-section'>
                            <div className='CotizacionByIdAprobada-items-description-title'>Descripción</div>
                            <div className='CotizacionByIdAprobada-items-description-input'>{item.descripcion || 'N/A'}</div>
                            <div className='CotizacionByIdAprobada-items-cantidad-title'>Cantidad</div>
                            <div className='CotizacionByIdAprobada-items-cantidad-input'>{item.cantidad || 'N/A'}</div>
                            <div className='CotizacionByIdAprobada-items-valoru-title'>Valor Unitario</div>
                            <div className='CotizacionByIdAprobada-items-valoru-input'>{item.valor_unitario || 'N/A'}</div>
                        </div>
                    ))}
                </div>

                {cotizacion.firma && (
                    <div className="CotizacionByIdAprobada-firma">
                    <div className="CotizacionByIdAprobada-firma-title">Firma</div>
                    <img className="CotizacionByIdAprobada-img-value" src={cotizacion.firma || 'N/A'} alt="Firma" />
                    <div className="CotizacionByIdAprobada-firma-username">{cotizacion.firma_username || 'N/A'}</div>

                    </div>
                )}

                <div className='CotizacionByIdAprobada-observacion-estado-t'>Observaciones Estado-{cotizacion.cambio_estado || 'N/A'}</div>
                    <div
                    className="CotizacionByIdAprobada-observacion-estado-value"
                    >{cotizacion.observacion_estado || 'N/A'}</div>
                </div>
        </div>
    </div>
  );
};

export default CotizacionByIdAprobada;