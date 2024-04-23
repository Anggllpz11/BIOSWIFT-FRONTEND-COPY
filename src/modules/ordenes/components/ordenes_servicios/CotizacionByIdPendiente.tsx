import React, { useEffect, useState } from 'react';
import { Cotizacion } from '../../utils/types/Cotizacion.type';
import { updateCotizacion } from '../../services/cotizacionesService';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import CotizacionesPDF from '../cotizaciones/CotizacionPDF';
import { loadImageAsDataUrl } from '../../../../services/loadS3imagesasUrlData';


import './styles/CotizacionByIdPendiente.css'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import SendIcon from '@mui/icons-material/Send';
import PrintIcon from '@mui/icons-material/Print';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendCotizacionEmail from '../cotizaciones/SendCotizacionEmail';


interface CotizacionByIdPendienteProps {
  cotizacion: Cotizacion;
  onBack?: () => void;
  onCambioSuccess?: () => void;

}

const CotizacionByIdPendiente: React.FC<CotizacionByIdPendienteProps> = ({ cotizacion, onBack, onCambioSuccess }) => {
    const repuestos = cotizacion.ids_repuestos || [];
    const itemsAdicionales = cotizacion.items_adicionales || [];
    const [observacionEstado, setObservacionEstado] = useState('');
    const token = useSessionStorage('sessionJWTToken');
    const [showModal, setShowModal] = useState(false);
    const [accionModal, setAccionModal] = useState('aprobar');
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
    const now = new Date();
    const formattedDateCreated = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    
    const handleOpenModal = (accion: 'aprobar' | 'rechazar') => {
        setAccionModal(accion);
        setShowModal(true);
      };
    
      const handleCloseModal = () => {
        setShowModal(false);
        setObservacionEstado('');
        onBack && onBack();
      };

      const handleConfirmarAccion = async () => {
        const idEstado = accionModal === 'aprobar' ? '6613313e445b229362edc880' : '66133146445b229362edc882';
        const cotizacionData = {
          id_estado: idEstado,
          observacion_estado: observacionEstado,
          cambio_estado: formattedDateCreated,
        };
    
        if (token && cotizacion._id) {
          await updateCotizacion(token, cotizacion._id, cotizacionData);
          handleCloseModal();
          onCambioSuccess && onCambioSuccess();
        }
      };

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
    <div  className="CotizacionByIdPendiente-box">
        <div className='CotizacionByIdPendiente-register-container'>
            <div className="CotizacionByIdPendiente-overlap">
                <div className="CotizacionByIdPendiente-title-t">VER COTIZACIÓN</div>
                <ArrowBackIcon className="CotizacionByIdPendiente-back-button" onClick={onBack}/>

            </div>

            <CheckCircleIcon className="CotizacionByIdPendiente-aprobar-button" onClick={() => handleOpenModal('aprobar')}/>
            <div className='CotizacionByIdPendiente-aprobar-text' onClick={() => handleOpenModal('aprobar')}>Aprobar</div>
            {showModal && (
                <div className="CotizacionByIdPendiente-modal-overlay">
                        <div className="CotizacionByIdPendiente-modal-content">
                          <h3 className='CotizacionByIdPendiente-modal-content-title'>{accionModal === 'aprobar' ? 'Aprobar Cotización' : 'Rechazar Cotización'}</h3>
                          <textarea
                            className="CotizacionByIdPendiente-textarea"
                            value={observacionEstado}
                            onChange={(e) => setObservacionEstado(e.target.value)}
                            placeholder='Observaciones...'
                          />
                          <div className="CotizacionByIdPendiente-modal-actions">
                            <button className="CotizacionByIdPendiente-modal-cancel-button" onClick={handleCloseModal}>Cancelar</button>
                            <button className="CotizacionByIdPendiente-close-observacion-button"  onClick={handleConfirmarAccion}>{accionModal === 'aprobar' ? 'Aprobar Cotización' : 'Rechazar Cotización'}</button>
                          </div>
                        </div>
                      </div>
            )}

            <DoDisturbIcon className="CotizacionByIdPendiente-rechazar-button" onClick={() => handleOpenModal('rechazar')}/>
            <div className='CotizacionByIdPendiente-rechazar-text' onClick={() => handleOpenModal('rechazar')}>Rechazar</div>

            <SendIcon className="CotizacionByIdPendiente-enviar-button" onClick={handleSendEmail}/>
            <div className='CotizacionByIdPendiente-enviar-text' onClick={handleSendEmail}>Enviar</div>

            {showEmailModal && (
                <div className="CotizacionByIdPendiente-modal-overlay">
                  <div className="CotizacionByIdPendiente-modal-content">
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
            
            <PrintIcon className="CotizacionByIdPendiente-imprimir-button" onClick={() => setShowPrintModal(true)}/>
            <div className='CotizacionByIdPendiente-imprimir-text' onClick={() => setShowPrintModal(true)}>Imprimir</div>

            {showPrintModal && (
              <div className="CotizacionByIdPendiente-modal-overlay">
                <div className="CotizacionByIdPendiente-modal-content">
                    <CotizacionesPDF cotizacion={cotizacion} />
                  <div className="CotizacionByIdPendiente-modal-actions">
                    <DownloadForOfflineIcon className='CotizacionByIdPendiente-modal-download-icon' onClick={handlePrint}/>
                    <CancelIcon className='CotizacionByIdPendiente-modal-cancel-icon' onClick={() => setShowPrintModal(false)}/>
                  </div>
                </div>
              </div>
            )}
            <div className="CotizacionByIdPendiente-register-cotizacion">
                <div className='CotizacionByIdPendiente-id-t'>ID</div>
                <div className='CotizacionByIdPendiente-id-value'>{cotizacion._id || 'N/A'}</div>
                <div className='CotizacionByIdPendiente-estado-t'>Estado</div>
                <div className='CotizacionByIdPendiente-estado-value'>{cotizacion.id_estado.estado || 'N/A'}</div>
                <div className='CotizacionByIdPendiente-client-t'>Cliente</div>
                <div className='CotizacionByIdPendiente-client-name'>{cotizacion.id_cliente.client_name || 'N/A'}</div>
                <div className='CotizacionByIdPendiente-orden-id-t'>Orden Relacionada</div>
                <div className='CotizacionByIdPendiente-orden-id'>{cotizacion.id_orden._id || 'N/A'}</div>
                <div className='CotizacionByIdPendiente-mensaje-t'>Mensaje</div>
                <div
                className="CotizacionByIdPendiente-mensaje-value"
                >{cotizacion.mensaje || 'N/A'}</div>
                <div className='CotizacionByIdPendiente-condicion-t'>Condiciones</div>
                <div
                className="CotizacionByIdPendiente-condicion-value"
                >
                {cotizacion.condiciones || 'N/A'}
                </div>
                
                <div className="CotizacionByIdPendiente-repuestos-title">Repuestos</div>
                {repuestos.map((repuesto, index) => (
                <div key={index} className='CotizacionByIdPendiente-repuestos-selected-div'>
                    <div className='CotizacionByIdPendiente-repuestos-selected-title'>Repuesto</div>
                    <p className='CotizacionByIdPendiente-repuestos-selected-value'>{repuesto.id_repuesto.repuesto_name || 'N/A'}</p>
                    <div className='CotizacionByIdPendiente-repuestos-cantidad-title'>Cantidad</div>
                    <div className='CotizacionByIdPendiente-repuestos-cantidad-input'>{repuesto.cantidad || 'N/A'}</div>
                    <div className='CotizacionByIdPendiente-repuestos-valoru-title'>Valor Unitario</div>
                    <div className='CotizacionByIdPendiente-repuestos-valoru-input'>{repuesto.valor_unitario || 'N/A'}</div>
                </div>
                ))}


                <div className='CotizacionByIdPendiente-items-div'>
                    <div className='CotizacionByIdPendiente-items-title'>Items Adicionales</div>
                    {itemsAdicionales.map((item, index) => (
                        <div key={index} className='CotizacionByIdPendiente-items-section'>
                            <div className='CotizacionByIdPendiente-items-description-title'>Descripción</div>
                            <div className='CotizacionByIdPendiente-items-description-input'>{item.descripcion || 'N/A'}</div>
                            <div className='CotizacionByIdPendiente-items-cantidad-title'>Cantidad</div>
                            <div className='CotizacionByIdPendiente-items-cantidad-input'>{item.cantidad || 'N/A'}</div>
                            <div className='CotizacionByIdPendiente-items-valoru-title'>Valor Unitario</div>
                            <div className='CotizacionByIdPendiente-items-valoru-input'>{item.valor_unitario || 'N/A'}</div>
                        </div>
                    ))}
                </div>

                {cotizacion.firma && (
                    <div className="CotizacionByIdPendiente-firma">
                    <div className="CotizacionByIdPendiente-firma-title">Firma</div>
                    <img className="CotizacionByIdPendiente-img-value" src={cotizacion.firma || 'N/A'} alt="Firma" />
                    <div className="CotizacionByIdPendiente-firma-username">{cotizacion.firma_username || 'N/A'}</div>

                    </div>
                )}
            </div>

        </div>
    </div>
  );
};

export default CotizacionByIdPendiente;