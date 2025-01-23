import React from "react";
import GenerarPDF from "../GenerarPDF";
import useFetchDatos from "../hooks/useFetchDatos";
import { useParams } from "react-router-dom";


const SolicitudArt124 = () => {
  const { id } = useParams();
  const { datos, error } = useFetchDatos(id);
  const fileName = `conPermisApp_formulario_${id}.pdf`;

    // Logs para depuración
    console.log("Datos obtenidos desde el hook:", datos);
    console.log("Error obtenido desde el hook:", error);
    console.log("Expediente ID recibido:", id);


  // Mostrar mensaje de error
  if (error) return <p style={{ color: "red" }}>Error al cargar los datos: {error}</p>;

  // Validar que los datos existan
  if (!datos || !datos.expediente) {
    return <p style={{ textAlign: "center" }}>Cargando datos del expediente...</p>;
  }

  const { propiedad, propietario } = datos;

    // validar datos de propiedad y propietario
    if (!propiedad || !propietario) {
      console.warn("Propiedad o Propietario no están disponibles en los datos:");
      console.warn("Propiedad:", propiedad);
      console.warn("Propietario:", propietario);
      return <p style={{ textAlign: "center" }}>Datos incompletos. Verifique el expediente.</p>;
    }

  return (
    <GenerarPDF filename={fileName}>
      <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <h3 style={{ textAlign: "center", textDecoration: "underline" }}>
          SOLICITUD PARA ACOGERSE AL ART. 124º DE LA L.G.U.C.
        </h3>

        <p style={{ marginTop: "40px" }}>
          DE: {`${propietario.nombres} ${propietario.apellidos}`}
        </p>
        <p>PARA: Sr. Director de Obras Municipales de Santiago</p>

        <p style={{ marginTop: "20px" }}>
          Sr. Director de Obras, solicito a usted acoger a autorización transitoria según art. 124º de
          la Ley General de Urbanismo y Construcciones, la propiedad ubicada en{" "}
          {`${propiedad.direccion} ${propiedad.numero}`}, de esta comuna.
        </p>

        <p>
          La parte de la edificación para la cual se solicita dicha autorización provisoria corresponde
          a la superficie que se encuentra en área de antejardín, producto del ensanche realizado en
          av. {propiedad.direccion} y que afecta el proceso de autorización del
          presente expediente de Permiso de Edificación, en una superficie total de{" "}
          {propiedad.m2}.
        </p>

        <p>Esperando tener a bien mi solicitud, saluda respetuosamente,</p>

        <p style={{ marginTop: "60px" }}>
          {`${propietario.nombres} ${propietario.apellidos}`}
        </p>
        <p>{propietario.rut}</p>
      </div>
    </GenerarPDF>

  );
};

export default SolicitudArt124;
