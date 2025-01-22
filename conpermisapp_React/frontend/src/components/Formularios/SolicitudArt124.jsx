import React from 'react';

const SolicitudArt124 = ({ propiedad, propietario, expediente }) => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', textDecoration: 'underline' }}>
        SOLICITUD PARA ACOGERSE AL ART. 124º DE LA L.G.U.C.
      </h1>

      <p><strong>OBRA:</strong> PERMISO DE EDIFICACIÓN – Obra Nueva</p>
      <p><strong>UBICACIÓN:</strong> {propiedad.direccion || 'VICUÑA MACKENNA N°1351'}</p>
      <p><strong>COMUNA:</strong> {propiedad.comuna || 'SANTIAGO'}</p>
      <p><strong>ROL:</strong> {propiedad.rolSII || '3092 - 01'}</p>
      <p><strong>PROPIETARIO:</strong> {propietario.nombre || 'DOMINGO JARA Y CÍA. LTDA.'}</p>
      <p><strong>ARQUITECTO:</strong> {expediente.arquitecto || 'NICOLÁS VALENZUELA HERNÁNDEZ'}</p>

      <p style={{ marginTop: '40px' }}>DE: {propietario.representante || 'Domingo Jara Ormeño'}</p>
      <p>PARA: Sr. Director de Obras Municipales de Santiago</p>

      <p style={{ marginTop: '20px' }}>
        Sr. Director de Obras, solicito a usted acoger a autorización transitoria según art. 124º de
        la Ley General de Urbanismo y Construcciones, la propiedad ubicada en {propiedad.direccion || 'Vicuña Mackenna N° 1351'},
        de esta comuna.
      </p>

      <p>
        La parte de la edificación para la cual se solicita dicha autorización provisoria corresponde
        a la superficie que se encuentra en área de antejardín, producto del ensanche realizado en
        av. {propiedad.calle || 'Vicuña Mackenna'} y que afecta el proceso de autorización del presente expediente de Permiso de
        Edificación, en una superficie total de {expediente.superficie || '516,35 m2'}.
      </p>

      <p>Esperando tener a bien mi solicitud, saluda respetuosamente,</p>

      <p style={{ marginTop: '60px' }}>{propietario.representante || 'Domingo Jara Ormeño'}</p>
      <p>{propietario.rut || '9.578.437-2'}</p>
      <p>Representante Legal</p>
    </div>
  );
};

export default SolicitudArt124;
