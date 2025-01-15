import React, { useState } from "react";
import DatosPropiedad from "./FormPage/DatosPropiedad";
import DatosPropietario from './FormPage/DatosPropietario';
import ArquitectoPatrocinante from './FormPage/ArquitectoPatrocinante';
import Desplegable from './FormPage/Desplegable';

// const ExpedienteFormPage = ({ subtipo }) => {
//     console.log("Renderizando ExpedienteFormPage");
//     const [formData, setFormData] = useState({
//         propiedad: {},
//         propietario: {},
//         arquitectoPatrocinante: {},
//     });

//     const handleSubmit = async () => {
//         // validar datos y guardar en Firestore
//     };

//     return (
//         <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
//             <h1>Formulario para {subtipo}</h1>
            
//             <Accordion defaultExpanded>
//                 <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//                     <Typography>Datos de la Propiedad</Typography>
//                 </AccordionSummary>
//                 <AccordionDetails>
//                     <DatosPropiedad onUpdate={(data) => setFormData({ ...formData, propiedad: data })} />
//                 </AccordionDetails>
//             </Accordion>

//             <Accordion>
//                 <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//                     <Typography>Datos del Propietario</Typography>
//                 </AccordionSummary>
//                 <AccordionDetails>
//                     <DatosPropietario onUpdate={(data) => setFormData({ ...formData, propietario: data })} />
//                 </AccordionDetails>
//             </Accordion>

//             <Accordion>
//                 <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//                     <Typography>Arquitecto Patrocinante</Typography>
//                 </AccordionSummary>
//                 <AccordionDetails>
//                     <ArquitectoPatrocinante onUpdate={(data) => setFormData({ ...formData, arquitectoPatrocinante: data })} />
//                 </AccordionDetails>
//             </Accordion>

//             <button onClick={handleSubmit}>Guardar Expediente</button>
//         </div>
//     );
// };

const ExpedienteFormPage = ({ subtipo }) => {
    const [formData, setFormData] = useState({
        propiedad: {},
        propietario: {},
        arquitectoPatrocinante: {},
    });

    const handleSubmit = async () => {
        console.log("Datos del expediente:", formData);
        // Validar y guardar en Firestore
    };

    return (
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
            <h1>Formulario para {subtipo}</h1>

            <Desplegable title="Datos de la Propiedad" defaultExpanded>
                <DatosPropiedad onUpdate={(data) => setFormData({ ...formData, propiedad: data })} />
            </Desplegable>

            <Desplegable title="Datos del Propietario">
                <DatosPropietario onUpdate={(data) => setFormData({ ...formData, propietario: data })} />
            </Desplegable>

            <Desplegable title="Arquitecto Patrocinante">
                <ArquitectoPatrocinante
                    onUpdate={(data) => setFormData({ ...formData, arquitectoPatrocinante: data })}
                />
            </Desplegable>

            <button onClick={handleSubmit}>Guardar Expediente</button>
        </div>
    );
};

export default ExpedienteFormPage;
