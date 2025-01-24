import React from "react";
import useFetchDatos from "./useFetchDatos";


const PruebaHook = ({ expedienteId }) => {
  const { datos, error } = useFetchDatos(expedienteId);
  console.log("Datos obtenidos desde el hook:", datos);
  if (error) {
    return <p style={{ color: "red" }}>Error: {error}</p>;
  }

  return (
    <div>
      <h1>Prueba Hook</h1>
      <pre>{JSON.stringify(datos, null, 2)}</pre>
    </div>
  );
};

export default PruebaHook;