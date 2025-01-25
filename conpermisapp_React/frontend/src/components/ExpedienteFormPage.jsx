import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { auth } from "../firebase";
import Desplegable from "./FormPage/Desplegable";
import DatosPropietario from './FormPage/DatosPropietario';
import DatosPropiedad from "./FormPage/DatosPropiedad";
import "../styles/FormPage.css";

function ExpedienteFormPage() {
    const navigate = useNavigate();

    // estados
    const [descripcion, setDescripcion] = useState("");
    const [errores, setErrores] = useState({ descripcion: "" });
    const [responseMessage, setResponseMessage] = useState("");
    const [tipo, setTipo] = useState("");
    const [subtipo, setSubtipo] = useState("");
    const [tipoNombre, setTipoNombre] = useState("");
    const [subtipoNombre, setSubtipoNombre] = useState("");
    const [searchParams] = useSearchParams();

    const [propietario, setPropietario] = useState(null);
    const [propietariosList, setPropietariosList] = useState([]);
    const [propietarioSeleccionado, setPropietarioSeleccionado] = useState("");
    const [esNuevoPropietario, setEsNuevoPropietario] = useState(false);

    const [propiedad, setPropiedad] = useState(null);
    const [isEditingPropiedad, setIsEditingPropiedad] = useState(false);

    // validacion descripcion
    const validarDescripcion = (desc) => {
        return desc.trim().length > 0 ? "" : "La descripción es necesaria, no olvides completar este campo.";
    };

    // Cargar tipo y subtipo desde el backend
    useEffect(() => {
        const tipoParam = searchParams.get("tipo") || "";
        const subtipoParam = searchParams.get("subtipo") || "";
        setTipo(tipoParam);
        setSubtipo(subtipoParam);

        // Cargar nombres de tipo y subtipo
        const fetchNombres = async () => {
            try {
                // Fetch tipos
                const tipoResponse = await fetch(`http://localhost:4000/expedientes/tipo-expediente`);
                const tipos = await tipoResponse.json();
                const tipoEncontrado = tipos.find(t => String(t.id) === tipoParam);

                // Fetch subtipos
                const subtipoResponse = await fetch(`http://localhost:4000/expedientes/subtipo-expediente`);
                const subtipos = await subtipoResponse.json();
                const subtipoEncontrado = subtipos.find(st => String(st.id) === subtipoParam);

                setTipoNombre(tipoEncontrado?.nombre || "Desconocido");
                setSubtipoNombre(subtipoEncontrado?.nombre || "Desconocido");
            } catch (err) {
                console.error("Error al obtener tipo y subtipo:", err);
            }
        };

        const fetchPropietarios = async () => {
            try {
                const response = await fetch("http://localhost:4000/propietarios");
                const propietarios = await response.json();
                setPropietariosList(propietarios);
                console.log("Propietarios cargados:", propietarios);
            } catch (err) {
                console.error("Error al cargar propietarios:", err);
            }
        };

        fetchNombres();
        fetchPropietarios();
    }, [searchParams]);

    // manejar la seleccion de propietario
    const handlePropietarioSeleccionado = (rut) => {
        setPropietarioSeleccionado(rut);

        if (rut === "nuevo") {
            setEsNuevoPropietario(true);
            setPropietario({ 
                rut: "", 
                nombres: "", 
                apellidos: "", 
                email: "", 
                telefono: "", 
                // datosValidos: false, 
            });
        } else {
            setEsNuevoPropietario(false);

            const propietarioExistente = propietariosList.find((p) => p.rut === rut);
            if (propietarioExistente) {
                setPropietario({ ...propietarioExistente
                    //, datosValidos: true 
                });
                console.log("Propietario seleccionado", propietarioExistente);
            }
        }
    };

    const handlePropietarioUpdate = (updatedPropietario) => {
        setPropietario(updatedPropietario); // Actualizar el estado con los datos del componente hijo
    };


/*
    const handleSubmit = async () => {
        console.log('--- Enviando datos al backend ---');
        console.log('Descripción:', descripcion);
        console.log('Propietario:', propietario);
        console.log('Propiedad:', propiedad);

        const descripcionError = validarDescripcion(descripcion);
        if (descripcionError) {
            setErrores({ descripcion: descripcionError });
            return;
        }

        if (!propietario 
            // || !propietario.datosValidos
        ) {
            alert("Por favor, complete todos los datos del propietario.");
            return;
        }

        if (!propiedad) {
            alert("Por favor, complete los datos de la propiedad. ");
            return;
        }

        try {
            const datosEnviados = {
                descripcion,
                usuarioEmail: auth.currentUser?.email || null,
                tipo,
                subtipo,
                propietario,
                esNuevoPropietario,
                propiedad,
            };
            console.log("Datos enviados al backend:", datosEnviados);

            const response = await fetch("http://localhost:4000/expedientes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datosEnviados),
            });

    //         if (response.ok) {
    //             const error = await response.json();
    //             console.error("Error al crear el expediente:", error);
    //             setResponseMessage(`Error: ${error.message}`);
    //             return;
    //         }

    //         const data = await response.json();
    //         //verificar el id del expediente
    //         if(data.id) {
    //             console.log("Expediente creado con ID:", data.id);
    //             //redirigir
    //             alert("Expediente exitosamente creado. Ahora serás redirigido a la pagina de detalle del expediente para que sigas completando los siguiente datos necesarios ")
    //             navigate(`/detalle/${data.id}`);
    //         } else {
    //             console.error("El backend no devolvió un ID válido para el expediente.");
    //             alert("No se pudo obtener el ID del expediente. Inténtelo nuevamente.");
    //         }

    //     } catch (err) {
    //         console.error(err);
    //         setResponseMessage("Error al conectar con el backend.");
    //     }
    // };
            if (response.ok) {
                const data = await response.json();
                console.log('Expediente creado con éxito:', data);
                alert("Expediente exitosamente creado. Ahora serás redirigido a la pagina de detalle del expediente para que sigas completando los siguiente datos necesarios.");
                navigate(`/detalle/${data.id}`);
            } else {
                alert("Error al crear expediente.");
            }
        } catch (err) {
            console.error("Error al enviar datos:", err);
        }
    };
*/

    const handleSubmit = async () => {
        try {
            console.log('--- Enviando datos al backend ---');
            console.log('Descripción:', descripcion);
            console.log('Propietario:', propietario);
            console.log('Propiedad:', propiedad);

            const datosEnviados = {
                descripcion,
                tipo,
                subtipo,
                propietario,
                propiedad,
            };

            const response = await fetch('http://localhost:4000/expedientes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosEnviados),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error al crear expediente:', errorData);
                alert('Error al crear expediente.');
                return;
            }

            const data = await response.json();
            console.log('Expediente creado:', data);
            alert('Expediente creado exitosamente.');
            navigate(`/detalle/${data.id}`);
        } catch (error) {
            console.error('Error al enviar datos:', error);
            alert('Error de conexión.');
        }
    };




    const handleCancel = () => navigate("/dashboard");

    return (
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
            <h2>Crear Expediente: {tipoNombre} - {subtipoNombre}</h2>

            {/* Descripción */}
            <div>
                <label>Descripción:</label>
                <input
                    type="text"
                    value={descripcion}
                    onChange={(e) => {
                        setDescripcion(e.target.value);
                        setErrores({ descripcion: validarDescripcion(e.target.value) });
                    }}
                />
                {errores.descripcion && (
                    <p style={{ color: "red", fontSize: "12px" }}>{errores.descripcion}</p>
                )}
            </div>

            {/* Datos del Propietario */}
            <Desplegable title="Datos del Propietario">
                <label>Seleccionar Propietario:</label>
                <select
                    value={propietarioSeleccionado}
                    onChange={(e) => handlePropietarioSeleccionado(e.target.value)}
                >
                    <option value="">Seleccione un propietario</option>
                    {propietariosList.map((p) => (
                        <option key={p.rut} value={p.rut}>
                            {p.rut} - {p.nombres}
                        </option>
                    ))}
                    <option value="nuevo">Crear nuevo propietario</option>
                </select>

                {esNuevoPropietario && <DatosPropietario propietario={propietario} onSave={setPropietario} />}
            </Desplegable>

            {/* Datos de la Propiedad */}
            <Desplegable title="Datos de la Propiedad">
                <DatosPropiedad propiedad={propiedad} onSave={setPropiedad} />
            </Desplegable>

            {/* Botones */}
            <div className="botones-der">
                <button onClick={handleCancel}>Cancelar</button>
                <button onClick={handleSubmit}>Crear Expediente</button>
            </div>
        </div>
    );
}


export default ExpedienteFormPage;
