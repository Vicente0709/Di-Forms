import React from "react";
import { useFormContext } from "react-hook-form";

function Justification() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  // Watching the values of both fields
  const objetivoProyectoValue = watch("objetivoProyecto", "");
  const relevanciaEventoValue = watch("relevanciaViajeTecnico", "");

  return (
    <div className="form-container">
      <h3>• JUSTIFICACIÓN Y RELEVANCIA DE LA PARTICIPACIÓN</h3>

      {/* 3.1 Objetivo, resultado o producto del proyecto */}
      <div className="form-group">
        <label htmlFor="objetivoProyecto" className="form-label">
          Objetivo, resultado o producto del proyecto al que aporta la
          participación en el evento.
        </label>
        <label htmlFor="objetivoProyecto">
          Escriba textualmente el objetivo, resultado o producto del proyecto.
        </label>
        <br></br>
        <label htmlFor="objetivoProyecto">
          Esta información debe ser tomada de la propuesta aprobada.
        </label>

        <textarea
          id="objetivoProyecto"
          {...register("objetivoProyecto", {
            required: "Este campo es requerido",
            validate: (value) =>
              value.length >= 50 || "La descripción está muy corta. Debe tener al menos 50 caracteres.",
          })}
          className="form-input"
        />
        {errors.objetivoProyecto && (
          <span className="error-text">{errors.objetivoProyecto.message}</span>
        )}
        {objetivoProyectoValue.length < 50 && (
          <span className="error-text"></span>
        )}
      </div>

      {/* 3.2 Relevancia del evento para su proyecto */}
      <div className="form-group">
        <label htmlFor="relevanciaViajeTecnico" className="form-label">
          • Relevancia del viaje técnico para el desarrollo del proyecto:
        </label>
        <label htmlFor="relevanciaViajeTecnico">
          Describa la relevancia del viaje técnico y aporte al cumplimiento del objetivo, resultado o producto.
        </label>
        <textarea
          id="relevanciaViajeTecnico"
          {...register("relevanciaViajeTecnico", {
            required: "Este campo es requerido",
            validate: (value) =>
              value.length >= 50 || "La descripción está muy corta. Debe tener al menos 50 caracteres.",
          })}
          className="form-input"
        />
        {errors.relevanciaViajeTecnico && (
          <span className="error-text">{errors.relevanciaViajeTecnico.message}</span>
        )}
        {relevanciaEventoValue.length < 50 && (
          <span className="error-text"></span>
        )}
      </div>
    </div>
  );
}

export default Justification;