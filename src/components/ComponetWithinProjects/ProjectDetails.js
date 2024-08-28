// ProjectDetails.js
import React from "react";
import { useFormContext } from "react-hook-form";

function ProjectDetails() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const codigoProyectoPattern = /^[A-Za-z]+(-[A-Za-z0-9]+)+$/;
  const codigoProyectoValue = watch("codigoProyecto");
  const codigoProyectoError =
    codigoProyectoValue && !codigoProyectoPattern.test(codigoProyectoValue)
      ? "Error en el formato del código del proyecto: "
      : null;

  return (
    <div className="form-container">
      <h2 className="form-title">• Detalles del proyecto</h2>
      
      <div className="form-group">
        <label htmlFor="codigoProyecto" className="form-label">
          Código del proyecto:
        </label>
        <input
          type="text"
          id="codigoProyecto"
          {...register("codigoProyecto", {
            required: "El código del proyecto es requerido",
            validate: (value) =>
              codigoProyectoPattern.test(value) ||
              "El código del proyecto debe estar conformado por una combinación de letras y números separados por guiones",
          })}
          className="form-input"
        />
        {codigoProyectoError && (
          <span className="error-text">{codigoProyectoError}</span>
        )}
        {errors.codigoProyecto && (
          <span className="error-text">{errors.codigoProyecto.message}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="tituloProyecto" className="form-label">
          Título de proyecto:
        </label>
        <input
          type="text"
          id="tituloProyecto"
          {...register("tituloProyecto", {
            required: "El título del proyecto es requerido",
          })}
          className="form-input"
        />
        {errors.tituloProyecto && (
          <span className="error-text">{errors.tituloProyecto.message}</span>
        )}
      </div>
    </div>
  );
}

export default ProjectDetails;
