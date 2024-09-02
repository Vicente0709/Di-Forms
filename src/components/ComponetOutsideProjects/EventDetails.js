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
  const [showInputArticulo, setshowInputArticulo] = useState(false);
  const seleccionArticulo = watch ("articuloPublicado");
  const fechaInicioEvento = watch('fechaInicioEvento'); 


 // Validación personalizada para la fecha de finalización
 const validateFechaFin = (fechaFin) => {
  if (!fechaInicioEvento) {
    return "Primero seleccione la fecha de inicio.";
  }
  return fechaFin >= fechaInicioEvento || "La fecha de finalización no puede ser anterior a la fecha de inicio.";
};



 
  // Control del campo "Título de la Ponencia"
  const isAsistencia = participacionEvento === "Asistencia";
  useEffect(() => {

    setshowInputArticulo (seleccionArticulo === "SI");
    if (seleccionArticulo==="NO"){
        setValue ("detalleArticuloSI","");
    }
   
    if (isAsistencia) {
      setValue("tituloPonencia", "No aplica");
    } else if (participacionEvento) {
      setValue("tituloPonencia", "");
    }
  }, [isAsistencia, setValue, participacionEvento, seleccionArticulo]);

  
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
        <label htmlFor="RelevanciaAcademica" className="form-label">
          Relevancia Académica del evento:
        </label>
        <input
          type="text"
          id="RelevanciaAcademica"
          {...register("RelevanciaAcademica", {
            required: !isAsistencia && "La relevancia académica del evento es requerido",
          })}
          className="form-input"
          disabled={isAsistencia}
        />
        {errors.RelevanciaAcademica && (
          <span className="error-text">{errors.RelevanciaAcademica.message}</span>
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
        <label htmlFor="tipoPonencia" className="form-label">
          Tipo de Ponencia:
        </label>
        <input
          type="text"
          id="tipoPonencia"
          placeholder="Plenaria, poster, otros"
          {...register("tipoPonencia", {
            required: !isAsistencia && "El tipo de ponencia es requerido",
          })}
          className="form-input"
          disabled={isAsistencia}
        />
        {errors.tipoPonencia && (
          <span className="error-text">{errors.tipoPonencia.message}</span>
        )}
      </div>
       

      <div className="form-group">
            
          <label htmlFor="articuloPublicado" className="form-label">¿El Artículo será publicado?</label>

          <p>
        Por favor, ingrese el nombre de la revista y base de datos indexadas, 
        el número especial de revista o memorias del evento, 
        la revista o memorias en las cuales se publicará el artículo.
      </p>

          <div>
            <input
              type="radio"
              id="articuloSI"
              value="SI"
              {...register("articuloPublicado", {
                required: "Indique si el artículo será publicado",
              })}
            />
            <label htmlFor="articuloSi">SI</label>
            
            {showInputArticulo && (
                 <input
                 type="text"
                 id="detalleArticuloSI"
                 {...register("detalleArticuloSI", {
                   required: "Por favor detalle del articulo es requerida",
                 })}
                 placeholder="Especifique"
                 className="form-input"
               />
            )}
          </div>
          <div>
            <input
              type="radio"
              id="articuloNo"
              value="NO"
              {...register("articuloPublicado", {
                required: "Indique si el artículo será publicado",
              })}
            />
            <label htmlFor="articuloNo">NO</label>
          </div>
          {errors.pasajesAereos && (
            <span className="error-text">{errors.articuloPublicado.message}</span>
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