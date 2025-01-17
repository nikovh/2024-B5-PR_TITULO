// import React, { useState, useEffect } from "react";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import DatosPropiedad from "./FormPage/DatosPropiedad";
// import DatosPropietario from './FormPage/DatosPropietario';
// import Desplegable from './FormPage/Desplegable';
// import { auth } from "../firebase";
// import '../styles/FormPage.css'


// function ExpedienteFormPage() {
//     const [searchParams] = useSearchParams();
//     const navigate = useNavigate();

//     const tipo = searchParams.get("tipo");
//     const subtipo = searchParams.get("subtipo");

//     const [tipoNombre, setTipoNombre] = useState("");
//     const [subtipoNombre, setSubtipoNombre] = useState("");
//     const [formData, setFormData] = useState({
//         propiedad: {},
//         propietario: {},
//     });

//     const handleUpdate = (section, data) => {
//         setFormData((prev) => ({
//             ...prev,
//             [section]: data,
//         }));
//     };

//     const handleSubmit = async () => {

//         const usuarioRut = auth.currentUser?.email || null;
//         if (!usuarioRut) {
//             alert("Usuario no autenticado. Por favor, inicia sesion");
//             return;
//         }

//         try {
//             const response = await fetch("http://localhost:4000/expedientes/simple", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     // tipo,
//                     // subtipo,
//                     // usuarioRut,
//                     // estadoExpedienteId: 1,
//                     // descripcion: "vivienda unifamiliar - obra nueva",
//                     propiedad: formData.propiedad,
//                     propietario: formData.propietario,
//                 }),
//             });

//             if (response.ok) {
//                 const data = await response.json();
//                 alert("Expediente creado exitosamente");
//                 navigate(`/expedientes/${data.expedienteId}`);
//             } else {
//                 const error = await response.json();
//                 alert(`Error al crear el expediente: ${error.message}`);
//             }
//         } catch (err) {
//             console.error("Error al enviar los datos:", err);
//             alert("Error al enviar los datos.");
//         }
//     };

//     const handleCancel = () => {
//         navigate("/dashboard");
//     };

//     useEffect(() => {
//         const fetchNombres = async () => {
//             try {
//                 // Fetch tipos
//                 const tipoResponse = await fetch(`http://localhost:4000/expedientes/tipo-expediente`);
//                 const tipos = await tipoResponse.json();
//                 const tipoEncontrado = tipos.find(t => String(t.id) === tipo);
    
//                 // Fetch subtipos
//                 const subtipoResponse = await fetch(`http://localhost:4000/expedientes/subtipo-expediente`);
//                 const subtipos = await subtipoResponse.json();
//                 const subtipoEncontrado = subtipos.find(st => String(st.id) === subtipo);
    
//                 setTipoNombre(tipoEncontrado?.nombre || "Desconocido");
//                 setSubtipoNombre(subtipoEncontrado?.nombre || "Desconocido");
//             } catch (err) {
//                 console.error("Error al obtener tipo y subtipo:", err);
//             }
//         };
    
//         fetchNombres();
//     }, [tipo, subtipo]);


//     return (
//         <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
//             <h2>Completa los primeros datos del expediente de {tipoNombre} - {subtipoNombre} </h2>

//             <Desplegable title="Datos de la Propiedad" defaultExpanded>
//                 <DatosPropiedad onUpdate={(data) => handleUpdate("propiedad", data)} />
//             </Desplegable>

//             <Desplegable title="Datos del Propietario">
//                 <DatosPropietario onUpdate={(data) => handleUpdate("propietario", data)} />
//             </Desplegable>

//             <div className="botones-der">
//                 <button onClick={handleCancel}>Cancelar</button>
//                 <button onClick={handleSubmit}>Crear Expediente</button>
                
//             </div>
            
//         </div>
//     );
// }


// export default ExpedienteFormPage;


// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { auth } from "../firebase";
// import "../styles/FormPage.css";

// function ExpedienteFormPage() {
//     const navigate = useNavigate();

//     const [descripcion, setDescripcion] = useState("");
//     const [tipo, setTipo] = useState("");
//     const [subtipo, setSubtipo] = useState("");
//     const [isLoading, setIsLoading] = useState(false);

//     const handleSubmit = async () => {
//         const usuarioRut = auth.currentUser?.email || null;

//         if (!descripcion || !tipo || !subtipo) {
//             alert("Por favor, completa todos los campos obligatorios.");
//             return;
//         }

//         setIsLoading(true);

//         try {
//             const response = await fetch("http://localhost:4000/expedientes", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json", 
//                 },
//                 body: JSON.stringify({
//                     descripcion,
//                     tipo,
//                     subtipo,
//                     usuarioRut,
//                     estadoExpedienteId: 1, // Estado inicial
//                 }),
//             });

//             if(response.ok) {
//                 const data = await response.json();
//                 alert("Expediente creado exitosamente.");

//                 //redigir a ExpedienteDetalle
//                 navigate(`/expedientes/${data.expedienteId}`);
//             } else {
//                 const error = await response.json();
//                 alert(`Error al crear el expediente: ${error.message}`);
//             }
//         } catch (err) {
//             console.error("Error al crear el expediente:", err);
//             alert("Error al crear el expediente.");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleCancel = () => {
//         navigate("/dashboard");
//     };

//     return (
//         <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
//             <div className="form-page-container">
//                 <h2>Crear Nuevo Expediente</h2>

//                 <div className="form-group">
//                     <label htmlFor="descripcion">Descripción</label>
//                     <input
//                         type="text"
//                         id="descripcion"
//                         value={descripcion}
//                         onChange={(e) => setDescripcion(e.target.value)}
//                     />
//                 </div>

