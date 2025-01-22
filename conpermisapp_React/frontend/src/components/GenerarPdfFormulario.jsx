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
            <button onClick={handleVerPDF}>Vista Previa del PDF</button>
            <button onClick={handleDescargarPDF}>Descargar PDF</button>
        </div>
    );
}

export default GenerarPdfFormulario;
