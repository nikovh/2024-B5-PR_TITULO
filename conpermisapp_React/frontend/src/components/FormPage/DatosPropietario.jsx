import React, { useState } from 'react';

const DatosPropietario = ({ onUpdate }) => {
  const [propietario, setPropietario] = useState({
    rut: '',
    nombres: '',
    apellidos: '',
    email: '',
    telefono: '',
  });

  const [errores, setErrores] = useState({
    rut: '',
    nombres: '',
    email: '',
    telefono: '',
  });

  // Validadores
  const validarRut = (rut) => {
    const regexRut = /^[0-9]{7,8}-[0-9kK]{1}$/; // Formato básico de RUT
    return regexRut.test(rut) ? '' : 'El RUT debe ser válido (Ej: 12345678-9).';
  };

  const validarNombres = (nombres) => {
    return nombres.trim().length > 0 ? '' : 'El nombre es obligatorio.';
  };

  const validarEmail = (email) => {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexEmail.test(email) ? '' : 'El correo electrónico debe ser válido.';
  };

  const validarTelefono = (telefono) => {
    const regexTelefono = /^[0-9]{8,15}$/; // Teléfonos con entre 8 y 15 dígitos
    return regexTelefono.test(telefono) ? '' : 'El teléfono debe tener entre 8 y 15 dígitos.';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Actualizar propietario
    const nuevoPropietario = { ...propietario, [name]: value };
    setPropietario(nuevoPropietario);

    // Validar campo específico
    let error = '';
    if (name === 'rut') error = validarRut(value);
    if (name === 'nombres') error = validarNombres(value);
    if (name === 'email') error = validarEmail(value);
    if (name === 'telefono') error = validarTelefono(value);

    setErrores({ ...errores, [name]: error });

    // Enviar datos actualizados y validados al padre
    // const datosValidos = Object.values(errores).every((err) => err === '') && error === '';
    // onUpdate({ ...nuevoPropietario, datosValidos });

    const datosValidos =
      Object.values({ ...errores, [name]: error }).every((err) => err === '') &&
      propietario.rut.trim() &&
      propietario.nombres.trim() &&
      propietario.email.trim() &&
      propietario.telefono.trim();
    onUpdate({ ...nuevoPropietario, datosValidos });
  };

  return (
    <div>
      <form>
        <div>
          <label>RUT:</label>
          <input
            name="rut"
            value={propietario.rut}
            onChange={handleChange}
            maxLength={10}
          />
          {errores.rut && <p style={{ color: 'red', fontSize: '12px' }}>{errores.rut}</p>}
        </div>
        <div>
          <label>Nombres:</label>
          <input
            name="nombres"
            value={propietario.nombres}
            onChange={handleChange}
            maxLength={50}
          />
          {errores.nombres && <p style={{ color: 'red', fontSize: '12px' }}>{errores.nombres}</p>}
        </div>
        <div>
          <label>Apellidos:</label>
          <input
            name="apellidos"
            value={propietario.apellidos}
            onChange={handleChange}
            maxLength={50}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            name="email"
            type="email"
            value={propietario.email}
            onChange={handleChange}
            maxLength={50}
          />
          {errores.email && <p style={{ color: 'red', fontSize: '12px' }}>{errores.email}</p>}
        </div>
        <div>
          <label>Teléfono:</label>
          <input
            name="telefono"
            type="number"
            value={propietario.telefono}
            onChange={handleChange}
          />
          {errores.telefono && <p style={{ color: 'red', fontSize: '12px' }}>{errores.telefono}</p>}
        </div>
      </form>
    </div>
  );
};

export default DatosPropietario;
