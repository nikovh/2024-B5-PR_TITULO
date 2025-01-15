import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ExpedienteModal from "./ExpedienteModal";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import '../styles/Dashboard.css'
import ExpedienteCard from "./ExpedienteCard"


function Dashboard() {
    const [user] = useAuthState(auth);
    const [nombreUsuario, setNombreUsuario] = useState("Cargando...");
    const [rutUsuario, setRutUsuario] = useState(null);
    const [expedientes, setExpedientes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        if(user) {
            //obtener el rut desde el email
            const email = user.email;
            fetch(`http://localhost:4000/usuarios/email/${email}`)
                .then((response) => response.json())
                .then((data) => {
                    if(data.rut) {
                        setNombreUsuario(data.nombre);
                        setRutUsuario(data.rut);

                        //obtener los expeddinete segun rut
                        fetch(`http://localhost:4000/expedientes?usuario_rut=${data.rut}`)
                            .then((res) => res.json())
                            .then((data) => setExpedientes(data))
                            .catch((err) => console.error("Error al cargar expedientes:", err));
                    } else {
                        console.error("No se encontró el usuario en la base de datos.");
                        setNombreUsuario("Usuario no encontrado");
                    }
                })
                .catch((err) => console.error("Error al obtener el usuario:", err));
        } else {
            console.error("Usuario no autenticado.");
            navigate("/");
        }
    }, [user, navigate]);


    // Modal
    const abrirModal = () => setIsModalOpen(true);
    const cerrarModal = () => setIsModalOpen(false);

    
    const crearExpediente = async (tipo, subtipo) => {
        if (!rutUsuario) {
            alert("Error: No se pudo identificar al usuario.");
            return;
        }

        try {
            const resp = await fetch("http://localhost:4000/expedientes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    descripcion: `Nuevo expediente de ${tipo}`,
                    tipo,
                    subtipo,
                    // Propietario_rut: propietarioRut,
                    Usuario_rut: rutUsuario,
                    EstadoExpediente_id: 1, 
                }),
            });
            if (resp.ok) {
                const newExpedientes = await fetch(`http://localhost:4000/expedientes?usuario_rut=${rutUsuario}`)
                    .then((r) => r.json());
                setExpedientes(newExpedientes);
            } else {
                alert("Error al crear el expediente");
            }
        } catch (err) {
            console.error("Error", err);
            alert("Error al crear un nuevo expediente");
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/");
        } catch (err) {
            console.error("Error al cerrar sesión:", err);
        }
    };

    return (
        <div style={{ padding: '1rem' }}>
            <h1>Bienvenido {nombreUsuario}</h1>
            <button onClick={handleLogout} className="logoutButton">
                Cerrar Sesión
            </button>

            <h2>Mis Expedientes</h2>
            {expedientes.length === 0 ? (
                <p>No tienes expedientes registrados</p>
            ) : (
                <div className="expedientes-container">
                    <ExpedienteCard onCreate={abrirModal} />
                    {expedientes.map((expediente) => (
                        <ExpedienteCard key={expediente.id} expediente={expediente} />
                    ))}
                </div>
            )}

            <ExpedienteModal
                isOpen={isModalOpen}
                onClose={cerrarModal}
                onCreate={crearExpediente}
            />

        </div>
    );
}

export default Dashboard;