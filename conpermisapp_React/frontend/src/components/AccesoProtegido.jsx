import React from "react";
import { Navigate } from "react-router-dom";
// import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

function AccesoProtegido({ children }) {
    const [usuarioRegistrado, loading] = useAuthState(auth);


    if(loading) {
        return <p>Cargando...</p>;
    }

    return usuarioRegistrado ? children : <Navigate to='/' />;
}

export default AccesoProtegido;