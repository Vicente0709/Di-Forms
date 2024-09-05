import React from "react";
import { useFormContext } from "react-hook-form";

function EventDetails() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();
  

  
  const fechaInicioEvento = watch('fechaInicioEvento'); 

  const now = new Date();
const localOffset = now.getTimezoneOffset() * 60000; // Offset en milisegundos

 // Validación personalizada para la fecha de finalización
 const validateFechaFin = (fechaFin) => {
  if (!fechaInicioEvento) {
    return "Primero seleccione la fecha de inicio.";
  }
  return fechaFin >= fechaInicioEvento || "La fecha de finalización no puede ser anterior a la fecha de inicio.";
};


  return (
    <div className="form-container">
      <h3>• Detalles del Viaje Tecnico</h3>
      <div className="form-group">
        <label htmlFor="nombreIntitucionAcogida" className="form-label">
        Nombre de la institución de acogida:
        </label>
        <input
          type="text"
          id="nombreIntitucionAcogida"
          {...register("nombreInstitucionAcogida", {
            required: "El título del evento es requerido",
          })}
          className="form-input"
        />
        {errors.nombreIntitucionAcogida && (
          <span className="error-text">{errors.nombreIntitucionAcogida.message}</span>
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
              const today = new Date(now.getTime() - localOffset).toISOString().split('T')[0];
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

        
      </div>
    </div>
  );
}

export default EventDetails;
