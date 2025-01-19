import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import '../styles/Login.css';


function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    
    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("Usuario Autenticado", auth.currentUser);
            navigate('/dashboard');
        } catch (err) {
            setError("Correo electrónico o contraseña incorrectos.");
            console.error(err.message)
        }
    };

    return (
        <div className="login-background">
            <div className="background-text">conPermisApp</div>
            <div className="login-box">
                <h2>Inicia sesión a tu cuenta</h2>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="email">Correo electrónico</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="Contraseña">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="error">{error}</p>}
                    <button type="submit" className="login-button"> Iniciar sesión</button>
                </form>
                <p>¿No tienes cuenta? No hay problema, <a href="/registro">Regístrate aquí</a>.</p>
            </div>
        </div>
    );
}

export default Login;