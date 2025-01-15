import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function ExpedienteDetail() {
  const { id } = useParams(); // Extrae el parámetro `id` de la URL.
  // const [formularios, setFormularios] = useState([]);
  const [expediente, setExpediente] = useState(null); 

  useEffect(() => {
    // Al montar se obtienen los formularios del expediente
    // fetch(`http://localhost:4000/formularios?expediente_id=${id}`)

    // Carga los detalles del expediente usando el ID de la URL.
    fetch(`http://localhost:4000/expedientes/${id}`)
      .then(res => res.json())
      .then(data => setExpediente(data))
      .catch(err => console.error("Error al cargar el expediente:", err));
  }, [id]);

  // const completarFormulario = (formId) => {
  //   // Podrías navegar a otra ruta (e.g. "/formulario/:formId")
  //   // o abrir un modal con el formulario. Ejemplo sencillo:
  //   alert(`Aquí abrirías el formulario con ID: ${formId}`);
  // };

  if (!expediente) {
    return <p>Cargando detalles del expediente...</p>;
  }

  

  return (
    // <div style={{ padding: '1rem' }}>
    //   <h2>Detalle del Expediente {id}</h2>
    //   <p>Aquí puedes ver y completar formularios.</p>
    //   {formularios.length === 0 ? (
    //     <p>No hay formularios asociados.</p>
    //   ) : (
    //     <ul>
    //       {formularios.map((f) => (
    //         <li key={f.formulario_id}>
    //           {f.tipo_formulario} - {f.status} - 
    //           <button onClick={() => completarFormulario(f.formulario_id)}>
    //             Completar
    //           </button>
    //         </li>
    //       ))}
    //     </ul>
    //   )}
    // </div>

    <div>
      <h1>Detalles del Expediente</h1>
      <p>ID: {expediente.id}</p>
      <p>Descripción: {expediente.descripcion}</p>
      <p>Tipo: {expediente.tipo}</p>
    </div>

    
  );
}

export default ExpedienteDetail;
