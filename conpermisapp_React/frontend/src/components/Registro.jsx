import React, { useState} from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import '../styles/Registro.css'

function Registro() {
    const [rut, setRut] = useState("");
    const [nombres, setNombres] = useState("");
    const [apellidos, setApellidos] = useState("");
    const [telefono, setTelefono] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [profesion, setProfesion] = useState("");
    const [patenteProfesional, setPatenteProfesional] = useState("");
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
        if (!rut || !nombres || !apellidos || !telefono || !email || !password || !profesion) {
            setError("Completa los campos obligatorios.");
            return;
        }
        
        try {
            //registrar usuario en firebase
            console.log("Registrando usuario con email:", email, "y password:", password);
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            //guardar datos en bd
            const userId = userCredential.user.uid;

            const response = await fetch("http://localhost:4000/usuarios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    uid: userId,
                    rut,
                    nombres,
                    apellidos,
                    telefono,
                    email,
                    password,
                    profesion,
                    patenteProfesional: patenteProfesional || null,
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
                    <label htmlFor="nombres">Nombres</label>
                    <input
                        type="text"
                        id="nombres"
                        value={nombres}
                        onChange={(e) => setNombres(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="apellidos">Apellidos</label>
                    <input
                        type="text"
                        id="apellidos"
                        value={apellidos}
                        onChange={(e) => setApellidos(e.target.value)}
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

                <div className="form-group">
                    <label htmlFor="patenteProfesional">Patente Profesional</label>
                    <input
                        type="text"
                        id="patenteProfesional"
                        value={patenteProfesional}
                        onChange={(e) => setPatenteProfesional(e.target.value)}
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