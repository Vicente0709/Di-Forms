import React, { useState, useEffect } from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { Container, Button, Row, Col, Form } from "react-bootstrap";

// Importación de los componentes Props
import Label from "./Labels/Label";
import LabelTitle from "./Labels/LabelTitle";
import LabelText from "./Labels/LabelText";
import InputSelect from "./Inputs/InputSelect";
import InputText from "./Inputs/InputText";
import InputTextArea from "./Inputs/InputTextArea";
import InputDate from "./Inputs/InputDate";
import RadioGroup from "./Inputs/RadioGroup";
import ActionButton from "./Buttons/ActionButton";
import DownloadButton from "./Buttons/DownloadButton";

//Importación de funciones
import today from "../utils/date";
import { generateDateRange } from "../utils/dataRange";
import {validarCedulaEcuatoriana, validarFechaFin, validateFechaLlegadaIda, validateFechaSalidaRegreso} from "../utils/validaciones.js";

// Importación de las funciones para generar documentos
import { generateAnexo7WithinProject,generateMemoSamplingTripWithinProject } from "../utils/documentGeneratorNational";
import { getValue } from "@testing-library/user-event/dist/utils";

//Constantes globales
const formStorageKey = "formSamplingTripWithinProject"; // Clave para almacenar el formulario en sessionStorage

