import React from "react";
import { useFormContext } from 'react-hook-form';

function ProjectDetails() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="form-container">
      <h3>1. DATOS DEL PROYECTO Y DEL INVESTIGADOR PARTICIPANTE</h3>

      <div className="form-group">
        <label htmlFor="codigoProyecto" className="form-label">Código del proyecto:</label>
        <input
          type="text"
          id="codigoProyecto"
          {...register("codigoProyecto", { required: "El código del proyecto es requerido" })}
          className="form-input"
        />
        {errors.codigoProyecto && <span className="error-text">{errors.codigoProyecto.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="tituloProyecto" className="form-label">Título de proyecto:</label>
        <input
          type="text"
          id="tituloProyecto"
          {...register("tituloProyecto", { required: "El título del proyecto es requerido" })}
          className="form-input"
        />
        {errors.tituloProyecto && <span className="error-text">{errors.tituloProyecto.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="cedula" className="form-label">Cédula de ciudadanía:</label>
        <input
          type="text"
          id="cedula"
          {...register("cedula", {
            required: "La cédula es requerida",
            pattern: {
              value: /^\d{1,10}$/,
              message: "La cédula debe contener solo dígitos y tener un máximo de 10 dígitos"
            }
          })}
          className="form-input"
        />
        {errors.cedula && <span className="error-text">{errors.cedula.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="nombreCompleto" className="form-label">Nombres Completos del participante:</label>
        <input
          type="text"
          id="nombreCompleto"
          placeholder="En mayusculas, ejemplo: JUAN SEBASTIAN PEREZ RAMIREZ"
          {...register("nombreCompleto", { required: "El nombre completo es requerido" })}
          className="form-input"
        />
        {errors.nombreCompleto && <span className="error-text">{errors.nombreCompleto.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="cargo" className="form-label">Cargo:</label>
        <input
          type="text"
          id="cargo"
          {...register("cargo", { required: "El cargo es requerido" })}
          className="form-input"
        />
        {errors.cargo && <span className="error-text">{errors.cargo.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="rolEnProyecto" className="form-label">Rol en el proyecto:</label>
        <select
          id="rolEnProyecto"
          {...register("rolEnProyecto", { required: "El rol en el proyecto es requerido" })}
          className="form-select"
        >
          <option value="">Seleccione un rol</option>
          <option value="Director">Director</option>
          <option value="Codirector">Codirector</option>
          <option value="Colaborador">Colaborador</option>
        </select>
        {errors.rolEnProyecto && <span className="error-text">{errors.rolEnProyecto.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="departamento" className="form-label">Departamento / Instituto:</label>
        <input
          type="text"
          id="departamento"
          {...register("departamento", { required: "El nombre del departamente es requerido" })}
          className="form-input"
        />
        {errors.departamento && <span className="error-text">{errors.departamento.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="nombreJefeInmediato" className="form-label">Nombre del jefe inmediato:</label>
        <input
          type="text"
          id="nombreJefeInmediato"
          {...register("nombreJefeInmediato", { required: "El nombre del jefe inmediato es requerido" })}
          className="form-input"
        />
        {errors.nombreJefeInmediato && <span className="error-text">{errors.nombreJefeInmediato.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="cargoJefeInmediato" className="form-label">Cargo del jefe inmediato:</label>
        <input
          type="text"
          id="cargoJefeInmediato"
          {...register("cargoJefeInmediato", { required: "El cargo del jefe inmediato es requerido" })}
          className="form-input"
        />
        {errors.cargoJefeInmediato && <span className="error-text">{errors.cargoJefeInmediato.message}</span>}
      </div>
    </div>
  );
}

export default ProjectDetails;