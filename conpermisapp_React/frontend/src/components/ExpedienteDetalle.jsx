// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate }   from "react-router-dom";
// import Desplegable      from "./FormPage/Desplegable";
// import DatosPropiedad           from "./FormPage/DatosPropiedad";
// // import ArquitectoPatrocinante   from "./FormPage/ArquitectoPatrocinante"
// // import DatosPropietario from "./FormPage/DatosPropietario";

// // import CargaOcupacion   from "./Formularios/CargaOcupacion";
// // import SolicitudArt124  from "./Formularios/SolicitudArt124";

// // import useFetchDatos    from "./hooks/useFetchDatos";


// const ExpedienteDetalle = () => {
//     const { id } = useParams(); 
//     // const { datos, error } = useFetchDatos(id); // Usa el hook para obtener los datos
//     const navigate = useNavigate();
//     const [propiedad, setPropiedad] = useState(null); // Estado para la propiedad
//     const [error, setError] = useState(null);

//     // const [expediente, setExpediente] = useState(null);
//     // const [propiedad, setPropiedad] = useState(null); // Estado para la propiedad
//     // const [isEditing, setIsEditing] = useState(false);


//     if (error) return <p>Error: {error}</p>;
//     if (!datos) return <p>Cargando datos...</p>;



//     // Verifica los datos recibidos
//     console.log("Datos", datos);


//     // const handleSavePropiedad = async (nuevaPropiedad) => {
//     //     try {
//     //         const url = propiedad
//     //             ? `http://localhost:4000/propiedades/${propiedad.id}` // Actualización
//     //             : `http://localhost:4000/propiedades`; // Creación
    
//     //         console.log("URL para guardar propiedad:", url);
    
//     //         const response = await fetch(url, {
//     //             method: propiedad ? "PUT" : "POST",
//     //             headers: { "Content-Type": "application/json" },
//     //             body: JSON.stringify({ ...nuevaPropiedad, expedienteId: expediente.expedienteId }),
//     //         });
    
//     //         if (response.ok) {
//     //             const data = await response.json();
//     //             setPropiedad(data); 
//     //             setIsEditing(false);
//     //             alert(propiedad ? "Propiedad actualizada exitosamente" : "Propiedad creada exitosamente");
//     //         } else {
//     //             const errorData = await response.json();
//     //             console.error("Error en el servidor:", errorData);
//     //             alert("Error al guardar la propiedad");
//     //         }
//     //     } catch (err) {
//     //         console.error("Error al guardar la propiedad:", err);
//     //     }
//     // };

//     const handleCancel = () => {
//         navigate("/dashboard");
//     };

//     return (
//         <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
//             <h1>Detalles del Expediente</h1>
//             <p><strong>ID:</strong> {datos.expediente.expedienteId}</p>
//             <p><strong>Descripción:</strong> {datos.expediente.descripcion}</p>
//             <p><strong>Estado:</strong> En proceso</p>
//             <p><strong>Fecha de Creación:</strong> {new Date(datos.expediente.fechaCreacion).toLocaleString()}</p>
//             <p><strong>Propietario:</strong> {datos.expediente.propietarioNombres} {datos.expediente.propietarioApellidos}</p>


//             {/* Desplegable de Datos de la Propiedad */}
//             {/* <Desplegable title="Datos de la Propiedad">
//                 {datos.propiedad ? (
//                     <DatosPropiedad
//                         propiedad={datos.propiedad}
//                         onSave={(nuevaPropiedad) => {
//                             console.log("Propiedad actualizada:", nuevaPropiedad);
//                         }}
//                     />
//                 ) : (
//                     <p>No se encontraron datos de la propiedad.</p>
//                 )}
//             </Desplegable> */}

//             <Desplegable title="Datos de la Propiedad">
//                 {datos.propiedad}
//             </Desplegable>


//             <Desplegable title="Datos del Propietario">
//                     {datos.propietario} 
//             </Desplegable>


//             {/* Desplegable del Arquitecto Patrocinante */}
//             <Desplegable title="Datos del Arquitecto Patrocinante">
//                 {datos.usuario}
//             </Desplegable>



