import React from "react";
import { useFormContext } from "react-hook-form";

function PersonalDetails() {
  const {
    register,
    // watch,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="form-container">
      <h2 className="form-title">• Datos personales</h2>
      {/* Nombres */}
      <div className="form-group">
        <label htmlFor="nombres" className="form-label">
          Nombres del participante:
        </label>
        <input
          type="text"
          id="nombres"
          placeholder="JUAN SEBASTIAN"
          {...register("nombres", { required: "Los nombres son requeridos" })}
          className="form-input"
        />
        {errors.nombres && (
          <span className="error-text">{errors.nombres.message}</span>
        )}
      </div>
      {/* Apellidos */}
      <div className="form-group">
        <label htmlFor="apellidos" className="form-label">
          Apellidos del participante:
        </label>
        <input
          type="text"
          id="apellidos"
          placeholder="PEREZ RAMIREZ"
          {...register("apellidos", {
            required: "Los apellidos son requeridos",
          })}
          className="form-input"
        />
        {errors.apellidos && (
          <span className="error-text">{errors.apellidos.message}</span>
        )}
      </div>

      {/* Departamento */}
      <div className="form-group">
        <label htmlFor="departamento" className="form-label">
          Departamento / Instituto:
        </label>
        <select
          id="departamento"
          {...register("departamento", {
            required: "El departamento es requerido",
          })}
          className="form-select"
        >
          <option value="">Seleccione un departamento</option>
          <option value="DEPARTAMENTO DE AUTOMATIZACIÓN Y CONTROL INDUSTRIAL">
            DEPARTAMENTO DE AUTOMATIZACIÓN Y CONTROL INDUSTRIAL
          </option>
          <option value="DEPARTAMENTO DE BIOLOGÍA">
            DEPARTAMENTO DE BIOLOGÍA
          </option>
          <option value="DEPARTAMENTO DE CIENCIAS ADMINISTRATIVAS">
            DEPARTAMENTO DE CIENCIAS ADMINISTRATIVAS
          </option>
          <option value="DEPARTAMENTO DE CIENCIAS DE ALIMENTOS Y BIOTECNOLOGÍA">
            DEPARTAMENTO DE CIENCIAS DE ALIMENTOS Y BIOTECNOLOGÍA
          </option>
          <option value="DEPARTAMENTO DE CIENCIAS NUCLEARES">
            DEPARTAMENTO DE CIENCIAS NUCLEARES
          </option>
          <option value="DEPARTAMENTO DE CIENCIAS SOCIALES">
            DEPARTAMENTO DE CIENCIAS SOCIALES
          </option>
          <option value="DEPARTAMENTO DE ECONOMÍA CUANTITATIVA">
            DEPARTAMENTO DE ECONOMÍA CUANTITATIVA
          </option>
          <option value="DEPARTAMENTO DE ELECTRÓNICA, TELECOMUNICACIONES Y REDES DE LA INFORMACIÓN">
            DEPARTAMENTO DE ELECTRÓNICA, TELECOMUNICACIONES Y REDES DE LA
            INFORMACIÓN
          </option>
          <option value="DEPARTAMENTO DE ENERGÍA ELÉCTRICA">
            DEPARTAMENTO DE ENERGÍA ELÉCTRICA
          </option>
          <option value="DEPARTAMENTO DE ESTUDIOS ORGANIZACIONALES Y DESARROLLO HUMANO">
            DEPARTAMENTO DE ESTUDIOS ORGANIZACIONALES Y DESARROLLO HUMANO
          </option>
          <option value="DEPARTAMENTO DE FÍSICA">DEPARTAMENTO DE FÍSICA</option>
          <option value="DEPARTAMENTO DE FORMACIÓN BÁSICA">
            DEPARTAMENTO DE FORMACIÓN BÁSICA
          </option>
          <option value="DEPARTAMENTO DE GEOLOGÍA">
            DEPARTAMENTO DE GEOLOGÍA
          </option>
          <option value="DEPARTAMENTO DE INFORMÁTICA Y CIENCIAS DE LA COMPUTACIÓN">
            DEPARTAMENTO DE INFORMÁTICA Y CIENCIAS DE LA COMPUTACIÓN
          </option>
          <option value="DEPARTAMENTO DE INGENIERIA CIVIL Y AMBIENTAL">
            DEPARTAMENTO DE INGENIERIA CIVIL Y AMBIENTAL
          </option>
          <option value="DEPARTAMENTO DE INGENIERÍA MECÁNICA">
            DEPARTAMENTO DE INGENIERÍA MECÁNICA
          </option>
          <option value="DEPARTAMENTO DE INGENIERÍA QUÍMICA">
            DEPARTAMENTO DE INGENIERÍA QUÍMICA
          </option>
          <option value="DEPARTAMENTO DE MATERIALES">
            DEPARTAMENTO DE MATERIALES
          </option>
          <option value="DEPARTAMENTO DE MATEMÁTICA">
            DEPARTAMENTO DE MATEMÁTICA
          </option>
          <option value="DEPARTAMENTO DE METALURGIA EXTRACTIVA">
            DEPARTAMENTO DE METALURGIA EXTRACTIVA
          </option>
          <option value="DEPARTAMENTO DE PETRÓLEOS">
            DEPARTAMENTO DE PETRÓLEOS
          </option>
          <option value="INSTITUTO GEOFISICO">INSTITUTO GEOFISICO</option>
        </select>
        {errors.departamento && (
          <span className="error-text">{errors.departamento.message}</span>
        )}
      </div>
    </div>
  );
}

export default PersonalDetails;
