import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AccesoProtegido from './components/AccesoProtegido';
import Registro from './components/Registro';
import ExpedienteFormPage from "./components/ExpedienteFormPage";

import ExpedienteManager from "./components/ExpedienteManager";
import ExpedienteDetalle from "./components/ExpedienteDetalle";




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={
          <AccesoProtegido>
            <Dashboard />
          </AccesoProtegido> }
        />
        <Route path="/registro" element={<Registro />} />
        <Route path="/expediente-form" element={<ExpedienteFormPage />} />
        <Route path="/expedientes" element={<ExpedienteManager />} />
        <Route path="/detalle/:id" element={<ExpedienteDetalle />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
