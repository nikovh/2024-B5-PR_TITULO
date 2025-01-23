// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { auth } from "../firebase";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import axios from "axios";
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

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Limpia errores anteriores

    try {
      // Enviar credenciales al backend
      const response = await axios.post("http://localhost:4000/auth/login", { email, password });
      const { rol } = response.data;

      // Validar el rol del usuario y redirigir
      if (rol === "administrador") {
        navigate("/administracion"); // Redirige a Administracion.jsx
      } else {
        navigate("/dashboard"); // Redirige a Dashboard.jsx
      }
    } catch (err) {
      console.error("Error en el inicio de sesión:", err);
      setError("Credenciales incorrectas o error en el servidor.");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Iniciar Sesión</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  );
};

export default Login;
