import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";

function PaymentInfo() {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "inscripciones",
  });

  const metodoPago = watch("metodoPago");
  const fechaInicioEvento = watch("fechaInicioEvento");

  const validateSingleDateSelection = (index) => {
    const antesDeFecha = watch(`inscripciones[${index}].antesDeFecha`);
    const despuesDeFecha = watch(`inscripciones[${index}].despuesDeFecha`);
    const limiteFecha = watch(`inscripciones[${index}].limiteFecha`);

    const selectedDates = [antesDeFecha, despuesDeFecha, limiteFecha].filter(
      Boolean
    );

    if (selectedDates.length === 0) {
      return "Debe seleccionar al menos una de las tres fechas";
    }

    if (selectedDates.length > 1) {
      return "Solo debe seleccionar una de las tres fechas";
    }

    if (antesDeFecha && antesDeFecha > fechaInicioEvento) {
      return `La fecha no puede ser mayor que la fecha de inicio del evento (${fechaInicioEvento})`;
    }

    if (despuesDeFecha && despuesDeFecha > fechaInicioEvento) {
      return `La fecha no puede ser mayor que la fecha de inicio del evento (${fechaInicioEvento})`;
    }

    if (limiteFecha && limiteFecha > fechaInicioEvento) {
      return `La fecha no puede ser mayor que la fecha de inicio del evento (${fechaInicioEvento})`;
    }

    return true;
  };

  return (
    <div className="form-container">
      <h3>• Valor de la inscripción</h3>
      <p>
        Por favor, ingrese las fechas máximas de pago según la información
        proporcionada en la página oficial del evento. Recuerde que solo se debe
        seleccionar una de las tres opciones disponibles para la fecha de pago,
        y asegúrese de que la fecha seleccionada no sea posterior a la fecha de
        inicio del evento.
      </p>

      {/* Tabla Dinámica */}
      <table className="payment-table">
        <thead>
          <tr>
            <th>Nro.</th>
            <th>Valor de inscripción</th>
            <th>Antes</th>
            <th>Después</th>
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
                  {...register(`inscripciones[${index}].valorInscripcion`, {
                    required: "Este campo es requerido",
                  })}
                />
                {errors.inscripciones &&
                  errors.inscripciones[index]?.valorInscripcion && (
                    <span className="error-text">
                      {errors.inscripciones[index].valorInscripcion.message}
                    </span>
                  )}
              </td>
              <td>
                <input
                  type="date"
                  id={`antesDeFecha-${index}`}
                  className="form-input"
                  {...register(`inscripciones[${index}].antesDeFecha`, {
                    validate: () => validateSingleDateSelection(index),
                  })}
                />
                {errors.inscripciones &&
                  errors.inscripciones[index]?.antesDeFecha && (
                    <span className="error-text">
                      {errors.inscripciones[index].antesDeFecha.message}
                    </span>
                  )}
              </td>
              <td>
                <input
                  type="date"
                  id={`despuesDeFecha-${index}`}
                  className="form-input"
                  {...register(`inscripciones[${index}].despuesDeFecha`, {
                    validate: () => validateSingleDateSelection(index),
                  })}
                />
                {errors.inscripciones &&
                  errors.inscripciones[index]?.despuesDeFecha && (
                    <span className="error-text">
                      {errors.inscripciones[index].despuesDeFecha.message}
                    </span>
                  )}
              </td>
              <td>
                <input
                  type="date"
                  id={`limiteFecha-${index}`}
                  className="form-input"
                  {...register(`inscripciones[${index}].limiteFecha`, {
                    validate: () => validateSingleDateSelection(index),
                  })}
                />
                {errors.inscripciones &&
                  errors.inscripciones[index]?.limiteFecha && (
                    <span className="error-text">
                      {errors.inscripciones[index].limiteFecha.message}
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
            antesDeFecha: "",
            despuesDeFecha: "",
            limiteFecha: "",
          })
        }
        className="add-payment-button"
      >
        Agregar Inscripción
      </button>
     
      <p>
        Considere que si el pago de inscripción es una moneda diferente a la
        moneda legal del país se requiere un banco intermediario , por lo que se
        solicita se comunique con la organización del evento para obtener esta
        información.
      </p>
      <p>
        En el caso que no exista banco intermediario se podrá solicitar un pago
        por reembolso siempre y cuando se tenga la contestación oficial de la
        organización de no tener un banco intermediario.
      </p>

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
              <li>Formulario de pagos al exterior (Anexo 6)</li>
              <li>
                Documento donde se puede verificar el costo y fechas de la
                inscripción al evento
              </li>
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
                Solicitud de REEMBOLSO. Incluir en el texto del memorando la
                justificación de por qué se solicita este método de pago.
              </li>
              <li>
                Documento donde se puede verificar el costo y fechas de la
                inscripción al evento
              </li>
              <li>
                Documento en el cual se indique que el pago solo se puede
                realizar con tarjeta de crédito o efectivo o que no cuenta con
                banco intermediario.
              </li>
            </ul>
          </div>
        )}
        {errors.metodoPago && (
          <span className="error-text">{errors.metodoPago.message}</span>
        )}
      </div>
    </div>
  );
}

export default PaymentInfo;