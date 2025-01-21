import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Desplegable from "./FormPage/Desplegable";
import DatosPropiedad from "./FormPage/DatosPropiedad";
import CargaOcupacion from "./Formularios/CargaOcupacion";

const ExpedienteDetalle = () => {
    const { id } = useParams(); 
    const [expediente, setExpediente] = useState(null);
    const [propiedad, setPropiedad] = useState(null); // Estado para la propiedad
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    // Obtener el expediente por ID
    useEffect(() => {
        const fetchExpediente = async () => {
            try {
                //console.log(`Obteniendo expediente con ID: ${id}`);
                const response = await fetch(`http://localhost:4000/expedientes/${id}`);
                if (!response.ok) {
                    throw new Error("Error al obtener el expediente");
                }
                const data = await response.json();
                //console.log("Datos del expediente:", data);
                setExpediente(data);

                // Si hay propiedad asociada, cargarla
                if (data.expedienteId) {
                    fetchPropiedad(data.expedienteId);
                }
            } catch (err) {
                console.error("Error al obtener el expediente:", err);
            } 
        };

        // const fetchPropiedad = async (expedienteId) => {
        //     try {
        //         const response = await fetch(`http://localhost:4000/propiedades/expedientes/${expedienteId}`);
        //         if (!response.ok) {
        //             throw new Error("Error al obtener la propiedad");
        //         }
        //         const propiedadData = await response.json();
        //         //console.log("Datos de la propiedad:", propiedadData);
        //         setPropiedad(propiedadData);
        //     } catch (err) {
        //         console.error("Error al obtener la propiedad:", err);
        //     }
        // };
        
        const fetchPropiedad = async (expedienteId) => {
            try {
                const response = await fetch(`http://localhost:4000/propiedades/expedientes/${expedienteId}`);
                if (!response.ok) {
                    throw new Error("Error al obtener la propiedad");
                }
                const propiedadData = await response.json();
                console.log("Datos de la propiedad desde la API:", propiedadData);
        
                // Asegúrate de establecer correctamente el ID de la propiedad
                setPropiedad(propiedadData[0]); // Usa el primer elemento si es un array
            } catch (err) {
                console.error("Error al obtener la propiedad:", err);
            }
        };
        


        fetchExpediente();
    }, [id]);

    // const handleSavePropiedad = async (nuevaPropiedad) => {
    //     try {
    //         const response = await fetch(
    //             propiedad
    //                 ? `http://localhost:4000/propiedades/${propiedad.id}` // Actualización
    //                 : `http://localhost:4000/propiedades`, // Creación
    //             {
    //                 method: propiedad ? "PUT" : "POST",
    //                 headers: { "Content-Type": "application/json" },
    //                 body: JSON.stringify({ ...nuevaPropiedad, expedienteId: expediente.expedienteId }),
    //             }
    //         );

    //         if (response.ok) {
    //             const data = await response.json();
    //             setPropiedad(data);
    //             setIsEditing(false); // Salir del modo edición
    //             alert(propiedad ? "Propiedad actualizada exitosamente" : "Propiedad creada exitosamente");
    //         } else {
    //             alert("Error al guardar la propiedad");
    //         }
    //     } catch (err) {
    //         console.error("Error al guardar la propiedad:", err);
    //     }
    // };

    const handleSavePropiedad = async (nuevaPropiedad) => {
        try {
            const url = propiedad
                ? `http://localhost:4000/propiedades/${propiedad.id}` // Actualización
                : `http://localhost:4000/propiedades`; // Creación
    
            console.log("URL para guardar propiedad:", url);
    
            const response = await fetch(url, {
                method: propiedad ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...nuevaPropiedad, expedienteId: expediente.expedienteId }),
            });
    
            if (response.ok) {
                const data = await response.json();
                setPropiedad(data); // Asegúrate de que aquí se actualiza correctamente el estado
                setIsEditing(false);
                alert(propiedad ? "Propiedad actualizada exitosamente" : "Propiedad creada exitosamente");
            } else {
                const errorData = await response.json();
                console.error("Error en el servidor:", errorData);
                alert("Error al guardar la propiedad");
            }
        } catch (err) {
            console.error("Error al guardar la propiedad:", err);
        }
    };
    

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
        <Desplegable title="Datos de la Propiedad">
            {propiedad && !isEditing ? (
                <>
                    <p><strong>Rol SII:</strong> {propiedad.rolSII || "No registrado"}</p>
                    <p><strong>Dirección:</strong> {propiedad.direccion || "No registrado"}</p>
                    <p><strong>Comuna:</strong> {propiedad.comuna || "No registrado"}</p>
                    <p><strong>Región:</strong> {propiedad.region || "No registrado"}</p>
                    <p><strong>Inscripción Número:</strong> {propiedad.inscNumero || "No registrado"}</p>
                    <p><strong>Año de Inscripción:</strong> {propiedad.inscYear || "No registrado"}</p>
                    <button onClick={() => setIsEditing(true)}>Editar</button>
                </>
            ) : (
                <DatosPropiedad
                    propiedad={propiedad}
                    onSave={handleSavePropiedad}
                    onCancel={() => setIsEditing(false)}
                />
            )}
        </Desplegable>

        {/* Otros formularios */}
        <Desplegable title="Formulario 1: Información adicional">
            <p>Aquí va el contenido del formulario 1...</p>
        </Desplegable>
        <Desplegable title="Formulario 2: Documentación requerida">
            <p>Aquí va el contenido del formulario 2...</p>
        </Desplegable>
        <Desplegable title="Formulario 3: Carga de Ocupación">
            <CargaOcupacion />
        </Desplegable>

        <button onClick={handleCancel}>Volver</button>
    </div>
);
};

export default ExpedienteDetalle;