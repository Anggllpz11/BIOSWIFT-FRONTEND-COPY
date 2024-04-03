import React from "react";
import { useLocation } from "react-router-dom";
import UpdatePasswordForm from "../components/forms/UpdatePasswordForm";

const UpdatePasswordPage: React.FC = () => {
  const location = useLocation();
  const { email } = location.state || {};

  return (
    <div>
      {email ? (
        <UpdatePasswordForm email={email} />
      ) : (
        <p>Correo electrónico no encontrado.</p>
      )}
    </div>
  );
};

export default UpdatePasswordPage;
