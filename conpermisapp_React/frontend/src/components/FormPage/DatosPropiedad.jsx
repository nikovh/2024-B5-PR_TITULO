import React, { useState, useCallback } from 'react';

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

    const [errores, setErrores] = useState({
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

    // Validadores
    const validarRolSII = (rol) => {
        const regexRol = /^[0-9]{4}-[0-9]{3}$/; // Formato 4 dígitos - 3 dígitos
        return regexRol.test(rol) ? '' : 'El Rol SII debe tener el formato 4 dígitos - 3 dígitos (Ej: 0123-045).';
    };

    const validarTexto = (texto) => {
        return texto.trim().length > 0 ? '' : 'Este campo es obligatorio.';
    };

    const validarNumeroPositivo = (numero) => {
        return numero > 0 ? '' : 'Debe ser un número positivo.';
    };

    // Función debounce
    const debounce = (func, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), delay);
        };
    };

    // Enviar datos con debounce
    const sendUpdate = useCallback(
        debounce((updatedPropiedad) => {
            onUpdate(updatedPropiedad);
        }, 300), // 300ms de retraso
        [onUpdate]
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        let nuevaPropiedad = { ...propiedad, [name]: value };
        let error = '';

        // Validar cada campo según su tipo
        if (name === 'rolSII') {
            error = validarRolSII(value);
        } else if (['direccion', 'comuna', 'region', 'destino'].includes(name)) {
            error = validarTexto(value);
        } else if (['numero', 'InscNumero', 'InscYear', 'numPisos', 'm2'].includes(name)) {
            error = validarNumeroPositivo(Number(value));
        }

        // Actualizar errores y propiedad
        setErrores((prevErrores) => ({ ...prevErrores, [name]: error }));
        setPropiedad(nuevaPropiedad);

        // Calcular si todos los campos obligatorios son válidos
        const datosValidos = Object.values({ ...errores, [name]: error }).every((err) => err === '') &&
            nuevaPropiedad.rolSII &&
            nuevaPropiedad.direccion &&
            nuevaPropiedad.comuna &&
            nuevaPropiedad.region &&
            nuevaPropiedad.destino;

        // Enviar datos actualizados al componente padre
        sendUpdate({ ...nuevaPropiedad, datosValidos: !!datosValidos });
    };

    return (
        <div>
            <form>
                <div>
                    <label>Rol SII:</label>
                    <input name="rolSII" value={propiedad.rolSII} onChange={handleChange} />
                    {errores.rolSII && <p style={{ color: 'red', fontSize: '12px' }}>{errores.rolSII}</p>}
                </div>

                <div>
                    <label>Dirección:</label>
                    <input name="direccion" value={propiedad.direccion} onChange={handleChange} />
                    {errores.direccion && <p style={{ color: 'red', fontSize: '12px' }}>{errores.direccion}</p>}
                </div>

                <div>
                    <label>Número:</label>
                    <input name="numero" type="number" value={propiedad.numero} onChange={handleChange} />
                    {errores.numero && <p style={{ color: 'red', fontSize: '12px' }}>{errores.numero}</p>}
                </div>

                <div>
                    <label>Comuna:</label>
                    <input name="comuna" value={propiedad.comuna} onChange={handleChange} />
                    {errores.comuna && <p style={{ color: 'red', fontSize: '12px' }}>{errores.comuna}</p>}
                </div>

                <div>
                    <label>Región:</label>
                    <input name="region" value={propiedad.region} onChange={handleChange} />
                    {errores.region && <p style={{ color: 'red', fontSize: '12px' }}>{errores.region}</p>}
                </div>

                <div>
                    <label>Inscripción en Fojas:</label>
                    <input name="inscFojas" value={propiedad.inscFojas} onChange={handleChange} />
                </div>

                <div>
                    <label>Inscripción Número:</label>
                    <input name="InscNumero" type="number" value={propiedad.InscNumero} onChange={handleChange} />
                    {errores.InscNumero && <p style={{ color: 'red', fontSize: '12px' }}>{errores.InscNumero}</p>}
                </div>

                <div>
                    <label>Año de Inscripción:</label>
                    <input name="InscYear" type="number" value={propiedad.InscYear} onChange={handleChange} />
                    {errores.InscYear && <p style={{ color: 'red', fontSize: '12px' }}>{errores.InscYear}</p>}
                </div>

                <div>
                    <label>Número de Pisos:</label>
                    <input name="numPisos" type="number" value={propiedad.numPisos} onChange={handleChange} />
                    {errores.numPisos && <p style={{ color: 'red', fontSize: '12px' }}>{errores.numPisos}</p>}
                </div>

                <div>
                    <label>Metros Cuadrados (m²):</label>
                    <input name="m2" type="number" step="0.01" value={propiedad.m2} onChange={handleChange} />
                    {errores.m2 && <p style={{ color: 'red', fontSize: '12px' }}>{errores.m2}</p>}
                </div>

                <div>
                    <label>Destino:</label>
                    <input name="destino" value={propiedad.destino} onChange={handleChange} />
                    {errores.destino && <p style={{ color: 'red', fontSize: '12px' }}>{errores.destino}</p>}
                </div>
            </form>
        </div>
    );
};

export default DatosPropiedad;