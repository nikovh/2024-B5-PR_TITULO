import React, { useState } from "react";
import { useParams, useNavigate }   from "react-router-dom";

import Desplegable              from "./FormPage/Desplegable";
import DatosPropiedad           from "./FormPage/DatosPropiedad";
import ArquitectoPatrocinante   from "./FormPage/ArquitectoPatrocinante"

import useFetchDatos    from "./hooks/useFetchDatos";

import Formulario1      from "./Formularios/Formulario1";
import CargaOcupacion   from "./Formularios/CargaOcupacion";
import ExportarForm     from "./Formularios/ExportarForm";
import DatosPropietario from "./FormPage/DatosPropietario";
import SolicitudArt124 from "./Formularios/SolicitudArt124";

const ExpedienteDetalle = () => {
    const { id } = useParams(); 
    const { datos, error } = useFetchDatos(id); // Usa el hook para obtener los datos

    const [expediente, setExpediente] = useState(null);
    const [propiedad, setPropiedad] = useState(null); // Estado para la propiedad
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);


    if (error) {
        return <p>Error al cargar los datos: {error}</p>;
    }

    if (!datos.expediente) {
        return <p>Cargando datos del expediente...</p>;
    }

    const handleSavePropietario = (propietarioData) => {
        console.log("Guardando datos del propietario:", propietarioData);
        // Aquí puedes realizar el fetch para guardar los datos en el backend
    };

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


            <Desplegable title="Datos de la Propiedad">
                {/* <DatosPropiedad propiedad={datos.propiedad} onSave={handleSavePropiedad} onCancel={() => setIsEditing(false)} /> */}
                <DatosPropiedad
                    propiedad={datos.propiedad} // Pasa la propiedad desde el hook
                    onSave={(nuevaPropiedad) => {
                        console.log("Propiedad actualizada:", nuevaPropiedad);
                        // Aquí puedes actualizar la base de datos o el estado global
                    }}
                />
            </Desplegable>

            <Desplegable title="Datos del Propietario">
                <DatosPropietario propietario={datos.propietario} onSave={handleSavePropietario} />

            </Desplegable>

            <Desplegable title="Datos del Arquitecto Patrocinante">
                <ArquitectoPatrocinante
                    usuario={datos.usuario} // 
                    onUpdate={(updatedData) => {
                        console.log("Datos actualizados del Arquitecto Patrocinante:", updatedData);
                    }}
                />
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
                <SolicitudArt124 />
            </Desplegable>


            <button onClick={handleCancel}>Volver</button>        


        </div>

    );
};


export default ExpedienteDetalle;
