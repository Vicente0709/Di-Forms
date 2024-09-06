import { useFormContext } from "react-hook-form";
import Label from "../Labels/Label";
import LabelText from "../Labels/LabelText"; // Nuevo componente

const RadioGroup = ({ label, name, options, rules, disabled, infoText }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className={`form-group ${disabled ? "disabled" : ""}`}>
      <Label text={label} htmlFor={name} disabled={disabled} />
      {infoText && <LabelText text={infoText} />} {/* Nuevo texto informativo */}
      <div className="radio-options">
        {options.map((option) => (
          <div key={option.value} className="radio-option">
            <input
              type="radio"
              id={`${name}_${option.value}`}
              value={option.value}
              {...register(name, rules)}
              disabled={disabled}
              className={`form-radio ${errors[name] ? "is-invalid" : ""}`}
            />
            <Label text={option.label} htmlFor={`${name}_${option.value}`} disabled={disabled} />
          </div>
        ))}
      </div>
      {errors[name] && <span className="error-text">{errors[name].message}</span>}
    </div>
  );
};

export default RadioGroup;
