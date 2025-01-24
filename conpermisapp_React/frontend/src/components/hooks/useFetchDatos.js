// import { useEffect, useState } from "react";

// const useFetchDatos = (expedienteId) => {
//     const [datos, setDatos] = useState({
//         propiedad: null,
//         propietario: null,
//         expediente: null,
//         usuario: null,
//         tipoExpediente: null,
//         subTipoExpediente: null,
//         estadoExpediente: null,
//     });
//     const [error, setError] = useState(null);
    
//     console.log("Intentando obtener datos para expedienteId:", expedienteId);
//     useEffect(() => {
//         if (!expedienteId) return;
        
//         const fetchDatos = async () => {
//             try {
//                 setError(null); // limpia errores previos
//                 const token = localStorage.getItem("token");

//                 if(!token) {
//                     throw new Error("Token no encontrado. Inicia sesión nuevamente");
//                 }

//                 const headers = {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${token}`,
//                 };

//                 // Obtener expediente
//                 console.log("Intentando obtener el expediente...");
//                 const expedienteResponse = await fetch(`http://localhost:4000/expedientes/${expedienteId}`, {
//                     headers,
//                 });
//                 if (!expedienteResponse.ok) throw new Error("Error al obtener el expediente");
//                 const expediente = await expedienteResponse.json();
//                 console.log("Expediente obtenido:", expediente);
//                 setDatos((prev) => ({ ...prev, expediente }));

//                 // Obtener propiedad
//                 if (expedienteId) {
//                     console.log("Intentando obtener la propiedad...");
//                     const propiedadResponse = await fetch(`http://localhost:4000/propiedades/expedientes/${expedienteId}`);
//                     if (!propiedadResponse.ok) throw new Error("Error al obtener la propiedad");
//                     const propiedad = await propiedadResponse.json();
//                     console.log("Propiedad obtenida:", propiedad);
//                     setDatos((prev) => ({ ...prev, propiedad }));
//                 } else {
//                     console.warn("No se encontró un expedienteId para obtener la propiedad.");
//                 }

//                 // Obtener propietario
//                 if (expediente.propietarioRut) {
//                     console.log("Intentando obtener el propietario...");
//                     const propietarioResponse = await fetch(`http://localhost:4000/propietarios/${expediente.propietarioRut}`);
//                     if (!propietarioResponse.ok) throw new Error("Error al obtener el propietario");
//                     const propietario = await propietarioResponse.json();
//                     console.log("Propietario obtenido:", propietario);
//                     setDatos((prev) => ({ ...prev, propietario }));
//                 } else {
//                     console.warn("No se encontró un propietarioRut para obtener el propietario.");
//                 }

//                 // Obtener usuario
//                 if (expediente.Usuario_email) {
//                     console.log("Intentando obtener el usuario...");
//                     const usuarioResponse = await fetch(`http://localhost:4000/usuarios/email/${expediente.Usuario_email}`);
//                     if (!usuarioResponse.ok) throw new Error("Error al obtener el usuario");
//                     const usuario = await usuarioResponse.json();
//                     setDatos((prev) => ({ ...prev, usuario }));
//                 } else {
//                     console.warn("No se encontró un Usuario_email para obtener el usuario.");
//                 }

//                 // Obtener tipo expediente
//                 if (expediente.tipo) {
//                     console.log("Intentando obtener el tipo de expediente...");
//                     const tipoExpedienteResponse = await fetch(`http://localhost:4000/expedientes/tipo-expediente`);
//                     if (!tipoExpedienteResponse.ok) throw new Error("Error al obtener el tipo de expediente");
//                     const tipoExpediente = await tipoExpedienteResponse.json();
//                     const tipoEncontrado = tipoExpediente.find((t) => t.id === expediente.tipo);
//                     setDatos((prev) => ({ ...prev, tipoExpediente: tipoEncontrado || null }));
//                 }


//                 // Obtener subtipo expediente
//                 if (expediente.subtipo) {
//                     console.log("Intentando obtener el subtipo de expediente...");
//                     const subTipoExpedienteResponse = await fetch(`http://localhost:4000/expedientes/subtipo-expediente`);
//                     if (!subTipoExpedienteResponse.ok) throw new Error("Error al obtener el subtipo de expediente");
//                     const subTipoExpediente = await subTipoExpedienteResponse.json();
//                     const subTipoEncontrado = subTipoExpediente.find((st) => st.id === expediente.subtipo);
//                     setDatos((prev) => ({ ...prev, subTipoExpediente: subTipoEncontrado || null }));
//                 }

//                 // Obtener estado del expediente
//                 // if (expediente.EstadoExpediente_id) {
//                 //     console.log("Intentando obtener el estado del expediente...");
//                 //     const estadoExpedienteResponse = await fetch(`http://localhost:4000/estadoExpedientes/${expediente.EstadoExpediente_id}`);
//                 //     if (!estadoExpedienteResponse.ok) throw new Error("Error al obtener el estado del expediente");
//                 //     const estadoExpediente = await estadoExpedienteResponse.json();
//                 //     setDatos((prev) => ({ ...prev, estadoExpediente }));
//                 // }
//                 if (expediente.estadoNombre) {
//                     console.log("Estado del expediente:", expediente.estadoNombre);
//                     setDatos((prev) => ({ ...prev, estadoExpediente: expediente.estadoNombre }));
//                 }

