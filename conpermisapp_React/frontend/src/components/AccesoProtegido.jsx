import React from "react";
import { Navigate } from "react-router-dom";
// import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

const AccesoProtegido = ({ children, usuario }) => {
    
    if (!usuario) {
        return <Navigate to="/" />; // Redirigir al login si no está autenticado
    }

    if (usuario.rol !== "administrador") {
        return <Navigate to="/dashboard" />;
    }

    return children; // Renderiza el componente si es administrador
};
export default AccesoProtegido;