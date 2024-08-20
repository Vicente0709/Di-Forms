import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";

function ActivitySchedule() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "actividades",
  });

  return (
    <div className="form-container">
      <h3>6. CRONOGRAMA DE ACTIVIDADES</h3>
      <p className="instruction-text">
        Incluir desde la fecha de salida del país y días de traslado hasta el
        día de llegada al destino.
        <br />
        Hasta incluir la fecha de llegada al país.
      </p>

      <table className="activity-schedule-table">
        <thead>
          <tr>
            <th>Nro.</th>
            <th>Fecha</th>
            <th>Descripción de la Actividad a Realizar</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {fields.map((field, index) => (
            <tr key={field.id}>
              <td>
                {/* El número se asigna automáticamente basado en el índice + 1 */}
                <input
                  type="number"
                  value={index + 1} // Asigna el número basado en el índice (1, 2, 3, etc.)
                  readOnly
                  className="form-input"
                />
              </td>
              <td>
                <input
                  type="date"
                  id={`fecha-${index}`}
                  className="form-input"
                  {...register(`actividades[${index}].fecha`, {
                    required: "Este campo es requerido",
                  })}
                />
                {errors.actividades && errors.actividades[index]?.fecha && (
                  <span className="error-text">
                    {errors.actividades[index].fecha.message}
                  </span>
                )}
              </td>
              <td>
                <input
                  type="text"
                  id={`descripcion-${index}`}
                  className="form-input"
                  {...register(`actividades[${index}].descripcion`, {
                    required: "Este campo es requerido",
                  })}
                  placeholder="Describe la actividad a realizar"
                />
                {errors.actividades &&
                  errors.actividades[index]?.descripcion && (
                    <span className="error-text">
                      {errors.actividades[index].descripcion.message}
                    </span>
                  )}
              </td>
              <td>
                <button type="button" onClick={() => remove(index)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        type="button"
        onClick={() =>
          append({
            fecha: "",
            descripcion: "",
          })
        }
        className="add-activity-button"
      >
        Agregar Actividad
      </button>

      <div className="form-container">
        <h3>
          6.2 Justificar la necesidad de la comisión de servicios mayor a 15
          días
        </h3>
        <p className="instruction-text">
          Completar esta sección solo en caso de que la participación al evento
          requiera más de quince días de comisión de servicio.
          <br />
          Caso contrario indicar No aplica.
        </p>

        <textarea
          id="justificacionComision"
          {...register("justificacionComision", {
            required: "Este campo es requerido",
          })}
          className="form-input"
          placeholder="Escriba aquí la justificación o indique 'No aplica'."
        />
        {errors.justificacionComision && (
          <span className="error-text">
            {errors.justificacionComision.message}
          </span>
        )}
      </div>
    </div>
  );
}

export default ActivitySchedule;
