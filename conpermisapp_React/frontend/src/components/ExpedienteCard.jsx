import React from "react";
import "../styles/Card.css";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale"

function ExpedienteCard({ expediente, onCreate }) {
    if (!expediente) {
        return (
            <div className="expediente-card nueva-card" onClick={onCreate}>
                <div className="card-contenido">
                    <h1>+</h1>
                    <p>Crear un nuevo expediente</p>
                    
                </div>
            </div>
        );
    }

    // Tiempo de creacion
    const tiempoCreacion = formatDistanceToNow(new Date(expediente.fechaCreacion), { 
        addSuffix: true, 
        locale: es 
    });

    return (
        <div className="expediente-card">
            <div className="card-contenido">
                <h3>{expediente.descripcion}</h3>
                <p>creado {tiempoCreacion}</p>
            </div>
        </div>
    );
}

export default ExpedienteCard;