//                 <div className="form-group">
//                     <label htmlFor="tipo">Tipo de Expediente</label>
//                     <input
//                         type="text"
//                         id="tipo"
//                         value={tipo}
//                         onChange={(e) => setTipo(e.target.value)}
//                     />
//                 </div>

//                 <div className="form-group">
//                     <label htmlFor="subtipo">Subtipo de Expediente</label>
//                     <input
//                         type="text"
//                         id="subtipo"
//                         value={subtipo}
//                         onChange={(e) => setSubtipo(e.target.value)}
//                     />
//                 </div>

//                 <div className="form-buttons">
//                     <button onClick={handleCancel}>Cancelar</button>
//                     <button onClick={handleSubmit} disabled={isLoading}>
//                         {isLoading ? "Creando..." : "Crear Expediente"}
//                     </button>
                
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default ExpedienteFormPage;

/*
import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Desplegable from "./FormPage/Desplegable";
import DatosPropietario from "./FormPage/DatosPropietario";
import DatosPropiedad from "./FormPage/DatosPropiedad";
import { auth } from "../firebase";
import "../styles/FormPage.css";

function ExpedienteFormPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Recibir valores de tipo y subtipo desde el modal
    const tipo = searchParams.get("tipo");
    const subtipo = searchParams.get("subtipo");

    // Estado para los datos del formulario
    const [formData, setFormData] = useState({
        propietario: {},
        propiedad: {},
        expediente: {
            tipo,
            subtipo,
            descripcion: "",
        },
    });

    const handleUpdate = (section, data) => {
        setFormData((prev) => ({
            ...prev,
            [section]: data,
        }));
    };

    const handleSubmit = async () => {
        const usuarioRut = auth.currentUser?.email || null;

        if (!usuarioRut) {
            alert("Usuario no autenticado. Por favor, inicia sesión.");
            return;
        }

        try {
            // Crear expediente con propietario y propiedad
            const response = await fetch("http://localhost:4000/expedientes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData.expediente,
                    propietario: formData.propietario,
                    propiedad: formData.propiedad,
                    usuarioRut,
                    estadoExpedienteId: 1, // Estado inicial
                }),
            });

            if (response.ok) {
                const data = await response.json();
                alert("Expediente creado exitosamente.");
                navigate(`/expedientes/${data.expedienteId}`);
            } else {
                const error = await response.json();
                alert(`Error al crear el expediente: ${error.message}`);
            }
        } catch (err) {
            console.error("Error al crear el expediente:", err);
            alert("Error al crear el expediente.");
        }
    };

    const handleCancel = () => {
        navigate("/dashboard");
    };

    return (
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
            <div className="form-page-container">
            <h2>Crear Expediente</h2>


                <div className="form-group">
                    <label htmlFor="descripcion">Descripción</label>
                    <input
                        type="text"
                        id="descripcion"
                        value={formData.expediente.descripcion}
                        onChange={(e) =>
                            handleUpdate("expediente", { ...formData.expediente, descripcion: e.target.value })
                        }
                    />
                </div>


            <Desplegable title="Datos del Propietario" defaultExpanded>
                <DatosPropietario onUpdate={(data) => handleUpdate("propietario", data)} />
            </Desplegable>

            <Desplegable title="Datos de la Propiedad">
                <DatosPropiedad onUpdate={(data) => handleUpdate("propiedad", data)} />
            </Desplegable>



            <div className="botones-der">
                <button onClick={handleCancel}>Cancelar</button>
                <button onClick={handleSubmit}>Crear Expediente</button>
            </div>
        </div>
        </div>
        
    );
}

export default ExpedienteFormPage;

*/



import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { auth } from "../firebase";
import "../styles/FormPage.css";

function ExpedienteFormPage() {
    const [descripcion, setDescripcion] = useState("");
    const [responseMessage, setResponseMessage] = useState("");
    const [tipo, setTipo] = useState("");
    const [subtipo, setSubtipo] = useState("");
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    useEffect(() => {
        const tipoParam = searchParams.get("tipo");
        const subtipoParam = searchParams.get("subtipo");
        if (tipoParam) setTipo(tipoParam);
        if (subtipoParam) setSubtipo(subtipoParam);
    }, [searchParams]);

    const handleSubmit = async () => {
        // Obtener el correo del usuario autenticado
        const usuarioEmail = auth.currentUser?.email || null;

        try {
            const datosEnviados = {
                descripcion,
                usuarioEmail,
                tipo,
                subtipo,
            };
            console.log("Datos enviados al backend:", datosEnviados);

            const response = await fetch("http://localhost:4000/expedientes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(datosEnviados),
            }); 

            if (response.ok) {
                const data = await response.json();
                setResponseMessage(`Expediente creado: ${data.message}`);
            } else {
                const error = await response.json();
                setResponseMessage(`Error: ${error.message}`);
            }
        } catch (err) {
            setResponseMessage("Error al conectar con el backend.");
            console.error(err);
        }
    };

    const handleCancel = () => {
        navigate("/dashboard");
    };

    return (
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
            <h2>Prueba de creación de expediente</h2>
            <div>
                <label>Descripción:</label>
                <input
                    type="text"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                />
            </div>

            <div className="botones-der">
                <button onClick={handleCancel}>Cancelar</button>
                <button onClick={handleSubmit}>Enviar</button>  
            </div>

            <p>{responseMessage}</p>
        </div>
    );
}

export default ExpedienteFormPage;
