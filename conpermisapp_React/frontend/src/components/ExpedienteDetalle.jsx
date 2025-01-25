import React, { useState } from "react";
import { useParams, useNavigate }   from "react-router-dom";

import Desplegable              from "./FormPage/Desplegable";
import DatosPropiedad           from "./FormPage/DatosPropiedad";
import ArquitectoPatrocinante   from "./FormPage/ArquitectoPatrocinante"

import useFetchDatos    from "./hooks/useFetchDatos";


import CargaOcupacion   from "./Formularios/CargaOcupacion";
import DatosPropietario from "./FormPage/DatosPropietario";
import SolicitudArt124 from "./Formularios/SolicitudArt124";

const ExpedienteDetalle = () => {
    const { id } = useParams(); 
    const { datos, error } = useFetchDatos(id); // Usa el hook para obtener los datos
    const navigate = useNavigate();

    // const [expediente, setExpediente] = useState(null);
    // const [propiedad, setPropiedad] = useState(null); // Estado para la propiedad
    // const [isEditing, setIsEditing] = useState(false);


    if (error) {
        return <p>Error al cargar los datos: {error}</p>;
    }

    if (!datos.expediente) {
        return <p>Cargando datos del expediente...</p>;
    }

    // Verifica los datos recibidos
    console.log("Datos del expediente:", datos.expediente);
    console.log("Datos de la propiedad:", datos.propiedad);
    console.log("Datos del arquitecto patrocinante:", datos.usuario);


    // const handleSavePropiedad = async (nuevaPropiedad) => {
    //     try {
    //         const url = propiedad
    //             ? `http://localhost:4000/propiedades/${propiedad.id}` // Actualización
    //             : `http://localhost:4000/propiedades`; // Creación
    
    //         console.log("URL para guardar propiedad:", url);
    
    //         const response = await fetch(url, {
    //             method: propiedad ? "PUT" : "POST",
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify({ ...nuevaPropiedad, expedienteId: expediente.expedienteId }),
    //         });
    
    //         if (response.ok) {
    //             const data = await response.json();
    //             setPropiedad(data); 
    //             setIsEditing(false);
    //             alert(propiedad ? "Propiedad actualizada exitosamente" : "Propiedad creada exitosamente");
    //         } else {
    //             const errorData = await response.json();
    //             console.error("Error en el servidor:", errorData);
    //             alert("Error al guardar la propiedad");
    //         }
    //     } catch (err) {
    //         console.error("Error al guardar la propiedad:", err);
    //     }
    // };

    const handleCancel = () => {
        navigate("/dashboard");
    };

    return (
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
            <h1>Detalles del Expediente</h1>
            <p><strong>ID:</strong> {datos.expediente.expedienteId}</p>
            <p><strong>Descripción:</strong> {datos.expediente.descripcion}</p>
            <p><strong>Estado:</strong> En proceso</p>
            <p><strong>Fecha de Creación:</strong> {new Date(datos.expediente.fechaCreacion).toLocaleString()}</p>
            <p><strong>Propietario:</strong> {datos.expediente.propietarioNombres} {datos.expediente.propietarioApellidos}</p>


            {/* Desplegable de Datos de la Propiedad */}
            <Desplegable title="Datos de la Propiedad">
                {datos.propiedad ? (
                    <DatosPropiedad
                        propiedad={datos.propiedad}
                        onSave={(nuevaPropiedad) => {
                            console.log("Propiedad actualizada:", nuevaPropiedad);
                        }}
                    />
                ) : (
                    <p>No se encontraron datos de la propiedad.</p>
                )}
            </Desplegable>


            <Desplegable title="Datos del Propietario">
                <DatosPropietario 
                    propietario={datos.propietario} 
                    // onSave={handleSavePropietario} 
                />

            </Desplegable>


            {/* Desplegable del Arquitecto Patrocinante */}
            <Desplegable title="Datos del Arquitecto Patrocinante">
                {datos.usuario ? (
                    <ArquitectoPatrocinante
                        usuario={datos.usuario}
                        onUpdate={(updatedData) => {
                            console.log("Datos del arquitecto actualizados:", updatedData);
                        }}
                    />
                ) : (
                    <p>No se encontraron datos del arquitecto patrocinante.</p>
                )}
            </Desplegable>



            <Desplegable title="Formulario 1: Información adicional">
                {/* <Formulario1 /> */}
                <p>Aquí va el contenido del formulario 1...</p>
            </Desplegable>
            <Desplegable title="Formulario 2: Documentación requerida">
                <p>Aquí va el contenido del formulario 2...</p>
            </Desplegable>
            <Desplegable title="Formulario 3: Carga de Ocupación">
                <CargaOcupacion />
            </Desplegable>
            <Desplegable title="Formulario 4: Solicitud Art. 124° LGUC ">
                <SolicitudArt124 expedienteId={id} />
            </Desplegable>


            <button onClick={handleCancel}>Volver</button>        


        </div>

    );
};


export default ExpedienteDetalle;
