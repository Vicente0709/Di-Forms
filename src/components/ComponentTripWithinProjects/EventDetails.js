import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

function EventDetails() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  

  const participacionEvento = watch("participacionEvento"); // Escucha los cambios en la participación en el evento
  const tipoEvento = watch("tipoEvento"); // Escucha los cambios en el tipo de evento
  const [showOtherEvent, setShowOtherEvent] = useState(false);
  const fechaInicioEvento = watch('fechaInicioEvento'); 

 // Validación personalizada para la fecha de finalización
 const validateFechaFin = (fechaFin) => {
  if (!fechaInicioEvento) {
    return "Primero seleccione la fecha de inicio.";
  }
  return fechaFin >= fechaInicioEvento || "La fecha de finalización no puede ser anterior a la fecha de inicio.";
};

  // Control de campo "Otro evento académico"
  useEffect(() => {
    setShowOtherEvent(tipoEvento === "Otro evento académico");
    if (tipoEvento !== "Otro evento académico") {
      setValue("otroEventoEspecificar", ""); // Limpiar campo si no es "Otro evento académico"
    }
  }, [tipoEvento, setValue]);

  // Control del campo "Título de la Ponencia"
  const isAsistencia = participacionEvento === "Asistencia";
  useEffect(() => {
    if (isAsistencia) {
      setValue("tituloPonencia", "No aplica");
    } else if (participacionEvento) {
      setValue("tituloPonencia", "");
    }
  }, [isAsistencia, setValue, participacionEvento]);

  return (
    <div className="form-container">
      <h3>• DETALLES DEL EVENTO</h3>

      <div className="form-group">
        <label htmlFor="tituloEvento" className="form-label">
          Título del evento:
        </label>
        <input
          type="text"
          id="tituloEvento"
          {...register("tituloEvento", {
            required: "El título del evento es requerido",
          })}
          className="form-input"
        />
        {errors.tituloEvento && (
          <span className="error-text">{errors.tituloEvento.message}</span>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Lugar del evento:</label>
        <div>
          <label htmlFor="ciudadEvento" className="form-label">
            Ciudad:
          </label>
          <input
            type="text"
            id="ciudadEvento"
            {...register("ciudadEvento", {
              required: "La ciudad del evento es requerida",
            })}
            className="form-input"
          />
          {errors.ciudadEvento && (
            <span className="error-text">{errors.ciudadEvento.message}</span>
          )}
        </div>
        <div>
          <label htmlFor="paisEvento" className="form-label">
            País:
          </label>
          <input
            type="text"
            id="paisEvento"
            {...register("paisEvento", {
              required: "El país del evento es requerido",
            })}
            className="form-input"
          />
          {errors.paisEvento && (
            <span className="error-text">{errors.paisEvento.message}</span>
          )}
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Fechas del evento:</label>
        <div>
          <label htmlFor="fechaInicioEvento" className="form-label">Desde:</label>
          <input
            type="date"
            id="fechaInicioEvento"
            {...register("fechaInicioEvento", { 
              required: "La fecha de inicio es requerida",
              validate: (value) => {
                const today = new Date().toISOString().split('T')[0];
                return value >= today || "La fecha de inicio no puede ser anterior a la fecha actual.";
              }
            })}
            className="form-input"
          />
          {errors.fechaInicioEvento && <span className="error-text">{errors.fechaInicioEvento.message}</span>}
        </div>

        <div>
          <label htmlFor="fechaFinEvento" className="form-label">Hasta:</label>
          <input
            type="date"
            id="fechaFinEvento"
            {...register("fechaFinEvento", { 
              required: "La fecha de finalización es requerida",
              validate: validateFechaFin
            })}
            className="form-input"
          />
          {errors.fechaFinEvento && <span className="error-text">{errors.fechaFinEvento.message}</span>}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Tipo de evento:</label>
        <div>
          <input
            type="radio"
            id="conferencia"
            value="Conferencia o congreso"
            {...register("tipoEvento", {
              required: "El tipo de evento es requerido",
            })}
          />
          <label htmlFor="conferencia">Conferencia o congreso</label>
        </div>
        <div>
          <input
            type="radio"
            id="taller"
            value="Taller"
            {...register("tipoEvento", {
              required: "El tipo de evento es requerido",
            })}
          />
          <label htmlFor="taller">    Taller</label>
        </div>
        <div>
          <input
            type="radio"
            id="otroEvento"
            value="Otro evento académico"
            {...register("tipoEvento", {
              required: "El tipo de evento es requerido",
            })}
          />
          <label htmlFor="otroEvento">    Otro evento académico</label>
          {showOtherEvent && (
            <input
              type="text"
              id="otroEventoEspecificar"
              {...register("otroEventoEspecificar", {
                required: "Por favor especifique el otro evento académico",
              })}
              placeholder="Especifique"
              className="form-input"
            />
          )}
        </div>
        {errors.tipoEvento && (
          <span className="error-text">{errors.tipoEvento.message}</span>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Participación en el evento:</label>
        <div>
          <input
            type="radio"
            id="presentacionArticulo"
            value="Presentación de artículo indexado"
            {...register("participacionEvento", {
              required: "Seleccione una opción",
            })}
          />
          <label htmlFor="presentacionArticulo">
            Presentación de artículo indexado
          </label>
        </div>
        <div>
          <input
            type="radio"
            id="presentacionPoster"
            value="Presentación de póster, abstract, charla magistral u otros"
            {...register("participacionEvento", {
              required: "Seleccione una opción",
            })}
          />
          <label htmlFor="presentacionPoster">
            Presentación de póster, abstract, charla magistral u otros
          </label>
        </div>
        <div>
          <input
            type="radio"
            id="asistencia"
            value="Asistencia"
            {...register("participacionEvento", {
              required: "Seleccione una opción",
            })}
          />
          <label htmlFor="asistencia">Asistencia</label>
        </div>
        {errors.participacionEvento && (
          <span className="error-text">
            {errors.participacionEvento.message}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="tituloPonencia" className="form-label">
          Título de la Ponencia:
        </label>
        <input
          type="text"
          id="tituloPonencia"
          {...register("tituloPonencia", {
            required: !isAsistencia && "El título de la ponencia es requerido",
          })}
          className="form-input"
          disabled={isAsistencia}
        />
        {errors.tituloPonencia && (
          <span className="error-text">{errors.tituloPonencia.message}</span>
        )}
      </div>
      <div className="form-group">
        <label className="form-label">
          Solicita para participar en el evento:
        </label>

        {/* Pasajes aéreos */}
        <div className="sub-group">
          <label>Pasajes aéreos:</label>
          <div>
            <input
              type="radio"
              id="pasajesSi"
              value="SI"
              {...register("pasajesAereos", {
                required: "Indique si requiere pasajes aéreos",
              })}
            />
            <label htmlFor="pasajesSi">SI</label>
          </div>
          <div>
            <input
              type="radio"
              id="pasajesNo"
              value="NO"
              {...register("pasajesAereos", {
                required: "Indique si requiere pasajes aéreos",
              })}
            />
            <label htmlFor="pasajesNo">NO</label>
          </div>
          {errors.pasajesAereos && (
            <span className="error-text">{errors.pasajesAereos.message}</span>
          )}
        </div>

        {/* Viáticos y Subsistencias */}
        <div className="sub-group">
          <label>Viáticos y subsistencias:</label>
          <div>
            <input
              type="radio"
              id="viaticosSi"
              value="SI"
              {...register("viaticosSubsistencias", {
                required: "Indique si requiere viáticos y subsistencias",
              })}
            />
            <label htmlFor="viaticosSi">SI</label>
          </div>
          <div>
            <input
              type="radio"
              id="viaticosNo"
              value="NO"
              {...register("viaticosSubsistencias", {
                required: "Indique si requiere viáticos y subsistencias",
              })}
            />
            <label htmlFor="viaticosNo">NO</label>
          </div>
          {errors.viaticosSubsistencias && (
            <span className="error-text">
              {errors.viaticosSubsistencias.message}
            </span>
          )}
        </div>

        {/* Inscripción */}
        <div className="sub-group">
          <label>Inscripción:</label>
          <div>
            <input
              type="radio"
              id="inscripcionSi"
              value="SI"
              {...register("inscripcion", {
                required: "Indique si requiere inscripción",
              })}
            />
            <label htmlFor="inscripcionSi">SI</label>
          </div>
          <div>
            <input
              type="radio"
              id="inscripcionNo"
              value="NO"
              {...register("inscripcion", {
                required: "Indique si requiere inscripción",
              })}
            />
            <label htmlFor="inscripcionNo">NO</label>
          </div>
          {errors.inscripcion && (
            <span className="error-text">{errors.inscripcion.message}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
