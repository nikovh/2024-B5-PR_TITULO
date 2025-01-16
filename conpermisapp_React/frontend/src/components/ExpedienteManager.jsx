import React, { useEffect, useState } from "react";

function ExpedienteManager() {
    const [expedientes, setExpedientes] = useState([]);
    const [expedienteSeleccionado, setExpedienteSeleccionado] = useState(null); // Para edición
    const [formData, setFormData] = useState({
        descripcion: "",
        tipo: "",
        subtipo: "",
        estadoExpedienteId: "",
    });

    // Obtener expedientes del backend
    useEffect(() => {
        fetchExpedientes();
    }, []);

    const fetchExpedientes = async () => {
        try {
            const response = await fetch("http://localhost:4000/expedientes");
            const data = await response.json();
            setExpedientes(data);
        } catch (error) {
            console.error("Error al cargar expedientes:", error);
        }
    };

    // Seleccionar expediente para edición
    const handleEdit = (expediente) => {
        setExpedienteSeleccionado(expediente);
        setFormData({
            descripcion: expediente.descripcion,
            tipo: expediente.tipo,
            subtipo: expediente.subtipo,
            estadoExpedienteId: expediente.EstadoExpediente_id,
        });
    };

    // Guardar cambios al expediente
    const handleSave = async () => {
        if (!expedienteSeleccionado) return;

        try {
            const response = await fetch(`http://localhost:4000/expedientes/${expedienteSeleccionado.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("Expediente actualizado exitosamente");
                fetchExpedientes(); // Refrescar lista
                setExpedienteSeleccionado(null); // Salir del modo edición
            } else {
                alert("Error al actualizar expediente");
            }
        } catch (error) {
            console.error("Error al guardar cambios:", error);
        }
    };

    // Eliminar un expediente
    const handleDelete = async (id) => {
        if (!window.confirm("¿Estás seguro de eliminar este expediente?")) return;

        try {
            const response = await fetch(`http://localhost:4000/expedientes/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                alert("Expediente eliminado");
                fetchExpedientes(); // Refrescar lista
            } else {
                alert("Error al eliminar expediente");
            }
        } catch (error) {
            console.error("Error al eliminar expediente:", error);
        }
    };

    // Manejar cambios en los campos del formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div style={{ padding: "1rem" }}>
            <h1>Gestión de Expedientes</h1>

            {expedienteSeleccionado ? (
                <div>
                    <h2>Editar Expediente</h2>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div>
                            <label>Descripción:</label>
                            <input
                                type="text"
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label>Tipo:</label>
                            <input
                                type="text"
                                name="tipo"
                                value={formData.tipo}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label>Subtipo:</label>
                            <input
                                type="text"
                                name="subtipo"
                                value={formData.subtipo}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label>Estado:</label>
                            <input
                                type="number"
                                name="estadoExpedienteId"
                                value={formData.estadoExpedienteId}
                                onChange={handleInputChange}
                            />
                        </div>
                        <button onClick={handleSave}>Guardar</button>
                        <button onClick={() => setExpedienteSeleccionado(null)}>Cancelar</button>
                    </form>
                </div>
            ) : (
                <div>
                    <h2>Lista de Expedientes</h2>
                    {expedientes.length === 0 ? (
                        <p>No hay expedientes disponibles.</p>
                    ) : (
                        <ul>
                            {expedientes.map((expediente) => (
                                <li key={expediente.id}>
                                    <strong>{expediente.descripcion}</strong> (Tipo: {expediente.tipo}, Subtipo: {expediente.subtipo})
                                    <button onClick={() => handleEdit(expediente)}>Editar</button>
                                    <button onClick={() => handleDelete(expediente.id)}>Eliminar</button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}

export default ExpedienteManager;
