import React, { useEffect } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";

function Transportation({
  transporteIdaName = "transporteIda",
  transporteRegresoName = "transporteRegreso",
  initialTransporte = {
    tipoTransporte: "Aéreo",
    nombreTransporte: "",
    ruta: "",
    fechaSalida: "",
    horaSalida: "",
    fechaLlegada: "",
    horaLlegada: "",
  },
  validateFechaSalidaRegreso,
  validateFechaLlegadaIda,
  today,
}) {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext();

  // Usar useFieldArray para ambos campos (ida y regreso) basados en los props
  const {
    fields: fieldsIda,
    append: appendIda,
    remove: removeIda,
  } = useFieldArray({
    control,
    name: transporteIdaName,
  });
  const {
    fields: fieldsRegreso,
    append: appendRegreso,
    remove: removeRegreso,
  } = useFieldArray({
    control,
    name: transporteRegresoName,
  });

  // Fechas del evento
  const fechaFinEvento = watch("fechaFinEvento");
  const fechaInicioEvento = watch("fechaInicioEvento");

  // Inicializar los campos de transporte si están vacíos
  useEffect(() => {
    if (fieldsIda.length === 0) {
      appendIda(initialTransporte);
    }
    if (fieldsRegreso.length === 0) {
      appendRegreso(initialTransporte);
    }
  }, [appendIda, appendRegreso, fieldsIda.length, fieldsRegreso.length]);

  return (
    <div>
      <h3>• TRANSPORTE</h3>
      <h5>TRANSPORTE DE IDA</h5>
      <p>Instrucciones sobre la ida...</p>
      <table className="activity-schedule-table">
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
          {fieldsIda.map((field, index) => {
            const fechaSalida = watch(
              `${transporteIdaName}[${index}].fechaSalida`
            );
            const fechaLlegadaAnterior = watch(
              `${transporteIdaName}[${index - 1}].fechaLlegada`
            );
            return (
              <tr key={field.id}>
                <td>
                  <select
                    {...register(
                      `${transporteIdaName}[${index}].tipoTransporte`,
                      {
                        required: "Este campo es requerido",
                      }
                    )}
                    defaultValue={field.tipoTransporte}
                  >
                    <option value="Aéreo">Aéreo</option>
                    <option value="Terrestre">Terrestre</option>
                    <option value="Marítimo">Marítimo</option>
                    <option value="Otros">Otros</option>
                  </select>
                  {errors[transporteIdaName]?.[index]?.tipoTransporte && (
                    <span className="error-text">
                      {errors[transporteIdaName][index].tipoTransporte.message}
                    </span>
                  )}
                </td>
                <td>
                  <input
                    type="text"
                    {...register(
                      `${transporteIdaName}[${index}].nombreTransporte`,
                      {
                        required: "Este campo es requerido",
                      }
                    )}
                    defaultValue={field.nombreTransporte}
                  />
                  {errors[transporteIdaName]?.[index]?.nombreTransporte && (
                    <span className="error-text">
                      {
                        errors[transporteIdaName][index].nombreTransporte
                          .message
                      }
                    </span>
                  )}
                </td>
                <td>
                  <input
                    type="text"
                    {...register(`${transporteIdaName}[${index}].ruta`, {
                      required: "Este campo es requerido",
                    })}
                    defaultValue={field.ruta}
                  />
                  {errors[transporteIdaName]?.[index]?.ruta && (
                    <span className="error-text">
                      {errors[transporteIdaName][index].ruta.message}
                    </span>
                  )}
                </td>
                <td>
                  <input
                    type="date"
                    {...register(`${transporteIdaName}[${index}].fechaSalida`, {
                      required: "Este campo es requerido",
                      validate: {
                        noPastDate: (value) =>
                          value >= today ||
                          "La fecha no puede ser menor a la fecha actual",
                        validSequence: (value) =>
                          !fechaLlegadaAnterior ||
                          value >= fechaLlegadaAnterior ||
                          "La fecha de salida debe ser posterior a la fecha de llegada anterior",
                      },
                    })}
                    defaultValue={field.fechaSalida}
                  />
                  {errors[transporteIdaName]?.[index]?.fechaSalida && (
                    <span className="error-text">
                      {errors[transporteIdaName][index].fechaSalida.message}
                    </span>
                  )}
                </td>
                <td>
                  <input
                    type="time"
                    {...register(`${transporteIdaName}[${index}].horaSalida`, {
                      required: "Este campo es requerido",
                    })}
                    defaultValue={field.horaSalida}
                  />
                  {errors[transporteIdaName]?.[index]?.horaSalida && (
                    <span className="error-text">
                      {errors[transporteIdaName][index].horaSalida.message}
                    </span>
                  )}
                </td>
                <td>
                  <input
                    type="date"
                    {...register(
                      `${transporteIdaName}[${index}].fechaLlegada`,
                      {
                        required: "Este campo es requerido",
                        validate: {
                          noPastDate: (value) =>
                            value >= today ||
                            "La fecha no puede ser menor a la fecha actual",
                          afterSalida: (value) =>
                            value >= fechaSalida ||
                            "La fecha de llegada debe ser posterior o igual a la fecha de salida",
                          ...(index === fieldsIda.length - 1 && {
                            validateFechaLlegadaIda,
                          }),
                        },
                      }
                    )}
                    defaultValue={field.fechaLlegada}
                  />
                  {errors[transporteIdaName]?.[index]?.fechaLlegada && (
                    <span className="error-text">
                      {errors[transporteIdaName][index].fechaLlegada.message}
                    </span>
                  )}
                </td>
                <td>
                  <input
                    type="time"
                    {...register(`${transporteIdaName}[${index}].horaLlegada`, {
                      required: "Este campo es requerido",
                    })}
                    defaultValue={field.horaLlegada}
                  />
                  {errors[transporteIdaName]?.[index]?.horaLlegada && (
                    <span className="error-text">
                      {errors[transporteIdaName][index].horaLlegada.message}
                    </span>
                  )}
                </td>
                <td>
                  <button type="button" onClick={() => removeIda(index)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <button
        type="button"
        onClick={() => {
          appendIda(initialTransporte);
        }}
        className="add-transport-button"
      >
        Agregar
      </button>

      <h5>TRANSPORTE DE REGRESO</h5>
      <p>
        El retorno puede ser máximo un día después de la finalización del
        evento.
      </p>
      <table className="activity-schedule-table">
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
          {fieldsRegreso.map((field, index) => {
            const fechaSalida = watch(
              `${transporteRegresoName}[${index}].fechaSalida`
            );
            const fechaLlegadaAnterior = watch(
              `${transporteRegresoName}[${index - 1}].fechaLlegada`
            );
            return (
              <tr key={field.id}>
                <td>
                  <select
                    {...register(
                      `${transporteRegresoName}[${index}].tipoTransporte`,
                      {
                        required: "Este campo es requerido",
                      }
                    )}
                    defaultValue={field.tipoTransporte}
                  >
                    <option value="Aéreo">Aéreo</option>
                    <option value="Terrestre">Terrestre</option>
                    <option value="Marítimo">Marítimo</option>
                    <option value="Otros">Otros</option>
                  </select>
                  {errors[transporteRegresoName]?.[index]?.tipoTransporte && (
                    <span className="error-text">
                      {
                        errors[transporteRegresoName][index].tipoTransporte
                          .message
                      }
                    </span>
                  )}
                </td>
                <td>
                  <input
                    type="text"
                    {...register(
                      `${transporteRegresoName}[${index}].nombreTransporte`,
                      {
                        required: "Este campo es requerido",
                      }
                    )}
                    defaultValue={field.nombreTransporte}
                  />
                  {errors[transporteRegresoName]?.[index]?.nombreTransporte && (
                    <span className="error-text">
                      {
                        errors[transporteRegresoName][index].nombreTransporte
                          .message
                      }
                    </span>
                  )}
                </td>
                <td>
                  <input
                    type="text"
                    {...register(`${transporteRegresoName}[${index}].ruta`, {
                      required: "Este campo es requerido",
                    })}
                    defaultValue={field.ruta}
                  />
                  {errors[transporteRegresoName]?.[index]?.ruta && (
                    <span className="error-text">
                      {errors[transporteRegresoName][index].ruta.message}
                    </span>
                  )}
                </td>
                <td>
                  <input
                    type="date"
                    {...register(
                      `${transporteRegresoName}[${index}].fechaSalida`,
                      {
                        required: "Este campo es requerido",
                        validate: {
                          noPastDate: (value) =>
                            value >= today ||
                            "La fecha no puede ser menor a la fecha actual",
                          validSequence: (value) =>
                            !fechaLlegadaAnterior ||
                            value >= fechaLlegadaAnterior ||
                            "La fecha de salida debe ser posterior a la fecha de llegada anterior",
                          ...(index === 0 && { validateFechaSalidaRegreso }),
                        },
                      }
                    )}
                    defaultValue={field.fechaSalida}
                  />
                  {errors[transporteRegresoName]?.[index]?.fechaSalida && (
                    <span className="error-text">
                      {errors[transporteRegresoName][index].fechaSalida.message}
                    </span>
                  )}
                </td>
                <td>
                  <input
                    type="time"
                    {...register(
                      `${transporteRegresoName}[${index}].horaSalida`,
                      {
                        required: "Este campo es requerido",
                      }
                    )}
                    defaultValue={field.horaSalida}
                  />
                  {errors[transporteRegresoName]?.[index]?.horaSalida && (
                    <span className="error-text">
                      {errors[transporteRegresoName][index].horaSalida.message}
                    </span>
                  )}
                </td>
                <td>
                  <input
                    type="date"
                    {...register(
                      `${transporteRegresoName}[${index}].fechaLlegada`,
                      {
                        required: "Este campo es requerido",
                        validate: {
                          noPastDate: (value) =>
                            value >= today ||
                            "La fecha no puede ser menor a la fecha actual",
                          afterSalida: (value) =>
                            value >= fechaSalida ||
                            "La fecha de llegada debe ser posterior o igual a la fecha de salida",
                        },
                      }
                    )}
                    defaultValue={field.fechaLlegada}
                  />
                  {errors[transporteRegresoName]?.[index]?.fechaLlegada && (
                    <span className="error-text">
                      {
                        errors[transporteRegresoName][index].fechaLlegada
                          .message
                      }
                    </span>
                  )}
                </td>
                <td>
                  <input
                    type="time"
                    {...register(
                      `${transporteRegresoName}[${index}].horaLlegada`,
                      {
                        required: "Este campo es requerido",
                      }
                    )}
                    defaultValue={field.horaLlegada}
                  />
                  {errors[transporteRegresoName]?.[index]?.horaLlegada && (
                    <span className="error-text">
                      {errors[transporteRegresoName][index].horaLlegada.message}
                    </span>
                  )}
                </td>
                <td>
                  <button type="button" onClick={() => removeRegreso(index)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <button
        type="button"
        onClick={() => {
          appendRegreso(initialTransporte);
        }}
        className="add-transport-button"
      >
        Agregar
      </button>
    </div>
  );
}

export default Transportation;
