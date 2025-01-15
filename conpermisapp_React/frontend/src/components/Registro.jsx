import React, { useState} from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import '../styles/Registro.css'

function Registro() {
    const [rut, setRut] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellidoPaterno, setApellidoPaterno] = useState('');
    const [apellidoMaterno, setApellidoMaterno] = useState('');
    const [telefono, setTelefono] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [profesion, setProfesion] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegistrar = async (e) => {
        e.preventDefault();
        setError('');

        if (!email) {
            setError("El correo electrónico es obligatorio.");
            return;
        }
        if (!password) {
            setError("La contraseña es obligatoria.");
            return;
        }
        if (!rut || !nombre || !telefono || !profesion) {
            setError("Completa los campos obligatorios.");
            return;
        }
        
        try {
            //registrar usuario en firebase
            console.log("Registrando usuario con email:", email, "y password:", password);
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            //guardar datos en bd
            const userId = userCredential.user.uid;

            console.log("Datos enviados al backend:", {
                userId,
                rut,
                nombre,
                apellidoPaterno,
                apellidoMaterno,
                telefono,
                email,
                profesion,
            });

            const response = await fetch("http://localhost:4000/usuarios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    uid: userId,
                    rut,
                    nombre,
                    apellidoPaterno,
                    apellidoMaterno,
                    telefono,
                    email,
                    password,
                    profesion,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Error al registrar usuario.");
            }

            navigate("/");
        } catch (err) {
            console.error("Error al registrar el usuario:", err);
            setError(err.message || "Ocurrió un error al registrar el usuario.");
        }
    };

    return (
        <div className="register-container">
            <h2>Regístrate</h2>
            <form onSubmit={handleRegistrar}>
                <div className="form-group">
                    <label htmlFor="rut">RUT</label>
                    <input
                        type="text"
                        id="rut"
                        value={rut}
                        onChange={(e) => setRut(e.target.value)}
                        placeholder="ingresa sin puntos ni guión"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="nombre">Nombre</label>
                    <input
                        type="text"
                        id="nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="apellidoPaterno">Apellido Paterno</label>
                    <input
                        type="text"
                        id="apellidoPaterno"
                        value={apellidoPaterno}
                        onChange={(e) => setApellidoPaterno(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="apellidoMaterno">Apellido Materno</label>
                    <input
                        type="text"
                        id="apellidoMaterno"
                        value={apellidoMaterno}
                        onChange={(e) => setApellidoMaterno(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="telefono">Telefono</label>
                    <input
                        type="text"
                        id="telefono"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Correo Electrónico</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="profesion">Profesión</label>
                    <input
                        type="text"
                        id="profesion"
                        value={profesion}
                        onChange={(e) => setProfesion(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="error">{error}</p>}
                <button type="submit">Registrarse</button>
            </form>
            <p>
                ¿Ya tienes cuenta? Entonces <a href="/">Inicia sesión</a>.
            </p>
        </div>
    );
}

export default Registro;