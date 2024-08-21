import React from "react";
import { useFormContext } from "react-hook-form";

function InstitutionalServices() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="form-container">
      <h3>• SERVIDORES QUE INTEGRAN LOS SERVICIOS INSTITUCIONALES (opcional)</h3>
      <p>Completar esta sección solo en caso de que usted asista al mismo evento junto con otros funcionarios.</p>

      <div className="form-group">
        <label htmlFor="servidores" className="form-label">
          Nombre de los funcionarios:
        </label>
        <textarea
          id="servidores"
          {...register("servidores")}
          className="form-input"
          placeholder="Escriba aquí los nombres de los funcionarios, separados por comas"
        />
        {errors.servidores && (
          <span className="error-text">{errors.servidores.message}</span>
        )}
      </div>
    </div>
  );
}

export default InstitutionalServices;