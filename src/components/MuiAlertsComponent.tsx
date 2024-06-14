import React from 'react';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

interface Alert {
  id: number;
  message: string;
  severity: 'error' | 'warning' | 'info' | 'success';
}

interface MuiAlertComponentProps {
  alerts: Alert[];
  onClose: (id: number) => void;
}

const MuiAlertComponent: React.FC<MuiAlertComponentProps> = ({ alerts, onClose }) => {
  return (
    <div className="alerts-container">
      {alerts.map((alert, index) => (
        <Snackbar
          key={alert.id}
          open={true}
          autoHideDuration={6000}
          onClose={() => onClose(alert.id)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          style={{ top: `${index * 70}px` }} 
        >
          <MuiAlert elevation={6} variant="filled" onClose={() => onClose(alert.id)} severity={alert.severity}>
            {alert.message}
          </MuiAlert>
        </Snackbar>
      ))}
    </div>
  );
};

export default MuiAlertComponent;
