// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { auth } from "../firebase";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import '../styles/Login.css';


// function Login() {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');
//     const navigate = useNavigate();

//     const handleLogin = async (e) => {
//         e.preventDefault();

//         try {
//             await signInWithEmailAndPassword(auth, email, password);
//             console.log("Usuario Autenticado", auth.currentUser);
//             navigate('/dashboard');
//         } catch (err) {
//             setError("Correo electrónico o contraseña incorrectos.");
//             console.error(err.message)
//         }
//     };

//     return (
//         <div className="login-background">
//             <div className="background-text">conPermisApp</div>
//             <div className="login-box">
//                 <h2>Inicia sesión a tu cuenta</h2>
//                 <form onSubmit={handleLogin}>
//                     <div className="form-group">
//                         <label htmlFor="email">Correo electrónico</label>
//                         <input
//                             type="email"
//                             id="email"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             required
//                         />
//                     </div>
//                     <div className="form-group">
//                         <label htmlFor="Contraseña">Contraseña</label>
//                         <input
//                             type="password"
//                             id="password"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             required
//                         />
//                     </div>
//                     {error && <p className="error">{error}</p>}
//                     <button type="submit" className="login-button"> Iniciar sesión</button>
//                 </form>
//                 <p>¿No tienes cuenta? No hay problema, <a href="/registro">Regístrate aquí</a>.</p>
//             </div>
//         </div>
//     );
// }

// export default Login;


//op
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
        console.log("Datos enviados:", { email, password });
        try {
            // Autenticación con Firebase
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Obtener el token de Firebase
            const token = await user.getIdToken();

            // Enviar el token al backend para verificar el rol
            const response = await fetch("http://localhost:4000/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error("Error en el servidor o credenciales incorrectas.");
            }

            const data = await response.json();
            console.log("Respuesta del backend:", data);

            // Guardar datos en el localStorage
            localStorage.setItem("token", data.token);
            localStorage.setItem("rol", data.rol);
            localStorage.setItem("email", email);

            // Redirigir según el rol
            if (data.rol === "admin") {
                navigate("/administracion");
            } else {
                navigate("/dashboard");
            }
        } catch (err) {
            setError("Correo electrónico o contraseña incorrectos.");
            console.error("Error en el inicio de sesión:", err.message);
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
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="error">{error}</p>}
                    <button type="submit" className="login-button">Iniciar sesión</button>
                </form>
                <p>¿No tienes cuenta? No hay problema, <a href="/registro">Regístrate aquí</a>.</p>
            </div>
        </div>
    );
}

export default Login;
