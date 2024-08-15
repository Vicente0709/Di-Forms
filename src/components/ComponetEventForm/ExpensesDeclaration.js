import React from "react";
import { useFormContext } from 'react-hook-form';

function ExpensesDeclaration() {
  const { register, watch, formState: { errors } } = useFormContext();
  
  // Verifica qué opción está seleccionada
  const seleccionDeclaracion = watch("seleccionDeclaracion");

  return (
    <div className="form-container">
      <h3>5. DECLARACIÓN DE GASTOS, CONFORME REGLAMENTO DE VIÁTICOS AL EXTERIOR</h3>
      
      <p>Marcar con una X según corresponda. Responda SI aunque la organización del evento cubra el rubro parcialmente.</p>

      <div className="form-group">
        <h4>La organización del evento cubre los siguientes rubros:</h4>
        
        <div className="form-group">
          <label className="form-label">a) Hospedaje</label>
          <div>
            <label>
              <input
                type="radio"
                id="hospedaje_si"
                value="SI"
                {...register("hospedaje", { required: "Este campo es requerido" })}
              />
              SI
            </label>
            <label style={{ marginLeft: '20px' }}>
              <input
                type="radio"
                id="hospedaje_no"
                value="NO"
                {...register("hospedaje", { required: "Este campo es requerido" })}
              />
              NO
            </label>
          </div>
          {errors.hospedaje && <span className="error-text">{errors.hospedaje.message}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">b) Movilización interna</label>
          <div>
            <label>
              <input
                type="radio"
                id="movilizacion_si"
                value="SI"
                {...register("movilizacion", { required: "Este campo es requerido" })}
              />
              SI
            </label>
            <label style={{ marginLeft: '20px' }}>
              <input
                type="radio"
                id="movilizacion_no"
                value="NO"
                {...register("movilizacion", { required: "Este campo es requerido" })}
              />
              NO
            </label>
          </div>
          {errors.movilizacion && <span className="error-text">{errors.movilizacion.message}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">c) Alimentación</label>
          <div>
            <label>
              <input
                type="radio"
                id="alimentacion_si"
                value="SI"
                {...register("alimentacion", { required: "Este campo es requerido" })}
              />
              SI
            </label>
            <label style={{ marginLeft: '20px' }}>
              <input
                type="radio"
                id="alimentacion_no"
                value="NO"
                {...register("alimentacion", { required: "Este campo es requerido" })}
              />
              NO
            </label>
          </div>
          {errors.alimentacion && <span className="error-text">{errors.alimentacion.message}</span>}
          <p className="note">
            *Verificar si el pago de inscripción o la organización del evento cubre alimentación por desayuno, almuerzo (lunch) o cena. Se debe marcar SI, en caso de que cubra alguna alimentación.
          </p>
        </div>
      </div>

      <div className="form-group">
        <h4>Selección de declaración</h4>
        <div>
          <label>
            <input
              type="radio"
              id="declaracionNoCubre"
              value="noCubre"
              {...register("seleccionDeclaracion", { required: "Debe seleccionar una opción" })}
            />
            Declaración si la organización NO cubre ningún rubro
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              id="declaracionSiCubre"
              value="siCubre"
              {...register("seleccionDeclaracion", { required: "Debe seleccionar una opción" })}
            />
            Declaración si la organización SI cubre algún rubro
          </label>
        </div>
        {errors.seleccionDeclaracion && <span className="error-text">{errors.seleccionDeclaracion.message}</span>}
      </div>

      {/* Texto condicional según la selección */}
      {seleccionDeclaracion === "noCubre" && (
        <div className="form-group">
          <p>En mi calidad de profesor-investigador de la EPN, declaro que la Organización del evento NO cubre ningún gasto, por lo que solicito se gestione la asignación de viáticos conforme se establece en el artículo 7 del Reglamento de Viáticos al Exterior.</p>
        </div>
      )}

      {seleccionDeclaracion === "siCubre" && (
        <div className="form-group">
          <p>En mi calidad de profesor-investigador de la EPN, declaro que la Organización del evento SI cubre gastos, por lo que solicito se gestione la asignación viáticos conforme se establece en el artículo 13 del Reglamento de Viáticos al Exterior.</p>
          <p className="note">
            **A su regreso el investigador(a) deberá presentar la factura o nota de venta de los gastos de hospedaje y/o alimentación, o de los establecidos en el artículo 9 del Reglamento de Viáticos al Exterior, que no hayan sido cubiertos por estas instituciones u organismos, para el reconocimiento de estos rubros y su correspondiente liquidación.
          </p>
        </div>
      )}
    </div>
  );
}

export default ExpensesDeclaration;