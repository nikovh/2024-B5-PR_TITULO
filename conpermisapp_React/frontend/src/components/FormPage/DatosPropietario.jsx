import React, { useState } from 'react';

const DatosPropietario = ({ onUpdate }) => {
  const [propietario, setPropietario] = useState({
    rut: '',
    nombres: '',
    apellidos: '',
    email: '',
    telefono: '',
  });

<<<<<<< Updated upstream
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPropietario({ ...propietario, [name]: value });
    onUpdate({ ...propietario, [name]: value });
=======
  const [errores, setErrores] = useState({});
  const [isEditing, setIsEditing] = useState(false); // Modo de edición

  useEffect(() => {
    if (propietario) {
      setPropData(propietario);
    }
  }, [propietario]);

  // Validaciones 
  const validarCampos = (data) => {
    const nuevosErrores = {};

    if (!data.rut.match(/^[0-9]{7,8}-[0-9kK]{1}$/)) {
      nuevosErrores.rut = "El RUT debe ser válido (Ej: 12345678-9).";
    }
    if (!data.nombres.trim()) {
      nuevosErrores.nombres = "El nombre es obligatorio.";
    }
    if (!data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      nuevosErrores.email = "El correo electrónico debe ser válido.";
    }
    if (!String(data.telefono).match(/^[0-9]{8,15}$/)) {
      nuevosErrores.telefono = "El teléfono debe tener entre 8 y 15 dígitos.";
    }

    return nuevosErrores;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPropData((prev) => ({ ...prev, [name]: value }));

    // Validación en tiempo real
    const nuevosErrores = validarCampos({ ...propData, [name]: value });
    setErrores(nuevosErrores);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validar todos los campos
    const nuevosErrores = validarCampos(propData);
    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length === 0) {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Token no encontrado. Por favor, inicia sesión nuevamente.");
        return
      }

      try {
        await onSave(propData, token);
        setIsEditing(false);
      } catch (err) {
        console.error("Error al guardar el propietario:", err);
        alert("Error al guardar los datos. Inténtalo de nuevo.");
      }
    }
>>>>>>> Stashed changes
  };

  // return (
  //   <div>
  //     <form onSubmit={handleSubmit}>
  //       {[
  //         { label: "RUT", name: "rut" },
  //         { label: "Nombres", name: "nombres" },
  //         { label: "Apellidos", name: "apellidos" },
  //         { label: "Email", name: "email", type: "email" },
  //         { label: "Teléfono", name: "telefono", type: "number" },
  //       ].map(({ label, name, type = "text" }) => (
  //         <div key={name} style={{ marginBottom: "10px" }}>
  //           <label>{label}:</label>
  //           <input
  //             type={type}
  //             name={name}
  //             value={propietario[name] || ""}
  //             onChange={handleChange}
  //             disabled={!isEditing} // Desactiva los campos si no está en modo edición
  //           />
  //         </div>
  //       ))}
  //       <div>
  //         {!isEditing ? (
  //           <button type="button" onClick={() => setIsEditing(true)} style={{ marginRight: "10px" }}>
  //             Editar
  //           </button>
  //         ) : (
  //           <>
  //             <button type="submit" style={{ marginRight: "10px" }}>Guardar</button>
  //             <button type="button" onClick={() => setIsEditing(false)}>Cancelar</button>
  //           </>
  //         )}
  //       </div>
  //     </form>
  //   </div>
  // );

  return (
    <div>
<<<<<<< Updated upstream
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
=======
      <form onSubmit={handleSubmit}>
        {[{
          label: "RUT", name: "rut"
        }].map(({ label, name, type = "text" }) => (
          <div key={name}>
            <label>{label}:</label>
            <input
              type={type}
              name={name}
              value={propData[name] || ""}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
        ))}
        {isEditing ? (
          <div>
            <button type="submit">Guardar</button>
            <button type="button" onClick={() => setIsEditing(false)}>Cancelar</button>
          </div>
        ) : (
          <button type="button" onClick={() => setIsEditing(true)}>Editar</button>
        )}
>>>>>>> Stashed changes
      </form>
    </div>
  );
};

export default DatosPropietario;
