import React, { useState, useEffect } from 'react';

const DatosPropiedad = ({ propiedad, onSave, onCancel }) => {
    // estado apra los datos del form
    const [formData, setFormData] = useState({
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
    
    // Estado para los errores del formulario
    const [errores, setErrores] = useState({});

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

    // Actualizar el formulario cuando se pasa una propiedad desde el padre
    useEffect(() => {
        if(propiedad) setFormData(propiedad);
    }, [propiedad]);

    // Manejar cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Actualizar el estado del formulario
        setFormData((prev) => ({ ...prev, [name]: value}));


        // Validar cada campo según su tipo
        let error = '';
        if (name === 'rolSII') {
            error = validarRolSII(value);
        } else if (['direccion', 'comuna', 'region', 'destino'].includes(name)) {
            error = validarTexto(value);
        } else if (['numero', 'InscNumero', 'InscYear', 'numPisos', 'm2'].includes(name)) {
            error = validarNumeroPositivo(Number(value));
        }

        // Actualizar errores 
        setErrores((prevErrores) => ({ ...prevErrores, [name]: error }));
    };
    
    // Manejar el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validar todos los campos antes de enviar
        const nuevosErrores = {};
        nuevosErrores.rolSII = validarRolSII(formData.rolSII);
        nuevosErrores.direccion = validarTexto(formData.direccion);
        nuevosErrores.comuna = validarTexto(formData.comuna);
        nuevosErrores.region = validarTexto(formData.region);
        nuevosErrores.destino = validarTexto(formData.destino);
        nuevosErrores.numero = validarNumeroPositivo(Number(formData.numero));
        nuevosErrores.InscNumero = validarNumeroPositivo(Number(formData.InscNumero));
        nuevosErrores.InscYear = validarNumeroPositivo(Number(formData.InscYear));
        nuevosErrores.numPisos = validarNumeroPositivo(Number(formData.numPisos));
        nuevosErrores.m2 = validarNumeroPositivo(Number(formData.m2));

        setErrores(nuevosErrores);

        // Si hay errores, no proceder
        const hayErrores = Object.values(nuevosErrores).some((error) => error !== "");
        if (hayErrores) {
            alert("Por favor corrige los errores antes de guardar.");
            return;
        }

        // Enviar los datos al componente padre
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            {[
                { label: "Rol SII", name: "rolSII" },
                { label: "Dirección", name: "direccion" },
                { label: "Número", name: "numero", type: "number" },
                { label: "Comuna", name: "comuna" },
                { label: "Región", name: "region" },
                { label: "Inscripción en Fojas", name: "inscFojas" },
                { label: "Inscripción Número", name: "InscNumero", type: "number" },
                { label: "Año de Inscripción", name: "InscYear", type: "number" },
                { label: "Número de Pisos", name: "numPisos", type: "number" },
                { label: "Metros Cuadrados (m²)", name: "m2", type: "number", step: "0.01" },
                { label: "Destino", name: "destino" },
            ].map(({ label, name, type = "text", step }) => (
                <div key={name} style={{ marginBottom: "10px" }}>
                    <label>{label}:</label>
                    <input
                        name={name}
                        type={type}
                        step={step}
                        value={formData[name] || ""}
                        onChange={handleChange}
                        required
                    />
                    {errores[name] && <p style={{ color: "red", fontSize: "12px" }}>{errores[name]}</p>}
                </div>
            ))}
            <button type="submit">Guardar</button>
            <button type="button" onClick={onCancel} style={{ marginLeft: "10px" }}>
                Cancelar
            </button>
        </form>
    );
};

export default DatosPropiedad;
