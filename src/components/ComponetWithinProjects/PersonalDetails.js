import React from "react";
import { useFormContext } from "react-hook-form";

const validarCedulaEcuatoriana = (cedula) => {
  if (cedula.length !== 10) return false;

  const provincia = parseInt(cedula.slice(0, 2), 10);
  if (provincia < 1 || provincia > 24) return false;

  let suma = 0;
  for (let i = 0; i < 9; i++) {
    let digito = parseInt(cedula[i], 10);
    if (i % 2 === 0) {
      digito *= 2;
      if (digito > 9) digito -= 9;
    }
    suma += digito;
  }

  const digitoVerificador = (10 - (suma % 10)) % 10;
  return digitoVerificador === parseInt(cedula[9], 10);
};

function PersonalDetails() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const cedulaValue = watch("cedula");

  return (
    <div className="form-container">
      <h2 className="form-title">• Datos personales</h2>
      
      <div className="form-group">
        <label htmlFor="cedula" className="form-label">
          Cédula de ciudadanía:
        </label>
        <input
          type="text"
          id="cedula"
          {...register("cedula", {
            required: "La cédula es requerida",
            pattern: {
              value: /^\d{10}$/,
              message: "La cédula debe contener solo 10 dígitos",
            },
            validate: (value) =>
              validarCedulaEcuatoriana(value) || "La cédula no es válida",
          })}
          className="form-input"
        />
        {errors.cedula && (
          <span className="error-text">{errors.cedula.message}</span>
        )}
        {cedulaValue &&
          !errors.cedula &&
          !validarCedulaEcuatoriana(cedulaValue) && (
            <span className="error-text">La cédula no es válida</span>
          )}
      </div>

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

      <div className="form-group">
        <label htmlFor="cargo" className="form-label">
          Cargo:
        </label>
        <label htmlFor="cargo">
          Tal como consta en su acción de personal. Ejemplos: Profesor
          Agregado a Tiempo Completo; Profesor Auxiliar a Tiempo Completo;
          Profesor Principal a Tiempo Completo.
        </label>
        <input
          type="text"
          id="cargo"
          placeholder="Profesor Agregado a Tiempo Completo/ Profesor Auxiliar a Tiempo Completo.. "
          {...register("cargo", { required: "El cargo es requerido" })}
          className="form-input"
        />
        {errors.cargo && (
          <span className="error-text">{errors.cargo.message}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="rolEnProyecto" className="form-label">
          Rol en el proyecto:
        </label>
        <select
          id="rolEnProyecto"
          {...register("rolEnProyecto", {
            required: "El rol en el proyecto es requerido",
          })}
          className="form-select"
        >
          <option value="">Seleccione un rol</option>
          <option value="Director">Director</option>
          <option value="Codirector">Codirector</option>
          <option value="Colaborador">Colaborador</option>
        </select>
        {errors.rolEnProyecto && (
          <span className="error-text">{errors.rolEnProyecto.message}</span>
        )}
      </div>

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

      <div className="form-group">
        <label htmlFor="nombreJefeInmediato" className="form-label">
          Nombres y apellidos del Jefe inmediato:
        </label>
        <input
          type="text"
          id="nombreJefeInmediato"
          {...register("nombreJefeInmediato", {
            required: "El nombre del jefe inmediato es requerido",
          })}
          className="form-input"
        />
        {errors.nombreJefeInmediato && (
          <span className="error-text">
            {errors.nombreJefeInmediato.message}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="cargoJefeInmediato" className="form-label">
          Cargo del Jefe inmediato:
        </label>
        <label htmlFor="cargoJefeInmediato">
          Favor colocar el cargo del Jefe inmediato, puede usar las siglas
          para referirse al departamento. Ejemplo: Jefe del DACI / Jefe del DACI, subrogante
        </label>
        <input
          type="text"
          id="cargoJefeInmediato"
          {...register("cargoJefeInmediato", {
            required: "El cargo del jefe inmediato es requerido",
            minLength: {
              value: 10,
              message: "El cargo que escribio es demasiado corto",
            },
          })}
          className="form-input"
        />
        {errors.cargoJefeInmediato && (
          <span className="error-text">
            {errors.cargoJefeInmediato.message}
          </span>
        )}
      </div>
    </div>
  );
}

export default PersonalDetails;
