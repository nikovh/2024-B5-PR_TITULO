import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Desplegable from "./FormPage/Desplegable";
import DatosPropiedad from "./FormPage/DatosPropiedad";
import DatosPropietario from "./FormPage/DatosPropietario";

import CargaOcupacion from "./Formularios/CargaOcupacion"
import SolicitudArt124 from "./Formularios/SolicitudArt124"
import FormDeclaracionProp from "./Formularios/FormDeclaracionProp";

const ExpedienteDetalle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [propiedad, setPropiedad] = useState(null);
    const [propietario, setPropietario] = useState(null);
    const [error, setError] = useState(null);

    // // Fetch de los datos de la propiedad y propietario
    // useEffect(() => {
    //     const fetchDatos = async () => {
    //         try {
    //             // Fetch propiedad
    //             const propiedadResponse = await fetch(`http://localhost:4000/propiedades/expedientes/${id}`);
    //             if (!propiedadResponse.ok) throw new Error("No se pudieron cargar los datos de la propiedad.");              
    //             const propiedadData = await propiedadResponse.json();
    //             setPropiedad(propiedadData);

    //             // Fetch propietario
    //             const propietarioResponse = await fetch(`http://localhost:4000/propietarios/${propiedadData.propietarioRut}`);
    //             if (!propietarioResponse.ok) throw new Error("No se pudieron cargar los datos del propietario.");
    //             const propietarios = await propietarioResponse.json();
    //             const propietarioEncontrado = propietarios.find(p => p.rut === propiedadData.propietarioRut);
    //             if (!propietarioEncontrado) throw new Error("Propietario no encontrado.");
    //             setPropietario(propietarioEncontrado);

    //         } catch (err) {
    //             console.error("Error al obtener los datos:", err);
    //             setError(err.message);
    //         }
    //     };

    //     if (id) fetchDatos();
    // }, [id]);

    // fetch propiedad y propietario en un solo llamado
    
    //op2
    // useEffect(() => {
    //     const fetchDatos = async () => {
    //         try {
    //             // Fetch propiedad y expediente en una sola llamada 
    //             const response = await fetch(`http://localhost:4000/expedientes/${id}/detalle`);
    //             if (!response.ok) throw new Error("No se pudieron cargar los datos del expediente.");
    //             const data = await response.json();

    //             console.log("Datos del expediente recibidos:", data);

    //             // Establecer datos de propiedad y expediente
    //             setPropiedad(data.propiedad);

    //             // Validar si el expediente tiene un propietario asociado
    //             if (data.expediente && data.expediente.propietarioRut) {
    //                 console.log("RUT para el fetch del propietario:", data.expediente.propietarioRut);

    //                 // Fetch del propietario
    //                 const propietarioResponse = await fetch(`http://localhost:4000/propietarios?rut=${data.expediente.propietarioRut}`);
    //                 if (!propietarioResponse.ok) {
    //                     throw new Error(`Error al obtener los datos del propietario con RUT ${data.expediente.propietarioRut}`);
    //                 }

    //                 const propietarioData = await propietarioResponse.json();

    //                 if (Array.isArray(propietarioData) && propietarioData.length > 0) {
    //                     setPropietario(propietarioData[0]);
    //                 } else {
    //                     throw new Error("No se encontraron datos del propietario en la respuesta del servidor.");
    //                 }
    //             } else {
    //                 console.warn("El expediente no tiene un propietario asociado.");
    //                 setPropietario(null);
    //             }
    //         } catch (err) {
    //             console.error("Error al obtener los datos:", err);
    //             setError(err.message);
    //         }
    //     };

    //     if (id) fetchDatos();
    // }, [id]);

    useEffect(() => {
        const fetchDatos = async () => {
            try {
                // Fetch propiedad, expediente y propietario en una sola llamada
                const response = await fetch(`http://localhost:4000/expedientes/${id}/detalle`);
                if (!response.ok) throw new Error("No se pudieron cargar los datos del expediente.");
                const data = await response.json();
    
                console.log("Datos del expediente recibidos:", data);
    
                // Establecer datos de propiedad y propietario desde la respuesta
                if (data.propiedad) {
                    setPropiedad(data.propiedad);
                } else {
                    console.warn("No se encontraron datos de la propiedad en la respuesta del servidor.");
                    setPropiedad(null);
                }
    
                if (data.propietario) {
                    setPropietario(data.propietario);
                } else {
                    console.warn("No se encontraron datos del propietario en la respuesta del servidor.");
                    setPropietario(null);
                }
            } catch (err) {
                console.error("Error al obtener los datos:", err);
                setError(err.message);
            }
        };
    
        if (id) fetchDatos();
    }, [id]);
    



    const handleSavePropiedad = (updatedPropiedad) => {
        setPropiedad(updatedPropiedad);
        console.log("Propiedad actualizada:", updatedPropiedad);
    };

    const handleSavePropietario = (updatedPropietario) => {
        setPropietario(updatedPropietario);
        console.log("Propietario actualizado:", updatedPropietario);
    };

    const handleCancel = () => {
        navigate("/dashboard");
    };

    // return (
    //     <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
    //         <h1>Detalles del Expediente</h1>
    //         {error ? (
    //             <p style={{ color: "red" }}>{error}</p>
    //         ) : (
    //             <>
    //                 <Desplegable title="Datos de la Propiedad">
    //                     {propiedad ? (
    //                         <DatosPropiedad 
    //                             propiedad={propiedad} 
    //                             onSave={handleSavePropiedad} 
    //                         />
    //                     ) : (
    //                         <p>Cargando datos de la propiedad...</p>
    //                     )}
    //                 </Desplegable>

    //                 <Desplegable title="Datos del Propietario">
    //                     {propietario ? (
    //                         <DatosPropietario 
    //                             propietario={propietario} 
    //                             onSave={handleSavePropietario} 
    //                         />
    //                     ) : (
    //                         <p>Cargando datos del propietario...</p>
    //                     )}
    //                 </Desplegable>
    //             </>
    //         )}

    //         <button onClick={handleCancel} style={{ marginTop: "20px" }}>Volver</button>
    //     </div>
    // );

    return (

        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>

            <h1>Detalles del Expediente</h1>
            {error ? (
                <p style={{ color: "red" }}>{error}</p>
            ) : (
                <>
                    <Desplegable title="Datos de la Propiedad">
                        {propiedad ? ( <DatosPropiedad propiedad={propiedad} onSave={handleSavePropiedad} /> ) : (<p>No se encontraron datos de la propiedad.</p> )}
                    </Desplegable>

                    <Desplegable title="Datos del Propietario">
                        {propietario ? ( <DatosPropietario propietario={propietario} onSave={handleSavePropietario} /> ) : ( <p>No se encontraron datos del propietario.</p> )}
                    </Desplegable>

                    <Desplegable title="Formulario 1: Declaracion Propietario">
                        <FormDeclaracionProp expedienteId={id} />
                    </Desplegable>
                    <Desplegable title="Informe 1: Carga de Ocupación">
                        <CargaOcupacion />
                    </Desplegable>
                    <Desplegable title="Documento especial 1: Solicitud Art. 124° LGUC ">
                        <SolicitudArt124 expedienteId={id} />
                    </Desplegable>

                </>
            )}

            <button onClick={handleCancel} style={{ marginTop: "20px" }}>Volver</button>
        </div>
    );
};

export default ExpedienteDetalle;
