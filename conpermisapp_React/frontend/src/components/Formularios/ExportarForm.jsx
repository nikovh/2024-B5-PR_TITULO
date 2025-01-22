import React, { useEffect, useState } from 'react';

const ExportarForm = ({ expedienteId }) => {
  const [datos, setDatos] = useState({
    propiedad: null,
    propietario: null,
    usuario: null,
    expediente: null,
    tipoExpediente: null,
    subtipoExpediente: null,
  });

  const [textoGenerado, setTextoGenerado] = useState('');

  const [error, setError] = useState(null); // Estado para manejar errores

  // Recuperar datos de las tablas
  useEffect(() => {
    const fetchDatos = async () => {
      try {

        setError(null);

        // Recuperar datos del expediente
        const expedienteResponse = await fetch(`http://localhost:4000/expedientes/${expedienteId}`);
        if (!expedienteResponse.ok) throw new Error('Error al recuperar el expediente');
        const expediente = await expedienteResponse.json();

        // Recuperar datos relacionados
        const propiedadResponse = await fetch(`http://localhost:4000/propiedades/expedientes/${expedienteId}`);
        if (!propiedadResponse.ok) throw new Error('Error al recuperar la propiedad');
        const propiedad = await propiedadResponse.json();

        const propietarioResponse = await fetch(`http://localhost:4000/propietarios/${expediente.propietarioId}`);
        if (!propietarioResponse.ok) throw new Error('Error al recuperar el propietario');
        const propietario = await propietarioResponse.json();

        const usuarioResponse = await fetch(`http://localhost:4000/usuarios/${expediente.usuarioId}`);
        if (!usuarioResponse.ok) throw new Error('Error al recuperar el usuario');
        const usuario = await usuarioResponse.json();

        const tipoExpedienteResponse = await fetch(`http://localhost:4000/tipos-expedientes/${expediente.tipoId}`);
        if (!tipoExpedienteResponse.ok) throw new Error('Error al recuperar el tipo de expediente');
        const tipoExpediente = await tipoExpedienteResponse.json();

        const subtipoExpedienteResponse = await fetch(`http://localhost:4000/subtipos-expedientes/${expediente.subtipoId}`);
        if (!subtipoExpedienteResponse.ok) throw new Error('Error al recuperar el subtipo de expediente');
        const subtipoExpediente = await subtipoExpedienteResponse.json();

        // Asignar datos
        setDatos({
          expediente,
          propiedad: propiedad[0], // Usa el primer elemento si es un array
          propietario,
          usuario,
          tipoExpediente,
          subtipoExpediente,
        });
      } catch (err) {
        setError(err.message);
        console.error('Error al recuperar datos:', err);
      } 
    };

    fetchDatos();
  }, [expedienteId]);

  // Generar texto dinámico
  useEffect(() => {
    if (datos.propiedad && datos.tipoExpediente && datos.subtipoExpediente) {
      const texto = `
        La parte de la edificación para la cual se solicita dicha autorización provisoria corresponde
        a la superficie que se encuentra en área de antejardín, producto del ensanche realizado en
        av. ${datos.propiedad.direccion || 'Vicuña Mackenna'} y que afecta el proceso de autorización del presente expediente de ${datos.tipoExpediente.nombre} - ${datos.subtipoExpediente.nombre}, en una superficie total de ${datos.propiedad.m2 || '516,35 m2'}.
      `;
      setTextoGenerado(texto);
    }
  }, [datos]);

  // Retornar el texto generado
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '5px', marginTop: '20px' }}>
      <h3>Texto Generado</h3>
      {error ? (
        <p style={{ color: 'red' }}>Error: {error}</p>
      ) : (
        <p>{textoGenerado}</p>
      )}
    </div>
  );
};

export default ExportarForm;
