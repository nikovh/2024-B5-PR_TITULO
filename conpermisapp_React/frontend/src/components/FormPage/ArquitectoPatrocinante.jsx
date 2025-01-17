import React, { useState } from 'react';

const ArquitectoPatrocinante = ({ onUpdate }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        rut: '',
        telefono: '',
        email: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newData = { ...formData, [name]: value };
        setFormData(newData);
        onUpdate(newData);
    };

    return (
        <form>
            <div>
                <label>Nombre:</label>
                <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>RUT:</label>
                <input
                    type="text"
                    name="rut"
                    value={formData.rut}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Teléfono:</label>
                <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Email:</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                />
            </div>
        </form>
    );
};

export default ArquitectoPatrocinante; 