//             } catch (err) {
//                 console.error("Error en el fetch:", err.message);
//                 setError(err.message);
//             }
//         };

//         fetchDatos();
//     }, [expedienteId]);

//     return { datos, error };
// };

// export default useFetchDatos;

import { useEffect, useState } from "react";

const useFetchDatos = (expedienteId) => {
    const [datos, setDatos] = useState({
        propiedad: null,
        propietario: null,
        expediente: null,
        usuario: null,
        tipoExpediente: null,
        subTipoExpediente: null,
        estadoExpediente: null,
    });
    const [error, setError] = useState(null);

    console.log("Intentando obtener datos para expedienteId:", expedienteId);

    useEffect(() => {
        if (!expedienteId) return;

        const fetchDatos = async () => {
            try {
                setError(null); // Limpia errores previos
                const token = localStorage.getItem("token");

                if (!token) {
                    throw new Error("Token no encontrado. Por favor, inicia sesión nuevamente.");
                }

                const headers = {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                };

                // Obtener expediente
                console.log("Intentando obtener el expediente...");
                const expedienteResponse = await fetch(`http://localhost:4000/expedientes/${expedienteId}`, {
                    headers,
                });
                if (!expedienteResponse.ok) throw new Error("Error al obtener el expediente");
                const expediente = await expedienteResponse.json();
                console.log("Expediente obtenido:", expediente);
                setDatos((prev) => ({ ...prev, expediente }));

                // Obtener propiedad
                if (expedienteId) {
                    console.log("Intentando obtener la propiedad...");
                    const propiedadResponse = await fetch(`http://localhost:4000/propiedades/expedientes/${expedienteId}`, {
                        headers,
                    });
                    if (!propiedadResponse.ok) throw new Error("Error al obtener la propiedad");
                    const propiedad = await propiedadResponse.json();
                    console.log("Propiedad obtenida:", propiedad);
                    setDatos((prev) => ({ ...prev, propiedad }));
                } else {
                    console.warn("No se encontró un expedienteId para obtener la propiedad.");
                }

                // Obtener propietario
                if (expediente.propietarioRut) {
                    console.log("Intentando obtener el propietario...");
                    const propietarioResponse = await fetch(`http://localhost:4000/propietarios/${expediente.propietarioRut}`, {
                        headers,
                    });
                    if (!propietarioResponse.ok) throw new Error("Error al obtener el propietario");
                    const propietario = await propietarioResponse.json();
                    console.log("Propietario obtenido:", propietario);
                    setDatos((prev) => ({ ...prev, propietario }));
                } else {
                    console.warn("No se encontró un propietarioRut para obtener el propietario.");
                }

                // Obtener usuario
                if (expediente.Usuario_email) {
                    console.log("Intentando obtener el usuario...");
                    const usuarioResponse = await fetch(`http://localhost:4000/usuarios/email/${expediente.Usuario_email}`, {
                        headers,
                    });
                    if (!usuarioResponse.ok) throw new Error("Error al obtener el usuario");
                    const usuario = await usuarioResponse.json();
                    setDatos((prev) => ({ ...prev, usuario }));
                } else {
                    console.warn("No se encontró un Usuario_email para obtener el usuario.");
                }

                // Obtener tipo expediente
                if (expediente.tipo) {
                    console.log("Intentando obtener el tipo de expediente...");
                    const tipoExpedienteResponse = await fetch(`http://localhost:4000/expedientes/tipo-expediente`, {
                        headers,
                    });
                    if (!tipoExpedienteResponse.ok) throw new Error("Error al obtener el tipo de expediente");
                    const tipoExpediente = await tipoExpedienteResponse.json();
                    const tipoEncontrado = tipoExpediente.find((t) => t.id === expediente.tipo);
                    setDatos((prev) => ({ ...prev, tipoExpediente: tipoEncontrado || null }));
                }

                // Obtener subtipo expediente
                if (expediente.subtipo) {
                    console.log("Intentando obtener el subtipo de expediente...");
                    const subTipoExpedienteResponse = await fetch(`http://localhost:4000/expedientes/subtipo-expediente`, {
                        headers,
                    });
                    if (!subTipoExpedienteResponse.ok) throw new Error("Error al obtener el subtipo de expediente");
                    const subTipoExpediente = await subTipoExpedienteResponse.json();
                    const subTipoEncontrado = subTipoExpediente.find((st) => st.id === expediente.subtipo);
                    setDatos((prev) => ({ ...prev, subTipoExpediente: subTipoEncontrado || null }));
                }

                // Obtener estado del expediente
                if (expediente.estadoNombre) {
                    console.log("Estado del expediente:", expediente.estadoNombre);
                    setDatos((prev) => ({ ...prev, estadoExpediente: expediente.estadoNombre }));
                }
            } catch (err) {
                console.error("Error en el fetch:", err.message);
                setError(err.message);
            }
        };

        fetchDatos();
    }, [expedienteId]);

    return { datos, error };
};

export default useFetchDatos;
