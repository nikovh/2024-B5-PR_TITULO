import React, { useState } from 'react';

const DatosPropietario = ({ onUpdate }) => {
  const [propietario, setPropietario] = useState({
    rut: '',
    nombres: '',
    apellidos: '',
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
          <label>Nombres:</label>
          <input
            name="nombres"
            value={propietario.nombres}
            onChange={handleChange}
            maxLength={25} 
          />
        </div>
        <div>
          <label>Apellidos:</label>
          <input
            name="apellidos"
            value={propietario.apellidos}
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
