import React, { useState } from 'react';
import { sendCotizacionEmail } from '../../services/cotizacionesService';
import { Cotizacion } from '../../utils/types/Cotizacion.type';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import './styles/SendCotizacionEmail.css'
import CancelIcon from '@mui/icons-material/Cancel';
import SendIcon from '@mui/icons-material/Send';
import { CircularProgress } from '@mui/material';

interface SendCotizacionEmailProps {
  onClose: () => void;
  pdfBlob: Blob | null;
  cotizacion: Cotizacion;
  generatePDF: () => Promise<Blob | null>;
}

const SendCotizacionEmail: React.FC<SendCotizacionEmailProps> = ({ onClose, pdfBlob, cotizacion, generatePDF }) => {
  const [emails, setEmails] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const token = useSessionStorage('sessionJWTToken');

  const validateEmails = (emailString: string): boolean => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailString.split(',').every(email => emailPattern.test(email.trim()));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!emails || !validateEmails(emails)) {
      alert("Please enter valid email addresses.");
      return;
    }

    let finalPdfBlob = pdfBlob;
    if (!finalPdfBlob) {
      setIsSending(true);
      finalPdfBlob = await generatePDF();
      if (!finalPdfBlob) {
        alert("Failed to generate PDF. Please try again.");
        setIsSending(false);
        return;
      }
    }

    const file = new File([finalPdfBlob], `cotizacion-${cotizacion._id}.pdf`, { type: 'application/pdf' });
    setIsSending(true);
    try {
      await sendCotizacionEmail(token, { emails, subject: "Cotización PDF", file });
      alert('Email sent successfully');
      onClose();
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Error sending email');
    } finally {
      setIsSending(false);
    }
  };


  return (
    <div className="SendCotizacionEmail-email-modal">
      <form className="SendCotizacionEmail-email-form"  onSubmit={handleSubmit}>
        <div className="SendCotizacionEmail-email-text">Ingrese las direcciones de email, separadas por comas:</div>
        <input 
            className="SendCotizacionEmail-email-input"
            type="text" 
            value={emails} 
            onChange={e => setEmails(e.target.value)} 
            placeholder="Enter emails separated by commas"
            disabled={isSending}
        />
        <button className="SendCotizacionEmail-send-button" type="submit" disabled={isSending}>
          {isSending ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px', color: '#00ddfa', position: 'relative'}}>
              <CircularProgress color="inherit" size={30} />
            </div>
          ) : (
            <SendIcon className="SendCotizacionEmail-send-icon" />
          )}
        </button>
      </form>
      <CancelIcon className="SendCotizacionEmail-cancel-icon" onClick={onClose}/>
    </div>
  );
};

export default SendCotizacionEmail;
