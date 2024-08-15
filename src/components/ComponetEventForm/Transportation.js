import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";

function Transportation() {
  const { register, control, formState: { errors } } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "transporte",
  });

  return (
    <div className="form-container">
      <h3>7. TRANSPORTE</h3>

      <table className="transport-table">
        <thead>
          <tr>
            <th>Tipo de Transporte</th>
            <th>Nombre de Transporte</th>
            <th>Ruta</th>
            <th>Fecha de Salida</th>
            <th>Hora de Salida</th>
            <th>Fecha de Llegada</th>
            <th>Hora de Llegada</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {fields.map((field, index) => (
            <tr key={field.id}>
              <td>
                <input
                  type="text"
                  id={`tipoTransporte-${index}`}
                  className="form-input"
                  {...register(`transporte[${index}].tipoTransporte`, { required: "Este campo es requerido" })}
                />
                {errors.transporte && errors.transporte[index]?.tipoTransporte && (
                  <span className="error-text">{errors.transporte[index].tipoTransporte.message}</span>
                )}
              </td>
              <td>
                <input
                  type="text"
                  id={`nombreTransporte-${index}`}
                  className="form-input"
                  {...register(`transporte[${index}].nombreTransporte`, { required: "Este campo es requerido" })}
                />
                {errors.transporte && errors.transporte[index]?.nombreTransporte && (
                  <span className="error-text">{errors.transporte[index].nombreTransporte.message}</span>
                )}
              </td>
              <td>
                <input
                  type="text"
                  id={`ruta-${index}`}
                  className="form-input"
                  {...register(`transporte[${index}].ruta`, { required: "Este campo es requerido" })}
                />
                {errors.transporte && errors.transporte[index]?.ruta && (
                  <span className="error-text">{errors.transporte[index].ruta.message}</span>
                )}
              </td>
              <td>
                <input
                  type="date"
                  id={`fechaSalida-${index}`}
                  className="form-input"
                  {...register(`transporte[${index}].fechaSalida`, { required: "Este campo es requerido" })}
                />
                {errors.transporte && errors.transporte[index]?.fechaSalida && (
                  <span className="error-text">{errors.transporte[index].fechaSalida.message}</span>
                )}
              </td>
              <td>
                <input
                  type="time"
                  id={`horaSalida-${index}`}
                  className="form-input"
                  {...register(`transporte[${index}].horaSalida`, { required: "Este campo es requerido" })}
                />
                {errors.transporte && errors.transporte[index]?.horaSalida && (
                  <span className="error-text">{errors.transporte[index].horaSalida.message}</span>
                )}
              </td>
              <td>
                <input
                  type="date"
                  id={`fechaLlegada-${index}`}
                  className="form-input"
                  {...register(`transporte[${index}].fechaLlegada`, { required: "Este campo es requerido" })}
                />
                {errors.transporte && errors.transporte[index]?.fechaLlegada && (
                  <span className="error-text">{errors.transporte[index].fechaLlegada.message}</span>
                )}
              </td>
              <td>
                <input
                  type="time"
                  id={`horaLlegada-${index}`}
                  className="form-input"
                  {...register(`transporte[${index}].horaLlegada`, { required: "Este campo es requerido" })}
                />
                {errors.transporte && errors.transporte[index]?.horaLlegada && (
                  <span className="error-text">{errors.transporte[index].horaLlegada.message}</span>
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

      <button type="button" onClick={() => append({
        tipoTransporte: "",
        nombreTransporte: "",
        ruta: "",
        fechaSalida: "",
        horaSalida: "",
        fechaLlegada: "",
        horaLlegada: ""
      })} className="add-transport-button">
        Agregar
      </button>
    </div>
  );
}

export default Transportation;