import { useEffect, useState } from "react";

const useFetchDatos = (expedienteId) => {
    const [datos, setDatos] = useState({
        propiedad: null,
        propietario: null,
        expediente: null,
        usuario: null,
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDatos = async () => {
            try {
                setError(null); // limpia errores previos

                // Obtener expediente
                console.log("Intentando obtener el expediente...");
                const expedienteResponse = await fetch(`http://localhost:4000/expedientes/${expedienteId}`);
                if (!expedienteResponse.ok) throw new Error("Error al obtener el expediente");
                const expediente = await expedienteResponse.json();
                console.log("Expediente obtenido:", expediente);
                setDatos((prev) => ({ ...prev, expediente }));

                // Obtener propiedad
                if (expediente.expedienteId) {
                    console.log("Intentando obtener la propiedad...");
                    const propiedadResponse = await fetch(`http://localhost:4000/propiedades/expedientes/${expediente.expedienteId}`);
                    if (!propiedadResponse.ok) throw new Error("Error al obtener la propiedad");
                    const propiedad = await propiedadResponse.json();
                    console.log("Propiedad obtenida:", propiedad);
                    setDatos((prev) => ({ ...prev, propiedad: propiedad[0] })); // Usamos la primera propiedad si es un array
                } else {
                    console.warn("No se encontró un expedienteId para obtener la propiedad.");
                }

                // Obtener propietario
                if (expediente.propietarioRut) {
                    console.log("Intentando obtener el propietario...");
                    const propietarioResponse = await fetch(`http://localhost:4000/propietarios/${expediente.propietarioRut}`);
                    if (!propietarioResponse.ok) throw new Error("Error al obtener el propietario");
                    const propietario = await propietarioResponse.json();
                    setDatos((prev) => ({ ...prev, propietario }));
                } else {
                    console.warn("No se encontró un propietarioRut para obtener el propietario.");
                }

                // Obtener usuario
                if (expediente.Usuario_email) {
                    console.log("Intentando obtener el usuario...");
                    const usuarioResponse = await fetch(`http://localhost:4000/usuarios/email/${expediente.Usuario_email}`);
                    if (!usuarioResponse.ok) throw new Error("Error al obtener el usuario");
                    const usuario = await usuarioResponse.json();
                    setDatos((prev) => ({ ...prev, usuario }));
                } else {
                    console.warn("No se encontró un Usuario_email para obtener el usuario.");
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