import React, { useEffect, useState } from "react";
import axios from "axios";

const Administracion = () => { 
    const [usuarios, setUsuarios] = useState([]);
    const [expedientes, setExpedientes] = useState([]);
    const [error, setError] = useState(null);

    //fetch usuarios
    const fetchUsuarios = async () => {
        try {
            const response = await axios.get("http://localhost:4000/usuarios");
            setUsuarios(response.data);
        } catch (err) {
            console.error("Error al obtener usuarios:", err);
            setError("Error al cargar los usuarios.");
        }
    };

    //fetch expedientes
    const fetchExpedientes = async () => {
        try {
            const response  = await axios.get("http://localhost:4000/expedientes");
            setExpedientes(response.data);
        } catch (err) {
            console.error("Error al obtener expedientes:", err);
            setError("Error al cargar los expedientes");
        }
    };

    //eliminar usuario
    const eliminarUsuario = async (rut) => {
        try {
            await axios.delete(`http://localhost:4000/usuarios/${rut}`);
            alert("Usuario eliminado exitosamente.");
            fetchUsuarios();
        } catch (err) {
            console.error("Error al eliminar usuario:", err);
            setError("Erorr al eliminar el usuario");
        }
    };

    // elimianr expediente
    const eliminarExpediente = async () => {
        try {
            await axios.delete(`http://localhost:4000/expedientes/${id}`);
            alert("Expediente eliminado exitosamente.");
            fetchExpedientes();
        } catch (err) {
            console.error("Error al eliminar expediente:", err);
            setError("Error al eliminar el expediente");
        }
    };

    //hooks para cargar los datos
    useEffect(() => {
        fetchUsuarios();
        fetchExpedientes();
    }, []);
    
    if (error) {
        return <p style={{ color: "red" }}>{error}</p>;
    }

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h1>Administración</h1>

            <h2>Usuarios</h2>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th>RUT</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map((usuario) => (
                        <tr key={usuario.rut}>
                            <td>{usuario.rut}</td>
                            <td>{`${usuario.nombres} ${usuario.apellidos}`}</td>
                            <td>{usuario.email}</td>
                            <td>{usuario.rol}</td>
                            <td>
                                <button onClick={() => alert("Editar usuario no implementado")}>Editar</button>
                                <button onClick={() => eliminarUsuario(usuario.rut)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2>Expedientes</h2>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Descripción</th>
                        <th>Usuario</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {expedientes.map((expediente) => (
                        <tr key={expediente.id}>
                            <td>{expediente.id}</td>
                            <td>{expediente.descripcion}</td>
                            <td>{expediente.Usuario_email}</td>
                            <td>{expediente.estadoNombre || "Desconocido"}</td>
                            <td>
                                <button onClick={() => alert("Editar expediente no implementado")}>Editar</button>
                                <button onClick={() => eliminarExpediente(expediente.id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Administracion;