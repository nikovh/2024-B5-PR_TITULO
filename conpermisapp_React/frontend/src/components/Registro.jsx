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
    const [patenteProfesional, setPatenteProfesional] = useState("");
    const [error, setError] = useState('');
    const navigate = useNavigate();

    //Validaciones mínimas
    const validateRut = (value) => {
        if (/^[0-9]+-[0-9kK]{1}$/.test(value)) {
            return ""; // El RUT es válido
        }
        return "El RUT debe ser válido (formato: 12345678-9)."; // Mensaje de error
    };
    const validateNombres = (value) => { 
        if (value.trim() !== "") {
            return ""; // El nombre es válido
        }
        return "El nombre es obligatorio."; // Mensaje de error
    };
    
    const validateTelefono = (value) => {
        if (/^[0-9]{8,15}$/.test(value)) {
            return ""; // El teléfono es válido
        }
        return "Ingrese un teléfono válido (8-15 dígitos)."; // Mensaje de error
    };
    


    const handleValidation = (field, value) => {
        switch (field) {
            case "rut":
                return validateRut(value);
            case "nombres":
                return validateNombres(value);
            case "telefono":
                return validateTelefono(value);
            default:
                return "";
        }
    };

    const handleRegistrar = async (e) => {
        e.preventDefault();
        setError('');
    
        // Validar campos manualmente
        const validations = [
            ["rut", rut],
            ["nombres", nombres],
            ["telefono", telefono],
        ];
    
        for (const [field, value] of validations) {
            const validationResult = handleValidation(field, value);
            if (validationResult) {
                setError(validationResult);
                console.error(`Error en el campo ${field}: ${validationResult}`);
                return;
            }
        }
    
        try {
            console.log("Registrando usuario con email:", email, "y password:", password);
            
            // Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const userId = userCredential.user.uid;
    
            console.log("Usuario registrado en Firebase con UID:", userId);
    
            // Llamada al Backend
            const response = await fetch("http://localhost:4000/usuarios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    uid: userId,
                    rut,
                    nombres,
                    apellidos: apellidos || null,
                    telefono,
                    email,
                    password,
                    patenteProfesional: patenteProfesional || null,
                    rol: "usuario",
                }),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error en el backend:", errorData);
                throw new Error(errorData.error || "Error al registrar usuario en el backend.");
            }

            console.log("Usuario registrado en el backend correctamente.");
            alert("Usuario creado exitosamente")
            navigate("/");

            

        } catch (err) {
            console.error("Error general:", err);
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
                        // placeholder="ingresa sin puntos ni guión"
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