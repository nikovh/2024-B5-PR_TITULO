import React from "react";
import GenerarPDF from "../GenerarPDF";
import DatosHeader from "../FormPage/DatosHeader";
import useFetchDatos from "../hooks/useFetchDatos";


const SolicitudArt124 = ({ expedienteId }) => {
  const { datos, error } = useFetchDatos(expedienteId);
  const fileName = `conPermisApp_formulario_${expedienteId}.pdf`;

  if (error) return <p>Error al cargar los datos: {error}</p>;
  if (!datos) return <p>Cargando...</p>;

  return (
    <GenerarPDF filename={fileName}>
      <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <h3 style={{ textAlign: "center", textDecoration: "underline" }}>
          SOLICITUD PARA ACOGERSE AL ART. 124º DE LA L.G.U.C.
        </h3>

        <DatosHeader expedienteId={expedienteId} />

        <p style={{ marginTop: "40px" }}>
          {/* DE: {propietario.nombres && propietario.apellidos
            ? `${propietario.nombres} ${propietario.apellidos}`
            : "Domingo Jara Ormeño"} */}
        </p>
        <p>PARA: Sr. Director de Obras Municipales de Santiago</p>

        {/* <p style={{ marginTop: "20px" }}>
          Sr. Director de Obras, solicito a usted acoger a autorización transitoria según art. 124º de
          la Ley General de Urbanismo y Construcciones, la propiedad ubicada en{" "}
          {`${propiedad.direccion || "Vicuña Mackenna"} ${propiedad.numero || "N° 1351"
            }`}, de esta comuna.
        </p>

        <p>
          La parte de la edificación para la cual se solicita dicha autorización provisoria corresponde
          a la superficie que se encuentra en área de antejardín, producto del ensanche realizado en
          av. {propiedad.direccion || "Vicuña Mackenna"} y que afecta el proceso de autorización del
          presente expediente de Permiso de Edificación, en una superficie total de{" "}
          {propiedad.m2 || "516,35 m2"}.
        </p>

        <p>Esperando tener a bien mi solicitud, saluda respetuosamente,</p>

        <p style={{ marginTop: "60px" }}>
          {propietario.nombres && propietario.apellidos
            ? `${propietario.nombres} ${propietario.apellidos}`
            : "Domingo Jara Ormeño"}
        </p>
        <p>{propietario.rut || "9.578.437-2"}</p> */}
        <p>Representante Legal</p>
      </div>
    </GenerarPDF>

  );
};

export default SolicitudArt124;
