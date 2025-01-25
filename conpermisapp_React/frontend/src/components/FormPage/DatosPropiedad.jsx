import React, { useState, useEffect } from "react";

const DatosPropiedad = ({ propiedad, onSave }) => {
    const [formData, setFormData] = useState({
        rolSII: '',
        direccion: '',
        numero: '',
        comuna: '',
        region: '',
        inscFojas: '',
        inscNumero: '',
        inscYear: '',
        numPisos: '',
        m2: '',
        destino: '',
    });

    const [isEditing, setIsEditing] = useState(false);

    // datos iniciales
    useEffect(() => {
        if (propiedad) {
            setFormData({
                rolSII: propiedad.rolSII || '',
                direccion: propiedad.direccion || '',
                numero: propiedad.numero || '',
                comuna: propiedad.comuna || '',
                region: propiedad.region || '',
                inscFojas: propiedad.inscFojas || '',
                inscNumero: propiedad.inscNumero || '',
                inscYear: propiedad.inscYear || '',
                numPisos: propiedad.numPisos || '',
                m2: propiedad.m2 || '',
                destino: propiedad.destino || '',
            });
        }
    }, [propiedad]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        setIsEditing(false);
    };

    return (
        <div>
            {/* <h3>Datos de la Propiedad</h3> */}
            <form onSubmit={handleSubmit}>
                {[
                    { label: "Rol SII", name: "rolSII" },
                    { label: "Dirección", name: "direccion" },
                    { label: "Número", name: "numero", type: "number" },
                    { label: "Comuna", name: "comuna" },
                    { label: "Región", name: "region" },
                    { label: "Inscripción en Fojas", name: "inscFojas" },
                    { label: "Inscripción Número", name: "inscNumero", type: "number" },
                    { label: "Año de Inscripción", name: "inscYear", type: "number" },
                    { label: "Número de Pisos", name: "numPisos", type: "number" },
                    { label: "Metros Cuadrados (m²)", name: "m2", type: "number", step: "0.01" },
                    { label: "Destino", name: "destino" },
                ].map(({ label, name, type = "text", step }) => (
                    <div key={name} style={{ marginBottom: "10px" }}>
                        <label>{label}:</label>
                        <input
                            type={type}
                            name={name}
                            step={step}
                            value={formData[name] || ""}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </div>
                ))}
                {isEditing ? (
                    <div>
                        <button type="submit" style={{ marginRight: "10px" }}>Guardar</button>
                        <button type="button" onClick={() => setIsEditing(false)}>Cancelar</button>
                    </div>
                ) : (
                    <button type="button" onClick={() => setIsEditing(true)}>Editar</button>
                )}
            </form>
        </div>
    );
};

export default DatosPropiedad;
