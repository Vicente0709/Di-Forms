import React from "react";

function ExteriorDetail() {
  return (
    <div className="form-container">
      <h3>• DOCUMENTACIÓN REQUERIDA PARA AUSPICIOS AL EXTERIOR</h3>
      {/* Documentacion Requisitos */}
      <div className="form-group">
        <label htmlFor="documentosRequisito" className="form-label">
          REQUISITOS:
        </label>
        <label htmlFor="documentosRequisito">
          • Formulario de solicitud de autorización para cumplimiento de
          servicios institucionales
        </label>
        <br />
        <label htmlFor="documentosRequisito">
          • Formulario para salida al exterior dentro de proyectos – viajes
          técnicos
        </label>
        <label htmlFor="documentosRequisito">
          • Copia de la carta de invitación
        </label>
        <label htmlFor="documentosRequisito">
          • Planificación/cronograma de actividades académicas a recuperar,
          avalada por el represente del curso y el Jefe o Director de la Unidad
          Académica. O en el caso de que esta actividad se realice fuera del
          periodo de clases aval del Jefe o Director de la Unidad Académica
          indicando este particular.
        </label>
        <label htmlFor="documentosRequisito">
          • Quipux por parte del Director del Proyecto al Vicerrectorado de
          Investigación, Innovación y Vinculación, detallando el requerimiento
          de la salida al exterior.
        </label>
      </div>
    </div>
  );
}
export default ExteriorDetail;
