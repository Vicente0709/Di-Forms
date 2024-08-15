import React from "react";
import { useFormContext } from 'react-hook-form';

function Justification() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="form-container">
      <h3>3. JUSTIFICACIÓN Y RELEVANCIA DE LA PARTICIPACIÓN</h3>

      {/* 3.1 Objetivo, resultado o producto del proyecto */}
      <div className="form-group">
        <label htmlFor="objetivoProyecto" className="form-label">
          3.1 Objetivo, resultado o producto del proyecto al que aporta la participación en el evento
        </label>
        <textarea
          id="objetivoProyecto"
          {...register("objetivoProyecto", { required: "Este campo es requerido" })}
          className="form-input"
          placeholder="Esta información debe ser tomada de la propuesta aprobada."
        />
        {errors.objetivoProyecto && <span className="error-text">{errors.objetivoProyecto.message}</span>}
      </div>

      {/* 3.2 Relevancia del evento para su proyecto */}
      <div className="form-group">
        <label htmlFor="relevanciaEvento" className="form-label">
          3.2 Relevancia del evento para su proyecto
        </label>
        <textarea
          id="relevanciaEvento"
          {...register("relevanciaEvento", { required: "Este campo es requerido" })}
          className="form-input"
          placeholder="Describa la relevación del evento y aporte al cumplimiento del objetivo, resultado o producto."
        />
        {errors.relevanciaEvento && <span className="error-text">{errors.relevanciaEvento.message}</span>}
      </div>
    </div>
  );
}

export default Justification;