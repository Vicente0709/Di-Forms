import { useFormContext } from "react-hook-form";
import { useEffect } from "react";
import Label from "../Labels/Label";

const InputDate = ({ name, label, rules, disabled, defaultValue }) => {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();

  // Establece un valor predeterminado cuando el campo está deshabilitado
  useEffect(() => {
    if (disabled && defaultValue) {
      setValue(name, defaultValue);
    } else if (!disabled) {
      setValue(name, ""); // Limpia el campo cuando se habilita
    }
  }, [disabled, defaultValue, setValue, name]);

  return (
    <div className="form-group">
      <Label text={label} htmlFor={name} disabled={disabled} />
      <input
        id={name}
        name={name}
        type="date"
        {...register(name, rules)}
        className={`form-input ${errors[name] ? "is-invalid" : ""}`}
        disabled={disabled} // Deshabilita el campo si el prop disabled es true
      />
      {errors[name] && <span className="error-text">{errors[name].message}</span>}
    </div>
  );
};

export default InputDate;
