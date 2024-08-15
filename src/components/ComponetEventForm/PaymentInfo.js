import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";

function PaymentInfo() {
  const { register, control, watch, formState: { errors } } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "inscripciones",
  });

  const metodoPago = watch("metodoPago");

  return (
    <div className="form-container">
      <h3>4. INFORMACIÓN DE PAGO</h3>

      {/* Tabla Dinámica */}
      <table className="payment-table">
        <thead>
          <tr>
            <th>Nro.</th>
            <th>Valor de inscripción</th>
            <th>Fecha máxima de pago</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {fields.map((field, index) => (
            <tr key={field.id}>
              <td>
                <input
                  type="number"
                  value={index + 1} // Auto-incrementa el número basado en el índice
                  readOnly
                  className="form-input"
                />
              </td>
              <td>
                <input
                  type="number"
                  step="0.01"
                  id={`valorInscripcion-${index}`}
                  placeholder="100.00"
                  className="form-input"
                  {...register(`inscripciones[${index}].valorInscripcion`, { required: "Este campo es requerido" })}
                />
                {errors.inscripciones && errors.inscripciones[index]?.valorInscripcion && (
                  <span className="error-text">{errors.inscripciones[index].valorInscripcion.message}</span>
                )}
              </td>
              <td>
                <input
                  type="date"
                  id={`fechaMaximaPago-${index}`}
                  className="form-input"
                  {...register(`inscripciones[${index}].fechaMaximaPago`, { required: "Este campo es requerido" })}
                />
                {errors.inscripciones && errors.inscripciones[index]?.fechaMaximaPago && (
                  <span className="error-text">{errors.inscripciones[index].fechaMaximaPago.message}</span>
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
        valorInscripcion: "",
        fechaMaximaPago: ""
      })} className="add-payment-button">
        Agregar Inscripción
      </button>

      {/* Método de pago */}
      <div className="form-group">
        <label className="form-label">Método de pago:</label>
        <div>
          <input
            type="radio"
            id="transferencia"
            value="Transferencia"
            {...register("metodoPago", { required: "Seleccione un método de pago" })}
          />
          <label htmlFor="transferencia">1. Transferencia ("El pago es realizado por la EOD-UGIPS del VIIV")</label>
        </div>
        {metodoPago === "Transferencia" && (
          <div className="sub-group">
            <p>Adjuntar los siguientes documentos:</p>
            <ul>
              <li>Formulario de pagos al exterior (Anexo 6)</li>
              <li>Documento donde se puede verificar el costo y fechas de la inscripción al evento</li>
            </ul>
          </div>
        )}
        <div>
          <input
            type="radio"
            id="otra"
            value="Otra"
            {...register("metodoPago", { required: "Seleccione un método de pago" })}
          />
          <label htmlFor="otra">2. Otra (tarjeta de crédito, efectivo, etc.)</label>
        </div>
        {metodoPago === "Otra" && (
          <div className="sub-group">
            <p>Incluir la siguiente información y documentos:</p>
            <ul>
              <li>Solicitud de REEMBOLSO. Incluir en el texto del memorando la justificación de por qué se solicita este método de pago.</li>
              <li>Documento donde se puede verificar el costo y fechas de la inscripción al evento</li>
            </ul>
          </div>
        )}
        {errors.metodoPago && <span className="error-text">{errors.metodoPago.message}</span>}
      </div>
    </div>
  );
}

export default PaymentInfo;