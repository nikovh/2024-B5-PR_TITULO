
// import DatosPropiedad from "./FormPage/DatosPropiedad";


import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { auth } from "../firebase";
import Desplegable from "./FormPage/Desplegable";
import DatosPropietario from './FormPage/DatosPropietario';

import "../styles/FormPage.css";

function ExpedienteFormPage() {
    const navigate = useNavigate();
    const [descripcion, setDescripcion] = useState("");
    const [responseMessage, setResponseMessage] = useState("");
    const [tipo, setTipo] = useState("");
    const [subtipo, setSubtipo] = useState("");
    const [propietariosList, setPropietariosList] = useState([]);
    const [propietarioSeleccionado, setPropietarioSeleccionado] = useState("");
    const [propietario, setPropietario] = useState({
        rut: "",
        nombres: "",
        apellidos: "",
        email: "",
        telefono: "",
    });

    const [esNuevoPropietario, setEsNuevoPropietario] = useState(false); //para crear un nuevo prop.

    // const [propiedad, setPropiedad] = useState({
    //     rolSII: "",
    //     direccion: "",
    //     numero: "",
    //     comuna: "",
    //     region: "",
    //     inscFojas: "",
    //     inscNumero: "",
    //     inscYear: "",
    //     numPisos: "",
    //     m2: "",
    //     destino: "",
    // });
    const [tipoNombre, setTipoNombre] = useState("");
    const [subtipoNombre, setSubtipoNombre] = useState("");
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const tipoParam = searchParams.get("tipo") || "";
        const subtipoParam = searchParams.get("subtipo") || "";
        if (tipoParam) setTipo(tipoParam);
        if (subtipoParam) setSubtipo(subtipoParam);

        // Cargar propietarios desde el backend
        fetch("http://localhost:4000/propietarios")
            .then((res) => res.json())
            .then((data) => setPropietariosList(data))
            .catch((err) => console.error("Error al cargar propietarios:", err));
    }, [searchParams]);

    const handlePropietarioSeleccionado = (rut) => {
        setPropietarioSeleccionado(rut);

        if (rut === "nuevo") {
            setEsNuevoPropietario(true);
            setPropietario({ rut: "", nombres: "", apellidos: "", email: "", telefono: "" });
        } else {
            setEsNuevoPropietario(false);
            const propietarioExistente = propietariosList.find((p) => p.rut === rut);
            if (propietarioExistente) {
                setPropietario(propietarioExistente);
            }
        }
    };

    const handlePropietarioUpdate = (updatedPropietario) => {
        setPropietario(updatedPropietario); // Actualizar el estado con los datos del componente hijo
    };

    const handleSubmit = async () => {
        if (!propietario.datosValidos) {
            alert("Por favor, complete todos los datos del propietario.");
            return;
        }

        // Obtener el correo del usuario autenticado
        const usuarioEmail = auth.currentUser?.email || null;

        try {
            const datosEnviados = {
                descripcion,
                usuarioEmail: auth.currentUser?.email || null,
                tipo,
                subtipo,
                propietario,
                esNuevoPropietario,
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
                alert("Expediente creado exitosamente!")
            } else {
                const error = await response.json();
                setResponseMessage(`Error: ${error.message}`);
            }
        } catch (err) {
            setResponseMessage("Error al conectar con el backend.");
            console.error(err);
        }
    };

    useEffect(() => {
        const fetchNombres = async () => {
            try {
                // Fetch tipos
                const tipoResponse = await fetch(`http://localhost:4000/expedientes/tipo-expediente`);
                const tipos = await tipoResponse.json();
                const tipoEncontrado = tipos.find(t => String(t.id) === tipo);

                // Fetch subtipos
                const subtipoResponse = await fetch(`http://localhost:4000/expedientes/subtipo-expediente`);
                const subtipos = await subtipoResponse.json();
                const subtipoEncontrado = subtipos.find(st => String(st.id) === subtipo);

                setTipoNombre(tipoEncontrado?.nombre || "Desconocido");
                setSubtipoNombre(subtipoEncontrado?.nombre || "Desconocido");
            } catch (err) {
                console.error("Error al obtener tipo y subtipo:", err);
            }
        };

        fetchNombres();
    }, [tipo, subtipo]);

    const handleCancel = () => {
        navigate("/dashboard");
    };

    return (
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
            <h2>Crear Expediente: {tipoNombre} - {subtipoNombre}</h2>
            <div>
                <label>Descripción:</label>
                <input
                    type="text"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                />
            </div>

            <Desplegable title="Datos del Propietario">
                <div>
                    <label>Seleccionar Propietario:</label>
                    <select
                        value={propietarioSeleccionado}
                        onChange={(e) => handlePropietarioSeleccionado(e.target.value)}
                    >
                        <option value="">Seleccione un propietario</option>
                        {propietariosList.map((propietario) => (
                            <option key={propietario.rut} value={propietario.rut}>
                                {propietario.rut} - {propietario.nombres}
                            </option>
                        ))}
                        <option value="nuevo">Crear nuevo propietario</option>
                    </select>
                </div>

                {esNuevoPropietario && (
                    <DatosPropietario onUpdate={handlePropietarioUpdate} />
                )}
            </Desplegable>

            {/* <Desplegable title="Datos de la Propiedad">

                <div>
                    <label>Rol SII:</label>
                    <input
                        type="text"
                        value={propiedad.rolSII}
                        onChange={(e) => setPropiedad({ ...propiedad, rolSII: e.target.value })}
                    />
                    <label>Dirección:</label>
                    <input
                        type="text"
                        value={propiedad.direccion}
                        onChange={(e) => setPropiedad({ ...propiedad, direccion: e.target.value })}
                    />
                    <label>Número:</label>
                    <input
                        type="number"
                        value={propiedad.numero}
                        onChange={(e) => setPropiedad({ ...propiedad, numero: e.target.value })}
                    />
                    <label>Comuna:</label>
                    <input
                        type="text"
                        value={propiedad.comuna}
                        onChange={(e) => setPropiedad({ ...propiedad, comuna: e.target.value })}
                    />
                    <label>Región:</label>
                    <input
                        type="text"
                        value={propiedad.region}
                        onChange={(e) => setPropiedad({ ...propiedad, region: e.target.value })}
                    />
                    <label>Inscripción en Fojas:</label>
                    <input
                        type="text"
                        value={propiedad.inscFojas}
                        onChange={(e) => setPropiedad({ ...propiedad, inscFojas: e.target.value })}
                    />
                    <label>Número de Inscripción:</label>
                    <input
                        type="number"
                        value={propiedad.inscNumero}
                        onChange={(e) => setPropiedad({ ...propiedad, inscNumero: e.target.value })}
                    />
                    <label>Año de Inscripción:</label>
                    <input
                        type="number"
                        value={propiedad.inscYear}
                        onChange={(e) => setPropiedad({ ...propiedad, inscYear: e.target.value })}
                    />
                    <label>Número de Pisos:</label>
                    <input
                        type="number"
                        value={propiedad.numPisos}
                        onChange={(e) => setPropiedad({ ...propiedad, numPisos: e.target.value })}
                    />
                    <label>Metros Cuadrados:</label>
                    <input
                        type="number"
                        value={propiedad.m2}
                        onChange={(e) => setPropiedad({ ...propiedad, m2: e.target.value })}
                    />
                    <label>Destino:</label>
                    <input
                        type="text"
                        value={propiedad.destino}
                        onChange={(e) => setPropiedad({ ...propiedad, destino: e.target.value })}
                    />
                </div>
            </Desplegable> */}

            <div className="botones-der">
                <button onClick={handleCancel}>Volver</button>
                <button onClick={handleSubmit}>Enviar</button>
            </div>
        </div>
    );
}

export default ExpedienteFormPage;
