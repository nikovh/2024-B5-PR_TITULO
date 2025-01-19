import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Desplegable from "./FormPage/Desplegable";
import { auth } from '../firebase';

const ExpedienteDetalle = () => {
    const { id } = useParams(); 
    const [expediente, setExpediente] = useState(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true); // Estado para manejar el indicador de carga

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
                console.log("ID recibido:", id);
                // Actualiza el estado con los datos del expediente
                setExpediente(data);
            } catch (err) {
                console.error("Error al obtener el expediente:", err);
            } finally {
                setLoading(false);
            }
        };
    
        fetchExpediente();
    }, [id]);

    // const fetchExpedientes = async () => {
    //     try {
    //         const usuarioEmail = auth.currentUser?.email; // Email del usuario autenticado
    //         const response = await fetch(`http://localhost:4000/expedientes?usuario_email=${usuarioEmail}`);
    //         if (!response.ok) {
    //             throw new Error("Error al obtener expedientes");
    //         }
    //         const data = await response.json();
    //         setExpedientes(data); // Actualiza el estado con los expedientes del usuario
    //     } catch (err) {
    //         console.error("Error al obtener expedientes:", err);
    //     }
    // };
    

    if (loading) {
        return <p>Cargando expediente...</p>;
    }
    
    if (!expediente) {
        return <p>No se encontró el expediente.</p>;
    }

    const handleCancel = () => {
        navigate("/dashboard");
    };


    return (
        // <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
        //     <h1>Detalles del Expediente</h1>
        //     <p><strong>ID del Expediente:</strong> {expediente.expedienteId}</p>
        //     <p><strong>Descripción:</strong> {expediente.descripcion}</p>
        //     <p><strong>Tipo:</strong> {expediente.tipo}</p>
        //     <p><strong>Subtipo:</strong> {expediente.subtipo}</p>
        //     <p><strong>Estado:</strong> {expediente.estadoExpedienteId}</p>
        //     <p><strong>Fecha de Creación:</strong> {new Date(expediente.fechaCreacion).toLocaleString()}</p>

        //     <h2>Propietario</h2>
        //     <p><strong>RUT:</strong> {expediente.propietarioRut}</p>
        //     <p><strong>Nombre:</strong> {expediente.propietarioNombres} {expediente.propietarioApellidos}</p>
        //     <p><strong>Teléfono:</strong> {expediente.propietarioTelefono}</p>

        //     <h2>Propiedad</h2>
        //     <p><strong>Rol SII:</strong> {expediente.propiedadRolSII}</p>
        //     <p><strong>Dirección:</strong> {expediente.propiedadDireccion}</p>
        //     <p><strong>Comuna:</strong> {expediente.propiedadComuna}</p>
        //     <p><strong>Región:</strong> {expediente.propiedadRegion}</p>

        //     <Desplegable title="Formulario 1: Información adicional">
        //         <p>contenido del formulario 1...</p>
        //     </Desplegable>
        //     <Desplegable title="Formulario 2: Documentación requerida">
        //         <p>contenido del formulario 2...</p>
        //     </Desplegable>
        // </div>



        // <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
        //     <h1>Detalles del Expediente</h1>
        //     <p><strong>ID:</strong> {expediente?.expedienteId || "No disponible"}</p>
        //     <p><strong>Propietario:</strong> {expediente?.propietarioRut || "No disponible"}</p>
        //     {/* <p><strong>Propiedad:</strong> {expediente?.propiedadId || "No disponible"}</p> */}

        //     <Desplegable title="Formulario 1: Información adicional">
        //         <p>Aquí va el contenido del formulario 1...</p>
        //     </Desplegable>
        //     <Desplegable title="Formulario 2: Documentación requerida">
        //         <p>Aquí va el contenido del formulario 2...</p>
        //     </Desplegable>
        // </div>


        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
            <h1>Detalles del Expediente</h1>
            <p>ID: {expediente.expedienteId}</p>
            <p>Descripción: {expediente.descripcion}</p>
            <p>Estado: {expediente.EstadoExpediente_id}</p>
            <p>Fecha de Creación: {new Date(expediente.fechaCreacion).toLocaleString()}</p>
            <p>Propietario: {expediente.propietarioNombres} {expediente.propietarioApellidos}</p>

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