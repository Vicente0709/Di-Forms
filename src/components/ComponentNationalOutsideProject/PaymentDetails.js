import React,{ useEffect,useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";

function PaymentDetails() {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "inscripciones",
  });

  const metodoPago = watch("metodoPago");
  const fechaFinEvento = watch("fechaFinEvento");
  const now = new Date();
  const localOffset = now.getTimezoneOffset() * 60000; // Offset en milisegundos
  const today = new Date(now.getTime() - localOffset).toISOString().split("T")[0];

  const inscripcion = watch("inscripcion");
  const [showInputInscripcion, setshowInputInscripcion] = useState(false);

  useEffect(() => {

    if (inscripcion === "SI") {
      setshowInputInscripcion(true);
      } else {
      setshowInputInscripcion(false);
      setValue("inscripciones");
     
    }

    const initialValor={
      valorInscripcion: "",
      pagoLimite: "",
      limiteFecha: "",
    }

    if(fields.length===0){
      append(initialValor);
    }
      
  }, [inscripcion, setValue, fields.length]);

  
  const validateSingleDateSelection = (index) => {
    const limiteFecha = watch(`inscripciones[${index}].limiteFecha`);

    if (limiteFecha && limiteFecha > fechaFinEvento) {
      return `La fecha no puede ser mayor que la fecha de fin del evento (${fechaFinEvento})`;
    }
    //validacion para fechas anteriores a la actual
    if (limiteFecha && limiteFecha < today) {
      return `La fecha no puede ser menor que la fecha actual (${today})`;
    }

    return true;
  };

  return (
    <div >
      {showInputInscripcion && (
        <>
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
            <th>Pago a realizarse</th>
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
                <select
                  id="pagoLimite"
                  {...register(`inscripciones[${index}].pagoLimite`, {
                    required: "El pago limite es requerido",
                  })}
                  className="form-select"
                >
                  <option value="">Seleccione</option>
                  <option value="Antes del ">Antes</option>
                  <option value="Despues del ">Despues</option>
                  <option value="Hasta el ">Fecha maxima de pago</option>
                </select>
                {errors.pagoLimite && (
                  <span className="error-text">
                    {errors.pagoLimite.message}
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
                    required: "La fecha es requerida",
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
            pagoLimite: "",
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
              <li>
                Formulario de pagos al exterior, de ser el caso, (Anexo 4)
              </li>
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
                Solicitud de REEMBOLSO. Incluir texto con justificación en el
                mismo memorando del requerimiento.
              </li>
              <li>
                Documento donde se puede verificar el costo y fechas de la
                inscripción al evento.
              </li>
            </ul>
          </div>
        )}
        {errors.metodoPago && (
          <span className="error-text">{errors.metodoPago.message}</span>
        )}

        <p>
        *A su regreso el investigador(a) deberá presentar la factura o nota de venta de los gastos de hospedaje y/o alimentación, mismos que deberán justificar el 70% del valor del viatico, caso contrario la diferencia deberá ser reintegrada a la cuenta de la EOD-UGIPS. (Norma Técnica para el pago de viáticos Artículo 15 Control y liquidación). 
        </p>
      </div>
      </>
    )}
    </div>
  );
}

export default PaymentDetails;
