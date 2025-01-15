import React, { useState } from 'react';

const DatosPropietario = ({ onUpdate }) => {
  const [propietario, setPropietario] = useState({
    rut: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    email: '',
    telefono: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPropietario({ ...propietario, [name]: value });
    onUpdate({ ...propietario, [name]: value });
  };

  return (
    <div>
      <h3>Datos del Propietario</h3>
      <form>
        <div>
          <label>RUT:</label>
          <input
            name="rut"
            placeholder="Ingrese el RUT sin puntos ni guión"
            value={propietario.rut}
            onChange={handleChange}
            maxLength={9} 
          />
        </div>
        <div>
          <label>Nombre:</label>
          <input
            name="nombre"
            value={propietario.nombre}
            onChange={handleChange}
            maxLength={25} 
          />
        </div>
        <div>
          <label>Apellido Paterno:</label>
          <input
            name="apellidoPaterno"
            value={propietario.apellidoPaterno}
            onChange={handleChange}
            maxLength={25} 
          />
        </div>
        <div>
          <label>Apellido Materno:</label>
          <input
            name="apellidoMaterno"
            value={propietario.apellidoMaterno}
            onChange={handleChange}
            maxLength={25} 
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            name="email"
            type="email"
            value={propietario.email}
            onChange={handleChange}
            maxLength={25} 
          />
        </div>
        <div>
          <label>Teléfono:</label>
          <input
            name="telefono"
            type="number"
            value={propietario.telefono}
            onChange={handleChange}
          />
        </div>
      </form>
    </div>
  );
};

export default DatosPropietario;
