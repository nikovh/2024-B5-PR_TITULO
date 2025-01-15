import React from "react";
import { generarPdfFormulario } from "../utils/pdfUtils";

function GenerarPdfFormulario({ formData }) {
    
    const handleDescargarPDF = () => {
        const doc = generarPdfFormulario(formData);
        doc.save(`formulario-${formData.id}.pdf`);
    };

    const handleVerPDF = () => {
        const doc = generarPdfFormulario(formData);
        const pdfBlob = doc.output('bloburl');
        window.open(pdfBlob, '_blank');
    };

    return (
        <div>
            <h3>Generar PDF del Formulario</h3>
            <button onClick={handleDescargarPDF}>Descargar PDF</button>
            <button onClick={handleVerPDF}>Ver PDF en nueva pestaña</button>
        </div>
    );
}

export default GenerarPdfFormulario;