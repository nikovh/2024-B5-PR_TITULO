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
        setPropiedad({ ...propiedad, [name]: value });
        onUpdate({ ...propiedad, [name]: value });
    };

    return (
        <div>
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
            </form>
        </div>
    );
};

export default DatosPropiedad;