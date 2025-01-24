const AccesoProtegido = ({ children, rolesPermitidos }) => {
    const token = localStorage.getItem("token");
    const rol = localStorage.getItem("rol"); // Asegúrate de guardar este dato durante el inicio de sesión

    if (!token) {
        // Si no hay token, redirige al login
        window.location.href = "/";
        return null;
    }

    if (rolesPermitidos && !rolesPermitidos.includes(rol)) {
        // Si el rol del usuario no está permitido, redirige al login
        alert("No tienes permisos para acceder a esta página");
        window.location.href = "/";
        return null;
    }

    return children;
};


export default AccesoProtegido;