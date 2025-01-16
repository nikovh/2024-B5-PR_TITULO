import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import ExpedienteModal from "./ExpedienteModal";
import ExpedienteCard from "./ExpedienteCard"
import '../styles/Dashboard.css'


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

                        //obtener los expeddinete por usuario segun rut
                        fetch(`http://localhost:4000/expedientes?usuario_rut=${data.rut}`)
                            .then((res) => res.json())
                            .then((data) => {
                                //orden descendente
                                const ordenDesc = data.sort((a, b) => 
                                    new Date(b.fechaCreacion) - new Date(a.fechaCreacion)
                            );
                            setExpedientes(ordenDesc);
                        })
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

    const crearExpediente = async (tipo, subtipo, propietario) => {
        if (!rutUsuario) {
            alert("Error: No se pudo identificar al usuario.");
            return;
        }

        try {
            //verificar si el propietario existe
            const propietarioExiste = await fetch(`http://localhost:4000/propietarios/${propietario.rut}`)
                .then((res) => {
                    if (!res.ok) {
                        throw new Error("Error al verificar el propietario");
                    }
                    return res.json();
                })
                .catch((err) => {
                    console.error("Error al verificar el propietario:", err);
                    return null; // Propietario no encontrado
                });

            // crear al propietario si no existe
            if (!propietarioExiste) {
                const crearPropietarioResp = await fetch(`http://localhost:4000/propietarios`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        rut: propietario.rut,
                        nombres: propietario.nombres,
                        apellidos: propietario.apellidos || null,
                        email: propietario.email || null,
                        telefono: propietario.telefono || null,
                    }),
                });

                if (!crearPropietarioResp.ok) {
                    throw new Error("Error al crear el propietario");
                }
            }

            // crear expediente
            const resp = await fetch("http://localhost:4000/expedientes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    descripcion: `Nuevo expediente de ${tipo}`,
                    tipo,
                    subtipo,
                    propietario: {
                        rut: propietario.rut,
                    },
                    //propietario: propietario.rut //revisar ambas alternativas
                    usuarioRut: rutUsuario,
                    EstadoExpediente_id: 1, 
                }),
            });
            if (resp.ok) {
                const newExpedientes = await fetch(`http://localhost:4000/expedientes?usuario_rut=${rutUsuario}`)
                    .then((res) => res.json());
                setExpedientes(newExpedientes);
            } else {
                alert("Error al crear el expediente");
            }
        } catch (err) {
            console.error("Error", err);
            alert("Error al crear un nuevo expediente");
        }
    };

    // Modal
    // const abrirModal = () => setIsModalOpen(true);
    // const cerrarModal = () => setIsModalOpen(false);


    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/");
        } catch (err) {
            console.error("Error al cerrar sesión:", err);
        }
    };

    const abrirDetalleExpediente = (id) => {
        navigate(`/detalle/${id}`);
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
                    {/* <ExpedienteCard onCreate={abrirModal} /> */}
                    <ExpedienteCard onCreate={() => setIsModalOpen(true)} />
                    {expedientes.map((expediente) => (
                        <ExpedienteCard 
                            key={expediente.id} 
                            expediente={expediente}
                            onClick={() => abrirDetalleExpediente(expediente.id)} 
                        />
                    ))}
                </div>
            )}

            <ExpedienteModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreate={crearExpediente}
            />

        </div>
    );
}

export default Dashboard;