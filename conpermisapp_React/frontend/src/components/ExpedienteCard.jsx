import React from "react";
import { FaTrash } from "react-icons/fa";
import "../styles/Card.css";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale"


function ExpedienteCard({ expediente, onCreate, onClick, onEdit, onDelete }) {
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
        <div className="expediente-card" onClick={onClick}>
            <div className="expediente-card-header">
                <h3>{expediente.descripcion}</h3>
            </div>
            <div>
                <p>Tipo: {expediente.tipo || "No especificado"}</p>
                <p>Subtipo: {expediente.subtipo || "No especificado"}</p>
                <p>Creado: {tiempoCreacion}</p>
            </div>
            <div className="expediente-card-icons">
                <FaTrash
                    className="icon delete-icon"
                    onClick={(e) => {
                        e.stopPropagation(); // Evitar conflicto con onClick general
                        onDelete(expediente.id);
                    }}
                />
            </div>
        </div>
    );
}


export default ExpedienteCard;
