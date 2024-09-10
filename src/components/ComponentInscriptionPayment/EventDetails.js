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
  const now = new Date();
  const localOffset = now.getTimezoneOffset() * 60000; // Offset en milisegundos
 // Validación personalizada para la fecha de finalización
 const validateFechaFin = (fechaFin) => {
  if (!fechaInicioEvento) {
    return "Primero seleccione la fecha de inicio.";
  }
  return fechaFin >= fechaInicioEvento || "La fecha de finalización no puede ser anterior a la fecha de inicio.";
};


const validatePonencia = (tituloPonencia) => {
    if (!tituloPonencia) {
      return "";
    }else{
        return tituloPonencia;
    }
   
  };
 
  // Control del campo "Título de la Ponencia"
  const isAsistencia = participacionEvento === "Asistencia";
  useEffect(() => {

    setshowInputArticulo (seleccionArticulo === "SI");
    if (seleccionArticulo==="NO"){
        setValue ("detalleArticuloSI","");
    }
   
  }, [setValue, seleccionArticulo]);

  
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
          {...register("tituloPonencia")}
          className="form-input"
          disabled={isAsistencia}
        />
      </div>

      <div className="form-group">
        <label htmlFor="tituloArticulo" className="form-label">
          Título del Artículo:
        </label>
        <input
          type="text"
          id="tituloArticulo"
          {...register("tituloArticulo", {
            required: !isAsistencia && "El título del artículo es requerido",
          })}
          className="form-input"
          disabled={isAsistencia}
        />
        {errors.tituloArticulo && (
          <span className="error-text">{errors.tituloArticulo.message}</span>
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
    </div>
  );
}

export default EventDetails;