import React, { useState, useEffect } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";

function ActivitySchedule() {
  const { register, control, formState: { errors } } = useFormContext();
  const { fields: immutableFields, replace } = useFieldArray({
    control,
    name: "actividadesInmutables",
  });

  // Estados para almacenar las fechas de inicio y fin del evento
  const [fechaInicioEvento, setFechaInicioEvento] = useState("");
  const [fechaFinEvento, setFechaFinEvento] = useState("");

  // Efecto para cargar y actualizar las fechas desde localStorage
  useEffect(() => {
    const updateDatesFromLocalStorage = () => {
      const formTechnicalTripWithinProjects = JSON.parse(localStorage.getItem("formTechnicalTripWithinProjects"));
      if (formTechnicalTripWithinProjects) {
        // Obtener la primera fecha de salida desde transporteIda
        const fechaInicioEvento = formTechnicalTripWithinProjects.transporteIda?.length > 0 
          ? formTechnicalTripWithinProjects.transporteIda[0]?.fechaSalida 
          : "";
    
        // Obtener la última fecha de llegada desde transporteRegreso
        const fechaFinEvento = formTechnicalTripWithinProjects.transporteRegreso?.length > 0 
          ? formTechnicalTripWithinProjects.transporteRegreso[formTechnicalTripWithinProjects.transporteRegreso.length - 1]?.fechaLlegada 
          : "";
    
        // Actualizar los estados correspondientes
        setFechaInicioEvento(fechaInicioEvento || "");
        setFechaFinEvento(fechaFinEvento || "");
      }
      
    };

    // Llamar la función al montar el componente
    updateDatesFromLocalStorage();

    // Configurar un intervalo para revisar cambios en localStorage
    const intervalId = setInterval(updateDatesFromLocalStorage, 1000); // Cada 1 segundo

    // Limpiar el intervalo al desmontar el componente
    return () => clearInterval(intervalId);
  }, []);

  // Actualiza las fechas inmutables cuando cambian las fechas de inicio o fin
  useEffect(() => {
    if (fechaInicioEvento && fechaFinEvento) {
      const dates = generateDateRange(fechaInicioEvento, fechaFinEvento);
      const newFields = dates.map(date => ({
        fecha: date,
        descripcion: ""
      }));
      replace(newFields); // Reemplaza las actividades inmutables con las nuevas fechas
    }
  }, [fechaInicioEvento, fechaFinEvento, replace]);

  return (
    <div className="form-container">
      <h3>• CRONOGRAMA DE ACTIVIDADES</h3>
      <p className="instruction-text">
        Incluir desde la fecha de salida del país y días de traslado hasta el día de llegada al destino.
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
                  {...register(`actividadesInmutables[${index}].fecha`, { required: "Este campo es requerido" })}
                  readOnly // Campo de fecha de solo lectura
                />
                {errors.actividadesInmutables && errors.actividadesInmutables[index]?.fecha && (
                  <span className="error-text">{errors.actividadesInmutables[index].fecha.message}</span>
                )}
              </td>
              <td>
                <input
                  type="text"
                  id={`descripcionInmutable-${index}`}
                  className="form-input"
                  {...register(`actividadesInmutables[${index}].descripcion`, { required: "Este campo es requerido" })}
                  placeholder="Describe la actividad a realizar"
                />
                {errors.actividadesInmutables && errors.actividadesInmutables[index]?.descripcion && (
                  <span className="error-text">{errors.actividadesInmutables[index].descripcion.message}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Sección para justificar la comisión mayor a 15 días */}
      <div className="form-container">
        <h3>Justificar la necesidad de la comisión de servicios mayor a 15 días</h3>
        <p className="instruction-text">
          Completar esta sección solo en caso de que la participación al evento requiera más de quince días de comisión de servicio.
          <br />
        </p>
        
        <textarea
          id="justificacionComision"
          {...register("justificacionComision", { required: "Este campo es requerido" })}
          className="form-input"
          placeholder="Escriba aquí la justificación."
        />
        {errors.justificacionComision && (
          <span className="error-text">{errors.justificacionComision.message}</span>
        )}
      </div>
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