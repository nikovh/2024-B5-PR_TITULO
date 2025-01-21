import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Desplegable from "./FormPage/Desplegable";
import DatosPropiedad from "./FormPage/DatosPropiedad";

const ExpedienteDetalle = () => {
    const { id } = useParams(); 
    const [expediente, setExpediente] = useState(null);
    const [propiedad, setPropiedad] = useState(null); // Estado para la propiedad
    const navigate = useNavigate();

    // Obtener el expediente por ID
    useEffect(() => {
        const fetchExpediente = async () => {
            try {
                console.log(`Obteniendo expediente con ID: ${id}`);
                const response = await fetch(`http://localhost:4000/expedientes/${id}`);
                if (!response.ok) {
                    throw new Error("Error al obtener el expediente");
                }
                const data = await response.json();
                console.log("Datos del expediente:", data);
                setExpediente(data);

                // Si hay propiedad asociada, cargarla
                if (data.expedienteId) {
                    fetchPropiedad(data.expedienteId);
                }
            } catch (err) {
                console.error("Error al obtener el expediente:", err);
            } 
        };

        const fetchPropiedad = async (expedienteId) => {
            try {
                const response = await fetch(`http://localhost:4000/propiedades/expedientes/${expedienteId}`);
                if (!response.ok) {
                    throw new Error("Error al obtener la propiedad");
                }
                const propiedadData = await response.json();
                console.log("Datos de la propiedad:", propiedadData);
                setPropiedad(propiedadData);
            } catch (err) {
                console.error("Error al obtener la propiedad:", err);
            }
        };
        

        fetchExpediente();
    }, [id]);

    if (!expediente) {
        return <p>No se encontró el expediente.</p>;
    }

    const handleCancel = () => {
        navigate("/dashboard");
    };

    return (
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
            <h1>Detalles del Expediente</h1>
            <p><strong>ID:</strong> {expediente.expedienteId}</p>
            <p><strong>Descripción:</strong> {expediente.descripcion}</p>
            <p><strong>Estado:</strong> {expediente.EstadoExpediente_id}</p>
            <p><strong>Fecha de Creación:</strong> {new Date(expediente.fechaCreacion).toLocaleString()}</p>
            <p><strong>Propietario:</strong> {expediente.propietarioNombres} {expediente.propietarioApellidos}</p>

            {/* Desplegable para Propiedad */}

            {/* <Desplegable title="Datos de la Propiedad">
                {loadingPropiedad ? (
                    <p>Cargando datos de la propiedad...</p>
                ) : propiedad ? (
                    <>
                        <p><strong>Rol SII:</strong> {propiedad.rolSII}</p>
                        <p><strong>Dirección:</strong> {propiedad.direccion}</p>
                        <p><strong>Comuna:</strong> {propiedad.comuna}</p>
                        <p><strong>Región:</strong> {propiedad.region}</p>
                        <p><strong>Número:</strong> {propiedad.numero}</p>
                        <p><strong>Inscripción en Fojas:</strong> {propiedad.inscFojas}</p>
                        <p><strong>Destino:</strong> {propiedad.destino}</p>
                    </>
                ) : (
                    <p>No se encontró información de la propiedad asociada.</p>
                )}
            </Desplegable> */}

            <Desplegable title="Datos de la Propiedad">
                <DatosPropiedad onUpdate={(nuevaPropiedad) => console.log("Propiedad actualizada:", nuevaPropiedad)} />
            </Desplegable>

            {/* Otros formularios */}
            <Desplegable title="Formulario 1: Información adicional">
                <p>Aquí va el contenido del formulario 1...</p>
            </Desplegable>
            <Desplegable title="Formulario 2: Documentación requerida">
                <p>Aquí va el contenido del formulario 2...</p>
            </Desplegable>

            <button onClick={handleCancel}>Volver</button>
        </div>
    );
};

export default ExpedienteDetalle;
