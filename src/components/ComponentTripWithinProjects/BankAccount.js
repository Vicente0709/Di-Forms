import React, { useEffect } from "react";
import { useFormContext } from 'react-hook-form';

function BankAccount() {
  const { register, watch, setValue, clearErrors, formState: { errors } } = useFormContext();
  
  // Monitorea el campo viaticosSubsistencias directamente aquí
  const seleccionViaticosSubsistencias = watch("viaticosSubsistencias");
  const habilitarCampos = seleccionViaticosSubsistencias === "SI";

  // UseEffect para manejar el caso cuando la selección es "NO"
  useEffect(() => {
    if (!habilitarCampos) {
      // Limpiar valores de los campos cuando se selecciona "NO"
      setValue("nombreBanco", "");
      setValue("tipoCuenta", "");
      setValue("numeroCuenta", "");

      // Limpiar errores asociados a estos campos
      clearErrors(["nombreBanco", "tipoCuenta", "numeroCuenta"]);
    }
  }, [habilitarCampos, setValue, clearErrors]);

  return (
    <div className="form-container">
      <h3>• CUENTA BANCARIA DEL SERVIDOR PARA RECIBIR LOS VIÁTICOS</h3>
      <p>Obligatorio si marcó viáticos</p>

      <div className="form-group">
        <label className="form-label" htmlFor="nombreBanco">Nombre del banco:</label>
        <input
          type="text"
          id="nombreBanco"
          className="form-input"
          {...register("nombreBanco", { required: habilitarCampos ? "Este campo es requerido" : false })}
          disabled={!habilitarCampos}
        />
        {errors.nombreBanco && <span className="error-text">{errors.nombreBanco.message}</span>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="tipoCuenta">Tipo de cuenta:</label>
        <select
          id="tipoCuenta"
          className="form-select"
          {...register("tipoCuenta", { required: habilitarCampos ? "Este campo es requerido" : false })}
          disabled={!habilitarCampos} >

          <option value="">Seleccione</option>
          <option value="Ahorros">Ahorros</option>
          <option value="Corriente">Corriente</option>

        </select>
        {errors.tipoCuenta && <span className="error-text">{errors.tipoCuenta.message}</span>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="numeroCuenta">No. De cuenta:</label>
        <input
          type="text"
          id="numeroCuenta"
          className="form-input"
          {...register("numeroCuenta", { required: habilitarCampos ? "Este campo es requerido" : false })}
          disabled={!habilitarCampos}
        />
        {errors.numeroCuenta && <span className="error-text">{errors.numeroCuenta.message}</span>}
      </div>
    </div>
  );
}

export default BankAccount;