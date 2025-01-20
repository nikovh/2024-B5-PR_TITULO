import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { auth } from "../firebase";
import Desplegable from "./FormPage/Desplegable";
import DatosPropietario from './FormPage/DatosPropietario';
import DatosPropiedad from "./FormPage/DatosPropiedad";
import "../styles/FormPage.css";

function ExpedienteFormPage() {
    const navigate = useNavigate();
    const [descripcion, setDescripcion] = useState("");
    const [responseMessage, setResponseMessage] = useState("");
    const [tipo, setTipo] = useState("");
    const [subtipo, setSubtipo] = useState("");
    const [tipoNombre, setTipoNombre] = useState("");
    const [subtipoNombre, setSubtipoNombre] = useState("");
    const [searchParams] = useSearchParams();

    const [propietario, setPropietario] = useState(null);
    const [propiedad, setPropiedad] = useState(null);

    const [propietariosList, setPropietariosList] = useState([]);
    const [propietarioSeleccionado, setPropietarioSeleccionado] = useState("");
    const [esNuevoPropietario, setEsNuevoPropietario] = useState(false);

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
    }, [searchParams, tipo, subtipo]);

    // manejar la seleccion de propietario
    const handlePropietarioSeleccionado = (rut) => {
        setPropietarioSeleccionado(rut);

        if (rut === "nuevo") {
            setEsNuevoPropietario(true);
            setPropietario({ rut: "", nombres: "", apellidos: "", email: "", telefono: "", datosValidos: false, });
        } else {
            setEsNuevoPropietario(false);

            const propietarioExistente = propietariosList.find((p) => p.rut === rut);
            if (propietarioExistente) {
                setPropietario({ ...propietarioExistente, datosValidos: true });
                console.log("Propietario seleccionado", propietarioExistente);
            }
        }
    };

    const handlePropietarioUpdate = (updatedPropietario) => {
        setPropietario(updatedPropietario); // Actualizar el estado con los datos del componente hijo
    };

    const handleSubmit = async () => {
        if (!propietario || !propietario.datosValidos) {
            alert("Por favor, complete todos los datos del propietario.");
            return;
        }

        if ( !propiedad || !propiedad.datosValidos) {
            alert("Por favor, complete todos los datos de la propiedad.");
            console.log("Propiedad invalida o incompleta:", propiedad);
            return;
        }

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

        try {
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
                alert("Expediente creado exitosamente!");
            } else {
                const error = await response.json();
                setResponseMessage(`Error: ${error.message}`);
            }
        } catch (err) {
            setResponseMessage("Error al conectar con el backend.");
            console.error(err);
        }
    };

    const handleCancel = () => navigate("/dashboard");
    
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

        {/* Datos del Propietario */}
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
                <DatosPropietario onUpdate={setPropietario} />
            )}
        </Desplegable>

        {/* Datos de la Propiedad */}
        <Desplegable title="Datos de la Propiedad">
            <DatosPropiedad
                onUpdate={(updatedPropiedad) => {
                    console.log("Propiedad actualizada:", updatedPropiedad);
                    setPropiedad(updatedPropiedad);
                }}
            />
        </Desplegable>

        {/* Botones */}
        <div className="botones-der">
            <button onClick={handleCancel}>Volver</button>
            <button onClick={handleSubmit}>Crear expediente</button>
        </div>
    </div>
);
}


export default ExpedienteFormPage;
