import React, { useState, useEffect } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";

function ActivitySchedule() {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const { fields: immutableFields, replace } = useFieldArray({
    control,
    name: "actividadesInmutables",
  });

  // Estados para almacenar las fechas de inicio y fin del evento
  const [fechaInicioEvento, setFechaInicioEvento] = useState("");
  const [fechaFinEvento, setFechaFinEvento] = useState("");
  const [diferenciaDias, setDiferenciaDias] = useState(0); // Inicializar en 0

  // Efecto para cargar y actualizar las fechas desde localStorage
  useEffect(() => {
    const updateDatesFromLocalStorage = () => {
      const formNationalWithinProjects = JSON.parse(
        localStorage.getItem("formNationalWithinProjects")
      );

      if (formNationalWithinProjects) {
        // Obtener la primera fecha de salida desde transporteIda
        const fechaInicioEvento =
          formNationalWithinProjects.transporteIda?.length > 0
            ? formNationalWithinProjects.transporteIda[0]?.fechaSalida
            : "";

        // Obtener la última fecha de llegada desde transporteRegreso
        const fechaFinEvento =
          formNationalWithinProjects.transporteRegreso?.length > 0
            ? formNationalWithinProjects.transporteRegreso[
                formNationalWithinProjects.transporteRegreso.length - 1
              ]?.fechaLlegada
            : "";

        setFechaInicioEvento(fechaInicioEvento || "");
        setFechaFinEvento(fechaFinEvento || "");

        // Cálculo de diferencia de días
        if (fechaInicioEvento && fechaFinEvento) {
          const diffTime = new Date(fechaFinEvento) - new Date(fechaInicioEvento);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          setDiferenciaDias(diffDays+1);
          localStorage.setItem("diferenciaDias", JSON.stringify({ diferencia: diffDays +1}));
        }
      }
    };

    // Llamar la función al montar el componente
    updateDatesFromLocalStorage();

    // Configurar un intervalo para revisar cambios en localStorage
    const intervalId = setInterval(updateDatesFromLocalStorage, 1000);

    // Limpiar el intervalo al desmontar el componente
    return () => clearInterval(intervalId);
  }, []);
  const [showInputJustificacion, setshowInputJustificacion] = useState(false);
  const [showActivity, setShowActivity] = useState(false); // Cambiar a false inicialmente

  // Controlar la visibilidad de showActivity y showInputJustificacion según diferenciaDias
  useEffect(() => {
    if (diferenciaDias > 15) {
      setShowActivity(true);
      setshowInputJustificacion(true);
      setValue("justificacionComision", "");
    } else {
      setValue("justificacionComision", "No Aplica"); // Limpia el campo si la diferencia es 15 días o menos
      setshowInputJustificacion(false);
      setShowActivity(false);
    }
  }, [diferenciaDias, setValue]); // Asegúrate de incluir diferenciaDias como dependencia


  // Actualiza las fechas inmutables cuando cambian las fechas de inicio o fin
  useEffect(() => {
    if (fechaInicioEvento && fechaFinEvento) {
      const dates = generateDateRange(fechaInicioEvento, fechaFinEvento);
      const newFields = dates.map((date) => ({
        fecha: date,
        descripcion: "",
      }));
      replace(newFields); // Reemplaza las actividades inmutables con las nuevas fechas
    }
  }, [fechaInicioEvento, fechaFinEvento, replace]);

  return (
    <div>
      {showActivity && (
        <div>
          <h3>• CRONOGRAMA DE ACTIVIDADES</h3>
          <p className="instruction-text">
            Incluir desde la fecha de salida del país y días de traslado hasta
            el día de llegada al destino.
            <br />
            Hasta incluir la fecha de llegada al país.
          </p>

          {/* Tabla de actividades inmutables */}
          <h4>Fechas del Evento</h4>
          <table className="activity-schedule-table">
            <thead>
              <tr>
                <th>Nro.</th>
                <th>Fecha</th>
                <th>Descripción de la Actividad a Realizar</th>
              </tr>
            </thead>
            <tbody>
              {immutableFields.map((field, index) => (
                <tr key={field.id}>
                  <td>
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
                      id={`fechaInmutable-${index}`}
                      className="form-input"
                      {...register(`actividadesInmutables[${index}].fecha`, {
                        required: "Este campo es requerido",
                      })}
                      readOnly // Campo de fecha de solo lectura
                    />
                    {errors.actividadesInmutables &&
                      errors.actividadesInmutables[index]?.fecha && (
                        <span className="error-text">
                          {errors.actividadesInmutables[index].fecha.message}
                        </span>
                      )}
                  </td>
                  <td>
                    <input
                      type="text"
                      id={`descripcionInmutable-${index}`}
                      className="form-input"
                      {...register(
                        `actividadesInmutables[${index}].descripcion`,
                        {
                          required: "Este campo es requerido",
                        }
                      )}
                      placeholder="Describe la actividad a realizar"
                    />
                    {errors.actividadesInmutables &&
                      errors.actividadesInmutables[index]?.descripcion && (
                        <span className="error-text">
                          {
                            errors.actividadesInmutables[index].descripcion
                              .message
                          }
                        </span>
                      )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {showInputJustificacion && (
            <div>
              <h3>
                Justificar la necesidad de la comisión de servicios mayor a 15
                días
              </h3>
              <p className="instruction-text">
                Completar esta sección solo en caso de que la participación al
                evento requiera más de quince días de comisión de servicio.
                <br />
              </p>

              <textarea
                id="justificacionComision"
                {...register("justificacionComision", {
                  required: "Este campo es requerido",
                })}
                className="form-input"
                placeholder="Escriba aquí la justificación."
              />
              {errors.justificacionComision && (
                <span className="error-text">
                  {errors.justificacionComision.message}
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Función para generar un rango de fechas entre dos fechas
function generateDateRange(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dateArray = [];
  let currentDate = start;

  while (currentDate <= end) {
    dateArray.push(currentDate.toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dateArray;
}

export default ActivitySchedule;