function SamplingTripWithinProjectForm() {
  // Configuración del formulario con react-hook-form y valores predeterminados desde sessionStorage
  const formData = JSON.parse(sessionStorage.getItem(formStorageKey)) || {};

  const methods = useForm({ mode: "onChange", reValidateMode: "onChange", defaultValues: formData});
  const { register, control, watch, setValue, reset, clearErrors, formState: { errors }, } = methods;

  //FieldArrays para tablas
  const { fields: participanteFields, append: appendParticipante, remove: removeParticipante } = useFieldArray({control, name: "participante"});
  const { fields: fieldsIda, append: appendIda, remove: removeIda } = useFieldArray({ control, name: "transporteIda"});
  const { fields: fieldsRegreso, append: appendRegreso, remove: removeRegreso} = useFieldArray({ control, name: "transporteRegreso"});
  const { fields: immutableFields, replace } = useFieldArray({ control, name: "actividadesInmutables" });

  //visualizadores con watch
  const fechaInicioViaje =  watch("fechaInicioViaje");
  const fechaFinViaje = watch("fechaFinViaje");
  const transporteIdaValues = watch("transporteIda");
  const transporteRegresoValues = watch("transporteRegreso");
  const seleccionViaticosSubsistencias = watch("viaticosSubsistencias");

  //Derivaciones de visualizadores 
  const habilitarCampos = seleccionViaticosSubsistencias === "SI";
  const fechaSalida = transporteIdaValues && transporteIdaValues.length > 0
  ? transporteIdaValues[0].fechaSalida
  : null;

const fechaLlegada = transporteRegresoValues && transporteRegresoValues.length > 0
  ? transporteRegresoValues[transporteRegresoValues.length - 1].fechaLlegada
  : null;

  const rangoFechas = generateDateRange(fechaSalida, fechaLlegada);



  //manejadores de estado
  const [showDownloadSection, setShowDownloadSection] = useState(false);

  const onSubmitSamplingTrip = (data)=>{
  setShowDownloadSection(true);
  }

  const handleDownloadJson = () => {
    const data = methods.getValues();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Viajes de Muestreo Dentro de Proyectos.json";
    link.click();
  };

  const handleUploadJson = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target.result);
          reset(json, {
            keepErrors: false,
            keepDirty: false,
            keepValues: false,
            keepTouched: false,
            keepIsSubmitted: false,
          });
          sessionStorage.setItem(formStorageKey, JSON.stringify(json));
        } catch (err) {
          console.error("Error al cargar el archivo JSON:", err);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleGenerateDocx = () => {
    const data = methods.getValues();
    generateMemoSamplingTripWithinProject(data);
    setShowDownloadSection(false);
  };
  const handleGeneratePdf2 = () => {
    const data = methods.getValues();
    generateAnexo7WithinProject(data);    
    setShowDownloadSection(false);
  };

  const handleClearForm = () => {
    sessionStorage.removeItem(formStorageKey);
    window.location.reload();
  };

  // useEffect principal
  useEffect(() => {
    reset(formData);
    const subscription = watch((data) => {
      sessionStorage.setItem(formStorageKey, JSON.stringify(data));
    });
    return () => subscription.unsubscribe();
  }, [watch, reset]);

  //Control de los datos
  useEffect(() => {
    if (seleccionViaticosSubsistencias === "NO") {
      setValue("nombreBanco", "");
      setValue("tipoCuenta", "");
      setValue("numeroCuenta", "");
    }

   if(participanteFields.length===0){
    appendParticipante({
      nombre: "",
      rol: "",
    });
  }

    if (fieldsIda.length === 0) {
      appendIda({
      tipoTransporte: "",
      nombreTransporte: "",
      ruta: "",
      fechaSalida: "",
      horaSalida: "",
      fechaLlegada: "",
      horaLlegada: "",
    });
  }

    if (fieldsRegreso.length === 0) {
      appendRegreso({
      tipoTransporte: "",
      nombreTransporte: "",
      ruta: "",
      fechaSalida: "",
      horaSalida: "",
      fechaLlegada: "",
      horaLlegada: "",
    });
  }
  if (rangoFechas.length > 0) {
    // Obtener las actividades actuales
    const actividadesActuales = methods.getValues("actividadesInmutables") || [];

    // Creamos un mapa (objeto) de las actividades actuales para acceder fácilmente a las descripciones
    const actividadMap = actividadesActuales.reduce((acc, actividad) => {
      acc[actividad.fecha] = actividad.descripcion;
      return acc;
    }, {});

    // Mapeamos el nuevo rango de fechas, manteniendo las descripciones anteriores si coinciden
    const actividadesActualizadas = rangoFechas.map((fecha) => {
      return {
        fecha: fecha,
        descripcion: actividadMap[fecha] || "", // Mantener la descripción si existe para la fecha
      };
    });

    // Solo reemplazamos si hay un cambio real
    if (JSON.stringify(actividadesActuales) !== JSON.stringify(actividadesActualizadas)) {
      replace(actividadesActualizadas); // Actualizamos las actividades solo si hay cambios
    }
  }
 
}, [replace,setValue,habilitarCampos, seleccionViaticosSubsistencias, rangoFechas, fechaSalida, fechaLlegada,fieldsIda, fieldsRegreso, participanteFields]);


  return (
    <FormProvider {...methods}>
      <Container>
        <h1 className="text-center my-4">
        Formulario para salidas de campo y de muestreo y/o viajes técnicos dentro de proyectos
        </h1>
        <div className="form-container">
          <Label text="Descargar datos actuales en (.json)" />
          {/* Botón para descargar el formulario como .json */}
          <ActionButton
            onClick={handleDownloadJson}
            label="Descargar datos como JSON"
            variant="success"
          />
          <Label text="Cargar datos desde archivo (.json)" />
          {/* Input nativo para cargar un archivo JSON */}
          <input
            type="file"
            accept=".json"
            onChange={handleUploadJson} // Conectar con la función
            style={{ marginTop: "20px" }} // Estilos opcionales
          />
        </div>
        <Form onSubmit={methods.handleSubmit(onSubmitSamplingTrip)}>
          <div className="form-container">
            <LabelTitle
              text="DATOS GENERALES PARA LA SALIDA DE CAMPO, DE MUESTREO Y/O VIAJE TÉCNICO"
              disabled={false}
            />

            <InputText
              name="codigoProyecto"
              label="Código del proyecto:"
              placeholder={"Ejemplo: PIGR-24-01"}
              rules={{
                required: "El código del proyecto es requerido",
                pattern: {
                  value: /^[A-Za-z]+(-[A-Za-z0-9]+)+$/,
                  message:
                    "El código del proyecto debe estar conformado por una combinación de letras y números separados por guiones",
                },
              }}
              disabled={false}
            />

            <InputText
              name="tituloProyecto"
              label="Título del proyecto:"
              rules={{ required: "El título del proyecto es requerido" }}
              disabled={false}
            />

            <InputText
              name="nombreDirector"
              label="Nombre del Director del proyecto:"
              rules={{ required: "El nombre del Director es requerido" }}
              disabled={false}
            />

            {/* Departamento / Instituto */}
            <InputSelect
              name="departamento"
              label="Departamento / Instituto:"
              options={departamentoOptions}
              rules={{ required: "El departamento es requerido" }}
              disabled={false}
            />
            <LabelTitle text="Personal a trasladarse" />
            <table className="activity-schedule-table">
              <thead>
                <tr>
                  <th>Personal a trasladarse</th>
                  <th>Rol en el Proyecto</th>
                </tr>
              </thead>
              <tbody>
                {participanteFields.map((field, index) => (
                  <tr
                    key={field.id}
                    className={index % 2 === 0 ? "row-even" : "row-odd"}
                  >
                    <td>
                      <input
                        type="text"
                        id={`participante[${index}].nombre`}
                        className="form-input"
                        {...register(`participante[${index}].nombre`, {
                          required: "El nombre es requerido",
                        })}
                      />
                      {errors.participante &&
                        errors.participante[index]?.nombre && (
                          <span className="error-text">
                            {errors.participante[index].nombre.message}
                          </span>
                        )}
                    </td>
                    <td>
                      <select
                        id={`participante[${index}].rol`}
                        className="form-input"
                        defaultValue="Aéreo"
                        {...register(`participante[${index}].rol`, {
                          required: "Este campo es requerido",
                        })}
                      >
                        <option value="Director">Director</option>
                        <option value="Codirector">Codirector</option>
                        <option value="Colaborador">Colaborador</option>
                      </select>
                      {errors.participante &&
                        errors.participante[index]?.rol && (
                          <span className="error-text">
                            {errors.participante[index].rol.message}
                          </span>
                        )}
                    </td>
                    <td>
                      <ActionButton
                        onClick={() => removeParticipante(index)}
                        label="Eliminar"
                        variant="danger"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ActionButton
              onClick={() => {
                appendParticipante({
                  nombre: "", // Valor inicial para el cargo
                  rol: "", // Valor inicial para el rol
                });
              }}
              label="Agregar"
              variant="success"
            />
            <LabelTitle text="DATOS DE LA SALIDA DE CAMPO Y DE MUESTREO"/>
            <InputText
             name="ciudad"
             label="Lugar de movilización"
             rules={{ required: "La ciudad a movilizarce es requerida" }}
             disabled={false}
            />

            <InputDate
              name="fechaInicioViaje"
              label="Desde:"
              rules={{
                required: "La fecha de inicio del evento es requerida",
                validate: (value) => {
                  return (
                    value >= today() ||
                    "La fecha de inicio no puede ser anterior a la fecha actual."
                  );
                },
              }}
              disabled={false}
            />

            <InputDate
              name="fechaFinViaje"
              label="Hasta:"
              rules={{
                required: "La fecha de fin del evento es requerida",
                validate: (value) => {
                  return (
                    value >= today()||
                    "La fecha debe ser mayor a la fecha actual "+ today()
                  );
                },
                validate: (value) => {
                  return (
                    value >= watch("fechaInicioViaje") ||
                    "La fecha FIN de viaje  debe ser major a la fecha de incio del viaje " + fechaInicioViaje
                  );
                },

              }}
              disabled={false}
            />

            <Label text="Solicita para viaje tecnico" />
            <RadioGroup
              name="pasajesAereos"
              label="Pasajes aéreos:"
              options={[
                { value: "SI", label: "SI" },
                { value: "NO", label: "NO" },
              ]}
              rules={{ required: "Indique si requiere pasajes aéreos" }}
              disabled={false}
            />

            <RadioGroup
              name="viaticosSubsistencias"
              label="Viáticos y subsistencias:"
              options={[
                { value: "SI", label: "SI" },
                { value: "NO", label: "NO" },
              ]}
              rules={{
                required: "Indique si requiere viáticos y subsistencias",
              }}
              disabled={false}
            />
             <RadioGroup
              name="inscripcion"
              label="Inscripción:"
              options={[
                { value: "SI", label: "SI" },
                { value: "NO", label: "NO" },
              ]}
              rules={{ required: "Indique si requiere inscripción" }}
            />
            <LabelTitle text="Transporte" disabled={false} />
            <LabelText
              text="Por favor, considere que el itinerario es tentativo. Consulte el
                itinerario del medio de transporte elegido en su página oficial
                o sitios web de confianza. Seleccione la opción que ofrezca el
                menor tiempo de viaje y el menor número de escalas de ser el
                caso."
            />
            <Label text="TRANSPORTE DE IDA" />
            <LabelText text="Para el ingreso de itinerario de viaje, considere que se puede llegar al destino máximo un día antes del inicio del evento, salida de campo." />

            <div className="scroll-table-container">
              <table className="activity-schedule-table">
                <thead>
                  <tr>
                    <th>Tipo de Transporte</th>
                    <th>Nombre de Transporte</th>
                    <th>Ruta Transporte</th>
                    <th>Fecha de Salida</th>
                    <th>Hora de Salida</th>
                    <th>Fecha de Llegada</th>
                    <th>Hora de Llegada</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {fieldsIda.map((field, index) => {
                    const fechaSalida = watch(
                      `transporteIda[${index}].fechaSalida`
                    );
                    const fechaLlegadaAnterior = watch(
                      `transporteIda[${index - 1}].fechaLlegada`
                    );
                    return (
                      <tr key={field.id}>
                        <td>
                          <select
                            id={`tipoTransporte-${index}`}
                            className="form-input"
                            defaultValue="Aéreo"
                            {...register(
                              `transporteIda[${index}].tipoTransporte`,
                              {
                                required: "Este campo es requerido",
                              }
                            )}
                          >
                            <option value="Aéreo">Aéreo</option>
                            <option value="Terrestre">Terrestre</option>
                            <option value="Marítimo">Marítimo</option>
                            <option value="Otros">Otros</option>
                          </select>
                          {errors.transporteIda &&
                            errors.transporteIda[index]?.tipoTransporte && (
                              <span className="error-text">
                                {
                                  errors.transporteIda[index].tipoTransporte
                                    .message
                                }
                              </span>
                            )}
                        </td>
                        <td>
                          <input
                            type="text"
                            id={`nombreTransporte-${index}`}
                            className="form-input"
                            {...register(
                              `transporteIda[${index}].nombreTransporte`,
                              {
                                required: "Este campo es requerido",
                              }
                            )}
                          />
                          {errors.transporteIda &&
                            errors.transporteIda[index]?.nombreTransporte && (
                              <span className="error-text">
                                {
                                  errors.transporteIda[index].nombreTransporte
                                    .message
                                }
                              </span>
                            )}
                        </td>
                        <td>
                          <input
                            type="text"
                            id={`ruta-${index}`}
                            placeholder="UIO-GYE"
                            className="form-input"
                            {...register(`transporteIda[${index}].ruta`, {
                              required: "Este campo es requerido",
                            })}
                          />
                          {errors.transporteIda &&
                            errors.transporteIda[index]?.ruta && (
                              <span className="error-text">
                                {errors.transporteIda[index].ruta.message}
                              </span>
                            )}
                        </td>
                        <td>
                          <input
                            type="date"
                            id={`fechaSalida-${index}`}
                            className="form-input"
                            {...register(
                              `transporteIda[${index}].fechaSalida`,
                              {
                                required: "Este campo es requerido",
                                validate: {
                                  noPastDate: (value) =>
                                    value >= today() ||
                                    "La fecha no puede ser menor a la fecha actual",
                                  validSequence: (value) =>
                                    !fechaLlegadaAnterior ||
                                    value >= fechaLlegadaAnterior ||
                                    "La fecha de salida debe ser posterior a la fecha de llegada anterior",
                                },
                              }
                            )}
                          />
                          {errors.transporteIda &&
                            errors.transporteIda[index]?.fechaSalida && (
                              <span className="error-text">
                                {
                                  errors.transporteIda[index].fechaSalida
                                    .message
                                }
                              </span>
                            )}
                        </td>
                        <td>
                          <input
                            type="time"
                            id={`horaSalida-${index}`}
                            className="form-input"
                            {...register(`transporteIda[${index}].horaSalida`, {
                              required: "Este campo es requerido",
                            })}
                          />
                          {errors.transporteIda &&
                            errors.transporteIda[index]?.horaSalida && (
                              <span className="error-text">
                                {errors.transporteIda[index].horaSalida.message}
                              </span>
                            )}
                        </td>
                        <td>
                          <input
                            type="date"
                            id={`fechaLlegada-${index}`}
                            className="form-input"
                            {...register(
                              `transporteIda[${index}].fechaLlegada`,
                              {
                                required: "Este campo es requerido",
                                validate: {
                                  noPastDate: (value) =>
                                    value >= today() || "La fecha no puede ser menor a la fecha actual",
                                  afterSalida: (value) =>
                                    value >= fechaSalida || "La fecha de llegada debe ser posterior o igual a la fecha de salida",
                                  
                                  // Condicionalmente, aplica la validación de llegada si es el último campo en `fieldsIda`
                                  validateFechaLlegadaIda: (value) =>
                                    index === fieldsIda.length - 1
                                      ? validateFechaLlegadaIda(value, fechaInicioViaje)
                                      : true, // Si no es el último campo, no aplica esta validación
                                },
                              }
                            )}
                          />
                          {errors.transporteIda &&
                            errors.transporteIda[index]?.fechaLlegada && (
                              <span className="error-text">
                                {
                                  errors.transporteIda[index].fechaLlegada
                                    .message
                                }
                              </span>
                            )}
                        </td>
                        <td>
                          <input
                            type="time"
                            id={`horaLlegada-${index}`}
                            className="form-input"
                            {...register(
                              `transporteIda[${index}].horaLlegada`,
                              {
                                required: "Este campo es requerido",
                              }
                            )}
                          />
                          {errors.transporteIda &&
                            errors.transporteIda[index]?.horaLlegada && (
                              <span className="error-text">
                                {
                                  errors.transporteIda[index].horaLlegada
                                    .message
                                }
                              </span>
                            )}
                        </td>
                        <td>
                          <ActionButton
                            onClick={() => removeIda(index)}
                            label="Eliminar"
                            variant="danger"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <ActionButton
                onClick={() => {
                  appendIda({
                    tipoTransporte: "",
                    nombreTransporte: "",
                    ruta: "",
                    fechaSalida: "",
                    horaSalida: "",
                    fechaLlegada: "",
                    horaLlegada: "",
                  });
                }}
                label="Agregar"
                variant="success"
              />
            </div>

            <Label text="TRANSPORTE DE REGRESO" />
            <LabelText
              text=" El retorno puede ser máximo un día después de la finalización
                del evento."
            />

            <div className="scroll-table-container">
              <table className="activity-schedule-table">
                <thead>
                  <tr>
                    <th>Tipo de Transporte</th>
                    <th>Nombre de Transporte</th>
                    <th>Ruta Transporte</th>
                    <th>Fecha de Salida</th>
                    <th>Hora de Salida</th>
                    <th>Fecha de Llegada</th>
                    <th>Hora de Llegada</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {fieldsRegreso.map((field, index) => {
                    const fechaSalida = watch(
                      `transporteRegreso[${index}].fechaSalida`
                    );
                    const fechaLlegadaAnterior = watch(
                      `transporteRegreso[${index - 1}].fechaLlegada`
                    );
                    return (
                      <tr key={field.id}>
                        <td>
                          <select
                            id={`tipoTransporte-${index}`}
                            className="form-input"
                            defaultValue="Aéreo"
                            {...register(
                              `transporteRegreso[${index}].tipoTransporte`,
                              {
                                required: "Este campo es requerido",
                              }
                            )}
                          >
                            <option value="Aéreo">Aéreo</option>
                            <option value="Terrestre">Terrestre</option>
                            <option value="Marítimo">Marítimo</option>
                            <option value="Otros">Otros</option>
                          </select>
                          {errors.transporteRegreso &&
                            errors.transporteRegreso[index]?.tipoTransporte && (
                              <span className="error-text">
                                {
                                  errors.transporteRegreso[index].tipoTransporte
                                    .message
                                }
                              </span>
                            )}
                        </td>
                        <td>
                          <input
                            type="text"
                            id={`nombreTransporte-${index}`}
                            className="form-input"
                            {...register(
                              `transporteRegreso[${index}].nombreTransporte`,
                              {
                                required: "Este campo es requerido",
                              }
                            )}
                          />
                          {errors.transporteRegreso &&
                            errors.transporteRegreso[index]
                              ?.nombreTransporte && (
                              <span className="error-text">
                                {
                                  errors.transporteRegreso[index]
                                    .nombreTransporte.message
                                }
                              </span>
                            )}
                        </td>
                        <td>
                          <input
                            type="text"
                            id={`ruta-${index}`}
                            placeholder="UIO-GYE"
                            className="form-input"
                            {...register(`transporteRegreso[${index}].ruta`, {
                              required: "Este campo es requerido",
                            })}
                          />
                          {errors.transporteRegreso &&
                            errors.transporteRegreso[index]?.ruta && (
                              <span className="error-text">
                                {errors.transporteRegreso[index].ruta.message}
                              </span>
                            )}
                        </td>
                        <td>
                          <input
                            type="date"
                            id={`fechaSalida-${index}`}
                            className="form-input"
                            {...register(
                              `transporteRegreso[${index}].fechaSalida`,
                              {
                                required: "Este campo es requerido",
                                validate: {
                                  noPastDate: (value) =>
                                    value >= today() || "La fecha no puede ser menor a la fecha actual",
                                  validSequence: (value) =>
                                    !fechaLlegadaAnterior ||
                                    value >= fechaLlegadaAnterior ||
                                    "La fecha de salida debe ser posterior a la fecha de llegada anterior",
                                  
                                  // Condicionalmente, aplica la validación de salida si es el primer campo en `fieldsRegreso`
                                  validateRegreso: (value) =>
                                    index === 0 ? validateFechaSalidaRegreso(value, fechaFinViaje) : true,
                                },
                              }
                            )}
                          />
                          {errors.transporteRegreso &&
                            errors.transporteRegreso[index]?.fechaSalida && (
                              <span className="error-text">
                                {
                                  errors.transporteRegreso[index].fechaSalida
                                    .message
                                }
                              </span>
                            )}
                        </td>
                        <td>
                          <input
                            type="time"
                            id={`horaSalida-${index}`}
                            className="form-input"
                            {...register(
                              `transporteRegreso[${index}].horaSalida`,
                              {
                                required: "Este campo es requerido",
                              }
                            )}
                          />
                          {errors.transporteRegreso &&
                            errors.transporteRegreso[index]?.horaSalida && (
                              <span className="error-text">
                                {
                                  errors.transporteRegreso[index].horaSalida
                                    .message
                                }
                              </span>
                            )}
                        </td>
                        <td>
                          <input
                            type="date"
                            id={`fechaLlegada-${index}`}
                            className="form-input"
                            {...register(
                              `transporteRegreso[${index}].fechaLlegada`,
                              {
                                required: "Este campo es requerido",
                                validate: {
                                  noPastDate: (value) =>
                                    value >= today ||
                                    "La fecha no puede ser menor a la fecha actual",
                                  afterSalida: (value) =>
                                    value >= fechaSalida ||
                                    "La fecha de llegada debe ser posterior o igual a la fecha de salida",
                                },
                              }
                            )}
                          />
                          {errors.transporteRegreso &&
                            errors.transporteRegreso[index]?.fechaLlegada && (
                              <span className="error-text">
                                {
                                  errors.transporteRegreso[index].fechaLlegada
                                    .message
                                }
                              </span>
                            )}
                        </td>
                        <td>
                          <input
                            type="time"
                            id={`horaLlegada-${index}`}
                            className="form-input"
                            {...register(
                              `transporteRegreso[${index}].horaLlegada`,
                              {
                                required: "Este campo es requerido",
                              }
                            )}
                          />
                          {errors.transporteRegreso &&
                            errors.transporteRegreso[index]?.horaLlegada && (
                              <span className="error-text">
                                {
                                  errors.transporteRegreso[index].horaLlegada
                                    .message
                                }
                              </span>
                            )}
                        </td>
                        <td>
                          <ActionButton
                            onClick={() => removeRegreso(index)}
                            label="Eliminar"
                            variant="danger"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <ActionButton
                onClick={() => {
                  appendRegreso({
                    tipoTransporte: "",
                    nombreTransporte: "",
                    ruta: "",
                    fechaSalida: "",
                    horaSalida: "",
                    fechaLlegada: "",
                    horaLlegada: "",
                  });
                }}
                label="Agregar"
                variant="success"
              />
            </div>

            <LabelTitle text="CRONOGRAMA DE ACTIVIDADES" />
            
            <LabelText
              text="Incluir desde la fecha de salida del país y días de traslado
              hasta el día de llegada al destino. <br />
              Hasta incluir la fecha de llegada al país."
            />
            <table className="activity-schedule-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Descripción de la Actividad a Realizar</th>
                </tr>
              </thead>
              <tbody>
                {rangoFechas.map((fecha, index) => (
                  <tr key={index}>
                    <td>
                      {/* Campo de fecha de solo lectura */}
                      <input
                        type="date"
                        id={`fechaInmutable-${index}`}
                        className="form-input"
                        {...register(`actividadesInmutables[${index}].fecha`, {
                          required: "Este campo es requerido",
                        })}
                        value={fecha} // Valor predefinido de la fecha
                        readOnly
                      />
                      {errors.actividadesInmutables &&
                        errors.actividadesInmutables[index]?.fecha && (
                          <span className="error-text">
                            {errors.actividadesInmutables[index].fecha.message}
                          </span>
                        )}
                    </td>
                    <td>
                      {/* Campo de descripción editable */}
                      <input
                        type="text"
                        id={`descripcionInmutable-${index}`}
                        className="form-input"
                        {...register(`actividadesInmutables[${index}].descripcion`, {
                          required: "Este campo es requerido",
                        })}
                        placeholder="Describe la actividad a realizar"
                      />
                      {errors.actividadesInmutables &&
                        errors.actividadesInmutables[index]?.descripcion && (
                          <span className="error-text">
                            {errors.actividadesInmutables[index].descripcion.message}
                          </span>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Label text="Justificación del la salida de campo y de muestreo" />
            <InputTextArea
              name="objetivoViaje"
              label="Objetivo, resultado o producto de la salida de campo y de muestreo."
              infoText="Detalle de productos a ser alcanzados en la salida de campo y de muestreo."
              rules={{ required: "Este campo es requerido" }}
              disabled={false}
            />

            {/* Nombre del banco */}
            <InputText
              name="nombreBanco"
              label="Nombre del banco:"
              rules={{
                required: habilitarCampos ? "Este campo es requerido" : false,
              }}
              disabled={!habilitarCampos}
            />

            {/* Tipo de cuenta */}
            <InputSelect
              name="tipoCuenta"
              label="Tipo de cuenta:"
              options={[
                { value: "Ahorros", label: "Ahorros" },
                { value: "Corriente", label: "Corriente" },
              ]}
              rules={{
                required: habilitarCampos ? "Este campo es requerido" : false,
              }}
              disabled={!habilitarCampos}
            />

            {/* Número de cuenta */}
            <InputText
              name="numeroCuenta"
              label="No. De cuenta:"
              rules={{
                required: habilitarCampos ? "Este campo es requerido" : false,
              }}
              disabled={!habilitarCampos}
            />

          </div>
           {/* Botón para enviar el formulario */}
           <Row className="mt-4">
            <Col className="text-center">
              <Button id="btn_enviar" type="submit" variant="primary">
                Enviar
              </Button>
            </Col>
          </Row>

          {showDownloadSection && (
            <div className="mt-4">
              <Row className="justify-content-center">
                <Col md={4} className="text-center">
                  <DownloadButton
                    onClick={handleGenerateDocx}
                    icon="IconWord.png"
                    altText="Word Icon"
                    label="Descargar Memorando"
                  />
                </Col>
                <Col md={4} className="text-center">
                  <DownloadButton
                    onClick={handleGeneratePdf2}
                    icon="IconPdf.png"
                    altText="PDF Icon"
                    label="Descargar Anexo 7"
                  />
                </Col>
              </Row>
            </div>
          )}


          <Row className="mt-4">
            <Col className="text-center">
              <ActionButton
                onClick={handleClearForm}
                label="Limpiar Formulario"
                variant="danger"
              />
            </Col>
          </Row>
        </Form>
      </Container>
    </FormProvider>
  );
}
const rolesOptions = [
  { value: "Director", label: "Director" },
  { value: "Codirector", label: "Codirector" },
  { value: "Colaborador", label: "Colaborador" },
];
const departamentoOptions = [
  {
    value: "DEPARTAMENTO DE AUTOMATIZACIÓN Y CONTROL INDUSTRIAL",
    label: "DEPARTAMENTO DE AUTOMATIZACIÓN Y CONTROL INDUSTRIAL",
  },
  {
    value: "DEPARTAMENTO DE BIOLOGÍA",
    label: "DEPARTAMENTO DE BIOLOGÍA",
  },
  {
    value: "DEPARTAMENTO DE CIENCIAS ADMINISTRATIVAS",
    label: "DEPARTAMENTO DE CIENCIAS ADMINISTRATIVAS",
  },
  {
    value: "DEPARTAMENTO DE CIENCIAS DE ALIMENTOS Y BIOTECNOLOGÍA",
    label: "DEPARTAMENTO DE CIENCIAS DE ALIMENTOS Y BIOTECNOLOGÍA",
  },
  {
    value: "DEPARTAMENTO DE CIENCIAS NUCLEARES",
    label: "DEPARTAMENTO DE CIENCIAS NUCLEARES",
  },
  {
    value: "DEPARTAMENTO DE CIENCIAS SOCIALES",
    label: "DEPARTAMENTO DE CIENCIAS SOCIALES",
  },
  {
    value: "DEPARTAMENTO DE ECONOMÍA CUANTITATIVA",
    label: "DEPARTAMENTO DE ECONOMÍA CUANTITATIVA",
  },
  {
    value:
      "DEPARTAMENTO DE ELECTRÓNICA, TELECOMUNICACIONES Y REDES DE LA INFORMACIÓN",
    label:
      "DEPARTAMENTO DE ELECTRÓNICA, TELECOMUNICACIONES Y REDES DE LA INFORMACIÓN",
  },
  {
    value: "DEPARTAMENTO DE ENERGÍA ELÉCTRICA",
    label: "DEPARTAMENTO DE ENERGÍA ELÉCTRICA",
  },
  {
    value: "DEPARTAMENTO DE ESTUDIOS ORGANIZACIONALES Y DESARROLLO HUMANO",
    label: "DEPARTAMENTO DE ESTUDIOS ORGANIZACIONALES Y DESARROLLO HUMANO",
  },
  {
    value: "DEPARTAMENTO DE FÍSICA",
    label: "DEPARTAMENTO DE FÍSICA",
  },
  {
    value: "DEPARTAMENTO DE FORMACIÓN BÁSICA",
    label: "DEPARTAMENTO DE FORMACIÓN BÁSICA",
  },
  {
    value: "DEPARTAMENTO DE GEOLOGÍA",
    label: "DEPARTAMENTO DE GEOLOGÍA",
  },
  {
    value: "DEPARTAMENTO DE INFORMÁTICA Y CIENCIAS DE LA COMPUTACIÓN",
    label: "DEPARTAMENTO DE INFORMÁTICA Y CIENCIAS DE LA COMPUTACIÓN",
  },
  {
    value: "DEPARTAMENTO DE INGENIERIA CIVIL Y AMBIENTAL",
    label: "DEPARTAMENTO DE INGENIERIA CIVIL Y AMBIENTAL",
  },
  {
    value: "DEPARTAMENTO DE INGENIERÍA MECÁNICA",
    label: "DEPARTAMENTO DE INGENIERÍA MECÁNICA",
  },
  {
    value: "DEPARTAMENTO DE INGENIERÍA QUÍMICA",
    label: "DEPARTAMENTO DE INGENIERÍA QUÍMICA",
  },
  {
    value: "DEPARTAMENTO DE MATERIALES",
    label: "DEPARTAMENTO DE MATERIALES",
  },
  {
    value: "DEPARTAMENTO DE MATEMÁTICA",
    label: "DEPARTAMENTO DE MATEMÁTICA",
  },
  {
    value: "DEPARTAMENTO DE METALURGIA EXTRACTIVA",
    label: "DEPARTAMENTO DE METALURGIA EXTRACTIVA",
  },
  {
    value: "DEPARTAMENTO DE PETRÓLEOS",
    label: "DEPARTAMENTO DE PETRÓLEOS",
  },
  {
    value: "INSTITUTO GEOFISICO",
    label: "INSTITUTO GEOFISICO",
  },
];
export default SamplingTripWithinProjectForm;
