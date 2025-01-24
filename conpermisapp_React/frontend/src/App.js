import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Registro from './components/Registro';
import Dashboard from './components/Dashboard';
import AccesoProtegido from './components/AccesoProtegido';
import ExpedienteDetalle from "./components/ExpedienteDetalle";
import ExpedienteManager from "./components/ExpedienteManager";
import ExpedienteFormPage from "./components/ExpedienteFormPage";
import Administracion from "./components/Administracion";



import Formulario1 from "./components/Formularios/Formulario1";
import SolicitudArt124 from "./components/Formularios/SolicitudArt124";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                   element={<Login />} />
        <Route path="/dashboard"          element={ <AccesoProtegido rolesPermitidos={["usuario"]}> <Dashboard /> </AccesoProtegido> }/>
        <Route path="/administracion"     element={ <AccesoProtegido rolesPermitidos={["admin"]}> <Administracion /> </AccesoProtegido> }/> 
        {/* <Route path="/dashboard"          element={ <AccesoProtegido> <Dashboard /> </AccesoProtegido> }/>
        <Route path="/administracion"     element={ <AccesoProtegido> <Administracion /> </AccesoProtegido> }/> */}

        <Route path="/registro"           element={<Registro />} />
        <Route path="/expediente-form"    element={<ExpedienteFormPage />} />
        <Route path="/expedientes"        element={<ExpedienteManager />} />


        {/* rutas con parametros */}
        <Route path="/expedientes/:email" element={<ExpedienteManager />} />
        <Route path="/detalle/:id"        element={<ExpedienteDetalle />} />


        {/* provisorias */}

        <Route path="/form1/:id"          element={<Formulario1 />} />
        <Route path="/124/:expedienteId"  element={<SolicitudArt124 />} />



      </Routes>
    </BrowserRouter>
  );
}

export default App;




// import React from "react";
// import PruebaHook from "./components/hooks/PruebaHook"; // Ajusta la ruta según tu proyecto

// const App = () => {
//     return (
//         <div>
//             <PruebaHook expedienteId="1074" />
//         </div>
//     );
// };

// export default App;
