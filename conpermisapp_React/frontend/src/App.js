import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AccesoProtegido from './components/AccesoProtegido';
import Registro from './components/Registro';
import ExpedienteFormPage from "./components/ExpedienteFormPage";


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
        <Route path="/expediente/nuevo" element={<ExpedienteFormPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
