import React, { useState } from 'react';


const DatosPropiedad = ({ onUpdate }) => {
    const [propiedad, setPropiedad] = useState({
        rolSII: '',
        direccion: '',
        numero: '',
        comuna: '',
        region: '',
        inscFojas: '',
        InscNumero: '',
        InscYear: '',
        numPisos: '',
        m2: '',
        destino: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
<<<<<<< Updated upstream
        setPropiedad({ ...propiedad, [name]: value });
        onUpdate({ ...propiedad, [name]: value });
=======
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        if (!token) {
            alert("Token no encontrado. Por favor, inicia sesión nuevamente.");
            return;
        }

        try {
            await onSave(formData, token);
            setIsEditing(false);
        } catch (err) {
            console.error("Error al guardar la propiedad:", err);
            alert("Error al guardar los datos. Inténtalo de nuevo.");
        }
>>>>>>> Stashed changes
    };


    // return (
    //     <div>
    //         {/* <h3>Datos de la Propiedad</h3> */}
    //         <form onSubmit={handleSubmit}>
    //             {[
    //                 { label: "Rol SII", name: "rolSII" },
    //                 { label: "Dirección", name: "direccion" },
    //                 { label: "Número", name: "numero", type: "number" },
    //                 { label: "Comuna", name: "comuna" },
    //                 { label: "Región", name: "region" },
    //                 { label: "Inscripción en Fojas", name: "inscFojas" },
    //                 { label: "Inscripción Número", name: "inscNumero", type: "number" },
    //                 { label: "Año de Inscripción", name: "inscYear", type: "number" },
    //                 { label: "Número de Pisos", name: "numPisos", type: "number" },
    //                 { label: "Metros Cuadrados (m²)", name: "m2", type: "number", step: "0.01" },
    //                 { label: "Destino", name: "destino" },
    //             ].map(({ label, name, type = "text", step }) => (
    //                 <div key={name} style={{ marginBottom: "10px" }}>
    //                     <label>{label}:</label>
    //                     <input
    //                         type={type}
    //                         name={name}
    //                         step={step}
    //                         value={formData[name] || ""}
    //                         onChange={handleChange}
    //                         disabled={!isEditing}
    //                     />
    //                 </div>
    //             ))}
    //             {isEditing ? (
    //                 <div>
    //                     <button type="submit" style={{ marginRight: "10px" }}>Guardar</button>
    //                     <button type="button" onClick={() => setIsEditing(false)}>Cancelar</button>
    //                 </div>
    //             ) : (
    //                 <button type="button" onClick={() => setIsEditing(true)}>Editar</button>
    //             )}
    //         </form>
    //     </div>
    // );

    return (
        <div>
<<<<<<< Updated upstream
            <form>
                <div>
                    <label>Rol SII:</label>
                    <input
                        name="rolSII"
                        value={propiedad.rolSII}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Dirección:</label>
                    <input
                        name="direccion"
                        value={propiedad.direccion}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Número:</label>
                    <input
                        name="numero"
                        type="number"
                        value={propiedad.numero}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Comuna:</label>
                    <input
                        name="comuna"
                        value={propiedad.comuna}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Región:</label>
                    <input
                        name="region"
                        value={propiedad.region}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Inscripción en Fojas:</label>
                    <input
                        name="inscFojas"
                        value={propiedad.inscFojas}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Inscripción Número:</label>
                    <input
                        name="InscNumero"
                        type="number"
                        value={propiedad.InscNumero}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Año de Inscripción:</label>
                    <input
                        name="InscYear"
                        type="number"
                        value={propiedad.InscYear}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Número de Pisos:</label>
                    <input
                        name="numPisos"
                        type="number"
                        value={propiedad.numPisos}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Metros Cuadrados (m²):</label>
                    <input
                        name="m2"
                        type="number"
                        step="0.01"
                        value={propiedad.m2}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Destino:</label>
                    <input
                        name="destino"
                        value={propiedad.destino}
                        onChange={handleChange}
                    />
                </div>
=======
            <form onSubmit={handleSubmit}>
                {[{
                    label: "Rol SII", name: "rolSII"
                }, {
                    label: "Dirección", name: "direccion"
                }].map(({ label, name, type = "text", step }) => (
                    <div key={name}>
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
                        <button type="submit">Guardar</button>
                        <button type="button" onClick={() => setIsEditing(false)}>Cancelar</button>
                    </div>
                ) : (
                    <button type="button" onClick={() => setIsEditing(true)}>Editar</button>
                )}
>>>>>>> Stashed changes
            </form>
        </div>
    );
};

export default DatosPropiedad;