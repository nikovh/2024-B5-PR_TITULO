import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Registro from './components/Registro';
import Dashboard from './components/Dashboard';
import AccesoProtegido from './components/AccesoProtegido';
import ExpedienteDetalle from "./components/ExpedienteDetalle";
import ExpedienteManager from "./components/ExpedienteManager";
import ExpedienteFormPage from "./components/ExpedienteFormPage";
import PruebaHook from "./components/hooks/PruebaHook";
import Formulario1 from "./components/Formularios/Formulario1";




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={ <AccesoProtegido> <Dashboard /> </AccesoProtegido> }/>
        <Route path="/registro" element={<Registro />} />
        <Route path="/expediente-form" element={<ExpedienteFormPage />} />
        <Route path="/expedientes" element={<ExpedienteManager />} />
        {/* rutas con parametros */}
        <Route path="/expedientes/:email" element={<ExpedienteManager />} />
        <Route path="/detalle/:id" element={<ExpedienteDetalle />} />
        


        <Route path="/ph" element={<PruebaHook expedienteId="1070" />} />
        <Route path="/form1" element={<Formulario1 expedienteId={1070} />} />



      </Routes>
    </BrowserRouter>
  );
}

export default App;
