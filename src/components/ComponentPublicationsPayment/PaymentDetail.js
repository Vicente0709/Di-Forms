import React,{ useEffect,useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";

function PaymentDetail() {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "publicaciones",
  });

  const metodoPago = watch("metodoPago");
  const fechaFinEvento = watch("fechaFinEvento");
  const now = new Date();
  const localOffset = now.getTimezoneOffset() * 60000; // Offset en milisegundos
  const today = new Date(now.getTime() - localOffset).toISOString().split("T")[0];

  useEffect(()=>{
    if (fields.length === 0) {
      append({
        valorInscripcion: "",
        pagoLimite: "",
        limiteFecha: "",
      });
    }
  }, [ fields, append]);


  const validateSingleDateSelection = (index) => {
    const limiteFecha = watch(`publicaciones[${index}].limiteFecha`);

    if (limiteFecha && limiteFecha < today) {
      return `La fecha no puede ser menor que la fecha actual (${today})`;
    }

    return true;
  };

  return (
    <div >
      <h3>• Valor de la publicación</h3>
      <p>
        Recuerde seleccionar la fecha máxima de pago.
      </p>

      {/* Tabla Dinámica */}
      <div className="scroll-table-container">
      <table className="payment-table">
        <thead>
        <tr>
            <th>Nro.</th>
            <th>Moneda</th>
            <th>Valor de publicación</th>
            <th>Fecha</th>
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
                <select
                  id="monedaPago"
                  {...register(`publicaciones[${index}].monedaPago`, {
                    required: "La moneda es requerida",
                  })}
                  className="form-select"
                >
                  <option value="">Seleccione</option>
                  <option value="$ ">Dólares</option>
                  <option value="€ ">Euros</option>
                  <option value="CHF ">
                    Francos Suizos
                  </option>
                </select>
                {errors.monedaPago && (
                  <span className="error-text">
                    {errors.monedaPago.message}
                  </span>
                )}
              </td>

              <td>
                <input
                  type="number"
                  step="0.01"
                  id={`valorPublicacion-${index}`}
                  placeholder="100.00"
                  className="form-input"
                  {...register(`publicaciones[${index}].valorPublicacion`, {
                    required: "Este campo es requerido",
                  })}
                />
                {errors.publicaciones &&
                  errors.publicaciones[index]?.valorPublicacion && (
                    <span className="error-text">
                      {errors.publicaciones[index].valorPublicacion.message}
                    </span>
                  )}
              </td>
              
              <td>
                <input
                  type="date"
                  id={`limiteFecha-${index}`}
                  className="form-input"
                  {...register(`publicaciones[${index}].limiteFecha`, {
                    validate: () => validateSingleDateSelection(index),
                    required: "La fecha es requerida",
                  })}
                />
                {errors.publicaciones &&
                  errors.publicaciones[index]?.limiteFecha && (
                    <span className="error-text">
                      {errors.publicaciones[index].limiteFecha.message}
                    </span>
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

      <button
        type="button"
        onClick={() =>
          append({
            valorInscripcion: "",
            pagoLimite: "",
            limiteFecha: "",
          })
        }
        className="add-payment-button"
      >
        Agregar Inscripción
      </button>
      </div>

      {/* Método de pago */}
      <div className="form-group">
        <h3>Método de pago:</h3>

        <div>
          <input
            type="radio"
            id="transferencia"
            value="Transferencia"
            {...register("metodoPago", {
              required: "Seleccione un método de pago",
            })}
          />
          <label htmlFor="transferencia">
            1. Transferencia ("El pago es realizado por la EOD-UGIPS del VIIV")
          </label>
        </div>
        {metodoPago === "Transferencia" && (
          <div className="sub-group">
            <p>En la solicitud se debe adjuntar los siguientes documentos:</p>
            <ul>
              <li>Formulario de registro de cuenta o formulario de giro al exterior (según corresponda)</li>
            </ul>
          </div>
        )}
        <div>
          <input
            type="radio"
            id="otra"
            value="Otra"
            {...register("metodoPago", {
              required: "Seleccione un método de pago",
            })}
          />
          <label htmlFor="otra">
            2. Otra (tarjeta de crédito, efectivo, etc.)
          </label>
        </div>
        {metodoPago === "Otra" && (
          <div className="sub-group">
            <p>Incluir la siguiente información y documentos:</p>
            <ul>
              <li>
              Solicitud de REEMBOLSO.  
              </li>
              <li>
              Factura del solicitante a nombre de la Unidad de Gestión de Investigación y Proyección Social, adjuntando el respaldo de la transacción.*
              </li>
            </ul>
            <p>
              *La Factura se entregará una vez que el investigador(a) solicite el pago de reembolso. 
              </p>
          </div>
        )}
        {errors.metodoPago && (
          <span className="error-text">{errors.metodoPago.message}</span>
        )}
      </div>
    </div>
  );
}

export default PaymentDetail;