//             <Desplegable title="Formulario 1: Información adicional">
//                 {/* <Formulario1 /> */}
//                 <p>Aquí va el contenido del formulario 1...</p>
//             </Desplegable>
//             <Desplegable title="Formulario 2: Documentación requerida">
//                 <p>Aquí va el contenido del formulario 2...</p>
//             </Desplegable>
//             <Desplegable title="Formulario 3: Carga de Ocupación">
//                 <CargaOcupacion />
//             </Desplegable>
//             <Desplegable title="Formulario 4: Solicitud Art. 124° LGUC ">
//                 <SolicitudArt124 expedienteId={id} />
//             </Desplegable>


//             <button onClick={handleCancel}>Volver</button>        


//         </div>

//     );

//     // return (
//     //     <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
//     //         <h1>Detalle del Expediente</h1>
//     //         <p><strong>ID:</strong> {expediente.id}</p>
//     //         <p><strong>Descripción:</strong> {expediente.descripcion}</p>
//     //         <p><strong>Propietario:</strong> {propietario?.nombres} {propietario?.apellidos}</p>
//     //         <p><strong>Dirección de la Propiedad:</strong> {propiedad?.direccion} {propiedad?.numero}</p>
//     //         <p><strong>Arquitecto:</strong> {usuario?.nombres} {usuario?.apellidos}</p>
//     //         <p><strong>Tipo de Expediente:</strong> {tipoExpediente?.nombre}</p>
//     //         <p><strong>Subtipo de Expediente:</strong> {subTipoExpediente?.nombre}</p>
//     //         <button onClick={() => navigate("/dashboard")}>Volver</button>
//     //     </div>
//     // );

// };

//op2
// export default ExpedienteDetalle;
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Desplegable from "./FormPage/Desplegable";
import DatosPropiedad from "./FormPage/DatosPropiedad";
import DatosPropietario from "./FormPage/DatosPropietario";

const ExpedienteDetalle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [propiedad, setPropiedad] = useState(null);
    const [propietario, setPropietario] =useState(null);
    const [error, setError] = useState(null);

    // Fetch de los datos de la propiedad y propietario
    useEffect(() => {
        const fetchDatos = async () => {
            try {
                // Fetch propiedad
                const propiedadResponse = await fetch(`http://localhost:4000/propiedades/expedientes/${id}`);
                if (!propiedadResponse.ok) throw new Error("No se pudieron cargar los datos de la propiedad.");              
                const propiedadData = await propiedadResponse.json();
                setPropiedad(propiedadData);

                // Fetch propietario
                const propietarioResponse = await fetch(`http://localhost:4000/propietarios/${propiedadData.propietarioRut}`);
                if (!propietarioResponse.ok) throw new Error("No se pudieron cargar los datos del propietario.");
                const propietarios = await propietarioResponse.json();
                const propietarioEncontrado = propietarios.find(p => p.rut === propiedadData.propietarioRut);
                if (!propietarioEncontrado) throw new Error("Propietario no encontrado.");
                setPropietario(propietarioEncontrado);

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

    return (
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
            <h1>Detalles del Expediente</h1>
            {error ? (
                <p style={{ color: "red" }}>{error}</p>
            ) : (
                <>
                    <Desplegable title="Datos de la Propiedad">
                        {propiedad ? (
                            <DatosPropiedad 
                                propiedad={propiedad} 
                                onSave={handleSavePropiedad} 
                            />
                        ) : (
                            <p>Cargando datos de la propiedad...</p>
                        )}
                    </Desplegable>

                    <Desplegable title="Datos del Propietario">
                        {propietario ? (
                            <DatosPropietario 
                                propietario={propietario} 
                                onSave={handleSavePropietario} 
                            />
                        ) : (
                            <p>Cargando datos del propietario...</p>
                        )}
                    </Desplegable>
                </>
            )}

            <button onClick={handleCancel} style={{ marginTop: "20px" }}>Volver</button>
        </div>
    );
};

export default ExpedienteDetalle;
