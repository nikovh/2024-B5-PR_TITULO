import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function ExpedienteDetail() {
  const { id } = useParams(); // expediente_id
  const [formularios, setFormularios] = useState([]);

  useEffect(() => {
    // Al montar se obtienen los formularios del expediente
    fetch(`http://localhost:4000/formularios?expediente_id=${id}`)
      .then(r => r.json())
      .then(data => setFormularios(data))
      .catch(err => console.error(err));
  }, [id]);

  const completarFormulario = (formId) => {
    // Podrías navegar a otra ruta (e.g. "/formulario/:formId")
    // o abrir un modal con el formulario. Ejemplo sencillo:
    alert(`Aquí abrirías el formulario con ID: ${formId}`);
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Detalle del Expediente {id}</h2>
      <p>Aquí puedes ver y completar formularios.</p>
      {formularios.length === 0 ? (
        <p>No hay formularios asociados.</p>
      ) : (
        <ul>
          {formularios.map((f) => (
            <li key={f.formulario_id}>
              {f.tipo_formulario} - {f.status} - 
              <button onClick={() => completarFormulario(f.formulario_id)}>
                Completar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ExpedienteDetail;
