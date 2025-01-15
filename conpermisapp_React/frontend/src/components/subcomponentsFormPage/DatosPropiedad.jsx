import React, { useState, useEffect } from 'react';
import {firestore} from '../../firebase'

const DatosPropiedad = ({ onUpdate }) => {
    const [propiedad, setPropiedad] = useState({
        rolSII: '',
        Expediente_id: '',
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

    const [expedientes, setExpedientes] = useState([]); // Almacena la lista de expedientes desde Firestore.

    // Cargar expedientes desde Firestore al cargar el componente
    useEffect(() => {
        const fetchExpedientes = async () => {
            try {
                const snapshot = await firestore.collection('Expediente').get();
                const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setExpedientes(data);
            } catch (error) {
                console.error('Error al cargar los expedientes:', error);
            }
        };

        fetchExpedientes();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPropiedad({ ...propiedad, [name]: value });
        onUpdate({ ...propiedad, [name]: value });
    };

    return (
        <div>
            <h3>Datos de la Propiedad</h3>
            <form>
                <div>
                    <label>Rol SII:</label>
                    <input
                        name="rolSII"
                        placeholder="Rol SII"
                        value={propiedad.rolSII}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Expediente:</label>
                    <select
                        name="Expediente_id"
                        value={propiedad.Expediente_id}
                        onChange={handleChange}
                    >
                        <option value="">Seleccione un Expediente</option>
                        {expedientes.map((exp) => (
                            <option key={exp.id} value={exp.id}>
                                {exp.nombre || `Expediente ${exp.id}`} {/* Ajustar según el esquema de Expediente */}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Dirección:</label>
                    <input
                        name="direccion"
                        placeholder="Dirección"
                        value={propiedad.direccion}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Número:</label>
                    <input
                        name="numero"
                        type="number"
                        placeholder="Número"
                        value={propiedad.numero}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Comuna:</label>
                    <input
                        name="comuna"
                        placeholder="Comuna"
                        value={propiedad.comuna}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Región:</label>
                    <input
                        name="region"
                        placeholder="Región"
                        value={propiedad.region}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Inscripción en Fojas:</label>
                    <input
                        name="inscFojas"
                        placeholder="Fojas"
                        value={propiedad.inscFojas}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Inscripción Número:</label>
                    <input
                        name="InscNumero"
                        type="number"
                        placeholder="Número"
                        value={propiedad.InscNumero}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Año de Inscripción:</label>
                    <input
                        name="InscYear"
                        type="number"
                        placeholder="Año"
                        value={propiedad.InscYear}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Número de Pisos:</label>
                    <input
                        name="numPisos"
                        type="number"
                        placeholder="N° de pisos"
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
                        placeholder="Metros cuadrados"
                        value={propiedad.m2}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Destino:</label>
                    <input
                        name="destino"
                        placeholder="Destino"
                        value={propiedad.destino}
                        onChange={handleChange}
                    />
                </div>
            </form>
        </div>
    );
};

export default DatosPropiedad;