import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import DatosPropiedad from "./FormPage/DatosPropiedad";
import DatosPropietario from './FormPage/DatosPropietario';
import Desplegable from './FormPage/Desplegable';
import { auth } from "../firebase";
import '../styles/FormPage.css'


function ExpedienteFormPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const tipo = searchParams.get("tipo");
    const subtipo = searchParams.get("subtipo");

    const [tipoNombre, setTipoNombre] = useState("");
    const [subtipoNombre, setSubtipoNombre] = useState("");
    const [formData, setFormData] = useState({
        propiedad: {},
        propietario: {},
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
            alert("Usuario no autenticado. Por favor, inicia sesion");
            return;
        }

        try {
            const response = await fetch("http://localhost:4000/expedientes/simple", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    // tipo,
                    // subtipo,
                    // usuarioRut,
                    // estadoExpedienteId: 1,
                    // descripcion: "vivienda unifamiliar - obra nueva",
                    propiedad: formData.propiedad,
                    propietario: formData.propietario,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                alert("Expediente creado exitosamente");
                navigate(`/expedientes/${data.expedienteId}`);
            } else {
                const error = await response.json();
                alert(`Error al crear el expediente: ${error.message}`);
            }
        } catch (err) {
            console.error("Error al enviar los datos:", err);
            alert("Error al enviar los datos.");
        }
    };

    const handleCancel = () => {
        navigate("/dashboard");
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


    return (
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
            <h2>Completa los primeros datos del expediente de {tipoNombre} - {subtipoNombre} </h2>

            <Desplegable title="Datos de la Propiedad" defaultExpanded>
                <DatosPropiedad onUpdate={(data) => handleUpdate("propiedad", data)} />
            </Desplegable>

            <Desplegable title="Datos del Propietario">
                <DatosPropietario onUpdate={(data) => handleUpdate("propietario", data)} />
            </Desplegable>

            <div className="botones-der">
                <button onClick={handleCancel}>Cancelar</button>
                <button onClick={handleSubmit}>Crear Expediente</button>
                
            </div>
            
        </div>
    );
}


export default ExpedienteFormPage;