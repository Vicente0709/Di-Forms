import React, { useEffect } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";

function Transportation() {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext();

 const { fields: fieldsIda, append: appendIda, remove: removeIda } = useFieldArray({
  control,
  name: "transporteIda",
  });
  const { fields: fieldsRegreso, append: appendRegreso, remove: removeRegreso } = useFieldArray({
  control,
  name: "transporteRegreso",
  });
  
  const today = new Date().toISOString().split("T")[0]; // Fecha actual en formato YYYY-MM-DD
  // Observar los cambios en la fecha fin del evento
  const fechaFinEvento = watch("fechaFinEvento");
  const fechaInicioEvento = watch("fechaInicioEvento");
  // validacion para que la fecha de retorno sea como maximo un dia mas de la fecha de fin del evento
  const validateFechaSalidaRegreso = (value) => {
    if (fechaFinEvento) {
      const fechaFin = new Date(fechaFinEvento);
      const fechaSalida = new Date(value);

      // Sumar un día a la fecha de fin del evento
      fechaFin.setDate(fechaFin.getDate() + 1);

      // Comparar fechas
      if (fechaSalida > fechaFin) {
        return "La fecha de retorno como máximo un día después del evento.";
      }
    }
    return true;
  };

  const validateFechaLlegadaIda = (value) => {
    if (fechaInicioEvento) {
      const fechaInicio = new Date(fechaInicioEvento);
      const fechaLlegada = new Date(value);
      
  
      // Sumar un día a la fecha de fin del evento
      fechaInicio.setDate(fechaInicio.getDate() - 1);
  
      // Comparar fechas
      if (fechaLlegada < fechaInicio) {
        return "La fecha de llegada como máximo un día antes del evento.";
      }
    }
    return true;
   };
  // Agregar una fila vacía al cargar el componente
  
  useEffect(() => {
    const initialTransporte = {
      tipoTransporte: "Aéreo",
      nombreTransporte: "",
      ruta: "",
      fechaSalida: "",
      horaSalida: "",
      fechaLlegada: "",
      horaLlegada: "",
    };
    if (fieldsIda.length === 0) {
      appendIda(initialTransporte);
    }
    if (fieldsRegreso.length === 0) {
      appendRegreso(initialTransporte);
    }
  }, [appendIda, appendRegreso, fieldsIda.length, fieldsRegreso.lengt, fieldsRegreso.length]);

  return (
    <div className="form-container">
      <h3>• TRANSPORTE</h3>
      <h5>TRANSPORTE DE IDA
      </h5>
      <p>
        Para el ingreso de itinerario de viaje, considere que se puede llegar al destino máximo un día antes del inicio del evento.
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
          {fieldsIda.map((field, index) => {
            const fechaSalida = watch(`transporteIda[${index}].fechaSalida`);
            const fechaLlegadaAnterior = watch(`transporteIda[${index - 1}].fechaLlegada`);
            return (
              <tr key={field.id}>
                <td>
                  <select
                    id={`tipoTransporte-${index}`}
                    className="form-input"
                    defaultValue="Aéreo"
                    {...register(`transporteIda[${index}].tipoTransporte`, {
                      required: "Este campo es requerido",
                    })}
                  >
                    <option value="Aéreo">Aéreo</option>
                    <option value="Terrestre">Terrestre</option>
                    <option value="Marítimo">Marítimo</option>
                    <option value="Otros">Otros</option>
                  </select>
                  {errors.transporteIda &&
                    errors.transporteIda[index]?.tipoTransporte && (
                      <span className="error-text">
                        {errors.transporteIda[index].tipoTransporte.message}
                      </span>
                    )}
                </td>
                <td>
                  <input
                    type="text"
                    id={`nombreTransporte-${index}`}
                    className="form-input"
                    {...register(`transporteIda[${index}].nombreTransporte`, {
                      required: "Este campo es requerido",
                    })}
                  />
                  {errors.transporteIda &&
                    errors.transporteIda[index]?.nombreTransporte && (
                      <span className="error-text">
                        {errors.transporteIda[index].nombreTransporte.message}
                      </span>
                    )}
                </td>
                <td>
                  <input
                    type="text"
                    id={`ruta-${index}`}
                    placeholder="Quito-Lima"
                    className="form-input"
                    {...register(`transporteIda[${index}].ruta`, {
                      required: "Este campo es requerido",
                    })}
                  />
                  {errors.transporteIda && errors.transporteIda[index]?.ruta && (
                    <span className="error-text">
                      {errors.transporteIda[index].ruta.message}
                    </span>
                  )}
                </td>
                <td>
                  <input
                    type="date"
                    id={`fechaSalida-${index}`}
                    className="form-input"
                    {...register(`transporteIda[${index}].fechaSalida`, {
                      required: "Este campo es requerido",
                      validate: {
                        noPastDate: value => value >= today || "La fecha no puede ser menor a la fecha actual",
                        validSequence: value =>
                          !fechaLlegadaAnterior || value >= fechaLlegadaAnterior || "La fecha de salida debe ser posterior a la fecha de llegada anterior"
                      }
                    })}
                  />
                  {errors.transporteIda && errors.transporteIda[index]?.fechaSalida && (
                    <span className="error-text">
                      {errors.transporteIda[index].fechaSalida.message}
                    </span>
                  )}
                </td>
                <td>
                  <input
                    type="time"
                    id={`horaSalida-${index}`}
                    className="form-input"
                    {...register(`transporteIda[${index}].horaSalida`, {
                      required: "Este campo es requerido",
                    })}
                  />
                  {errors.transporteIda && errors.transporteIda[index]?.horaSalida && (
                    <span className="error-text">
                      {errors.transporteIda[index].horaSalida.message}
                    </span>
                  )}
                </td>
                <td>
                  <input
                    type="date"
                    id={`fechaLlegada-${index}`}
                    className="form-input"
                    {...register(`transporteIda[${index}].fechaLlegada`, {
                      required: "Este campo es requerido",
                      validate: {
                        noPastDate: value => value >= today || "La fecha no puede ser menor a la fecha actual",
                        afterSalida: value => value >= fechaSalida || "La fecha de llegada debe ser posterior o igual a la fecha de salida",
                        ...(index === fieldsIda.length - 1 ? { validateFechaLlegadaIda } : {})
                      }
                    })}
                  />
                  {errors.transporteIda && errors.transporteIda[index]?.fechaLlegada && (
                    <span className="error-text">
                      {errors.transporteIda[index].fechaLlegada.message}
                    </span>
                  )}
                </td>
                <td>
                  <input
                    type="time"
                    id={`horaLlegada-${index}`}
                    className="form-input"
                    {...register(`transporteIda[${index}].horaLlegada`, {
                      required: "Este campo es requerido",
                    })}
                  />
                  {errors.transporteIda && errors.transporteIda[index]?.horaLlegada && (
                    <span className="error-text">
                      {errors.transporteIda[index].horaLlegada.message}
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
          appendIda({
            tipoTransporte: "Aéreo",
            nombreTransporte: "",
            ruta: "",
            fechaSalida: "",
            horaSalida: "",
            fechaLlegada: "",
            horaLlegada: "",
          });
        }}
        className="add-transport-button"
      >
        Agregar
      </button>
    
      <h5>TRANSPORTE DE REGRESO</h5>
      <p>
        El retorno puede ser máximo un día después de la finalización del evento.
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
            const fechaSalida = watch(`transporteRegreso[${index}].fechaSalida`);
            const fechaLlegadaAnterior = watch(`transporteRegreso[${index - 1}].fechaLlegada`);
            return (
              <tr key={field.id}>
                <td>
                  <select
                    id={`tipoTransporte-${index}`}
                    className="form-input"
                    defaultValue="Aéreo"
                    {...register(`transporteRegreso[${index}].tipoTransporte`, {
                      required: "Este campo es requerido",
                    })}
                  >
                    <option value="Aéreo">Aéreo</option>
                    <option value="Terrestre">Terrestre</option>
                    <option value="Marítimo">Marítimo</option>
                    <option value="Otros">Otros</option>
                  </select>
                  {errors.transporteRegreso &&
                    errors.transporteRegreso[index]?.tipoTransporte && (
                      <span className="error-text">
                        {errors.transporteRegreso[index].tipoTransporte.message}
                      </span>
                    )}
                </td>
                <td>
                  <input
                    type="text"
                    id={`nombreTransporte-${index}`}
                    className="form-input"
                    {...register(`transporteRegreso[${index}].nombreTransporte`, {
                      required: "Este campo es requerido",
                    })}
                  />
                  {errors.transporteRegreso &&
                    errors.transporteRegreso[index]?.nombreTransporte && (
                      <span className="error-text">
                        {errors.transporteRegreso[index].nombreTransporte.message}
                      </span>
                    )}
                </td>
                <td>
                  <input
                    type="text"
                    id={`ruta-${index}`}
                    placeholder="Quito-Lima"
                    className="form-input"
                    {...register(`transporteRegreso[${index}].ruta`, {
                      required: "Este campo es requerido",
                    })}
                  />
                  {errors.transporteRegreso && errors.transporteRegreso[index]?.ruta && (
                    <span className="error-text">
                      {errors.transporteRegreso[index].ruta.message}
                    </span>
                  )}
                </td>
                <td>
                  <input
                    type="date"
                    id={`fechaSalida-${index}`}
                    className="form-input"
                    {...register(`transporteRegreso[${index}].fechaSalida`, {
                      required: "Este campo es requerido",
                      validate: {
                        noPastDate: value => value >= today || "La fecha no puede ser menor a la fecha actual",
                        validSequence: value =>
                          !fechaLlegadaAnterior || value >= fechaLlegadaAnterior || "La fecha de salida debe ser posterior a la fecha de llegada anterior",
                        ...(index === 0 && { validateFechaSalidaRegreso }),
                      }
                    })}
                  />
                  {errors.transporteRegreso && errors.transporteRegreso[index]?.fechaSalida && (
                    <span className="error-text">
                      {errors.transporteRegreso[index].fechaSalida.message}
                    </span>
                  )}
                </td>
                <td>
                  <input
                    type="time"
                    id={`horaSalida-${index}`}
                    className="form-input"
                    {...register(`transporteRegreso[${index}].horaSalida`, {
                      required: "Este campo es requerido",
                    })}
                  />
                  {errors.transporteRegreso && errors.transporteRegreso[index]?.horaSalida && (
                    <span className="error-text">
                      {errors.transporteRegreso[index].horaSalida.message}
                    </span>
                  )}
                </td>
                <td>
                  <input
                    type="date"
                    id={`fechaLlegada-${index}`}
                    className="form-input"
                    {...register(`transporteRegreso[${index}].fechaLlegada`, {
                      required: "Este campo es requerido",
                      validate: {
                        noPastDate: value => value >= today || "La fecha no puede ser menor a la fecha actual",
                        afterSalida: value => value >= fechaSalida || "La fecha de llegada debe ser posterior o igual a la fecha de salida"
                      }
                    })}
                  />
                  {errors.transporteRegreso && errors.transporteRegreso[index]?.fechaLlegada && (
                    <span className="error-text">
                      {errors.transporteRegreso[index].fechaLlegada.message}
                    </span>
                  )}
                </td>
                <td>
                  <input
                    type="time"
                    id={`horaLlegada-${index}`}
                    className="form-input"
                    {...register(`transporteRegreso[${index}].horaLlegada`, {
                      required: "Este campo es requerido",
                    })}
                  />
                  {errors.transporteRegreso && errors.transporteRegreso[index]?.horaLlegada && (
                    <span className="error-text">
                      {errors.transporteRegreso[index].horaLlegada.message}
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
          appendRegreso({
            tipoTransporte: "Aéreo",
            nombreTransporte: "",
            ruta: "",
            fechaSalida: "",
            horaSalida: "",
            fechaLlegada: "",
            horaLlegada: "",
          });
        }}
        className="add-transport-button"
      >
        Agregar
      </button>
    </div>
  );
}

export default Transportation;