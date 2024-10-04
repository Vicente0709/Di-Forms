import React, { useState, useEffect } from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { Container, Button, Row, Col, Form } from "react-bootstrap";
import JSZip from "jszip";
import { saveAs } from "file-saver";
// Importación de los componentes del formulario
import Label from "../components/Labels/Label.js";
import LabelTitle from "../components/Labels/LabelTitle.js";
import LabelText from "../components/Labels/LabelText.js";
import InputSelect from "../components/Inputs/InputSelect.js";
import InputText from "../components/Inputs/InputText.js";
import InputTextArea from "../components/Inputs/InputTextArea.js";
import InputDate from "../components/Inputs/InputDate.js";
import RadioGroup from "../components/Inputs/RadioGroup.js";
import ActionButton from "../components/Buttons/ActionButton.js";
import DownloadButton from "../components/Buttons/DownloadButton.js";
import today from "../utils/date.js";

// Importación de las funciones para generar documentos

import {
  generateMemoNationalOutsideProject1,
  generateMemoNationalOutsideProject2,
  generateAnexo10NationalOutsideProject,
  generateAnexoANationalOutsideProject,
} from "../utils/generatorDocuments/event/nationalEventDocuments.js";
import { validarCedulaEcuatoriana, validarFechaFin, validateFechaLlegadaIda, validateFechaSalidaRegreso } from "../utils/validaciones.js";

const formStorageKey = "formNationalOutsideProject"; // Clave para almacenar el formulario en localStorage
const formData = JSON.parse(sessionStorage.getItem(formStorageKey)) || {}; // Datos del formulario desde localStorage

function ExternalNationalEventsForm() {
  
  // Configuración del formulario con react-hook-form y valores predeterminados desde localStorage
  const methods = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: formData,
  });

 
  const { register, control, watch, reset, setValue, clearErrors, formState:{errors} } = methods;

  const { fields: fieldsIda, append: appendIda, remove: removeIda } = useFieldArray({ control, name: "transporteIda"});
  const { fields: fieldsRegreso, append: appendRegreso, remove: removeRegreso} = useFieldArray({ control, name: "transporteRegreso"});
  const { fields, append, remove } = useFieldArray({ control, name: "inscripciones"});

  // Observadores para los cambios en los campos del formulario
  const seleccionArticulo = watch("articuloPublicado");
  const fechaInicioEvento = watch("fechaInicioEvento");
  const fechaFinEvento = watch("fechaFinEvento");
  const hospedaje = watch("hospedaje"); 
  const inscripcion=watch("inscripcion");
  const movilizacion = watch("movilizacion");
  const alimentacion = watch("alimentacion");
  const seleccionViaticosSubsistencias = watch("viaticosSubsistencias");
  const habilitarCampos = seleccionViaticosSubsistencias === "SI";
  const metodoPago = watch("metodoPago");
  
  const [showDownloadSection, setShowDownloadSection] = useState(false);
  const [seleccionInscripcion, setSeleccionInscripcion] = useState("");
  const [showInputArticulo, setShowInputArticulo] = useState(false);

  // Efecto para manejar la visibilidad de secciones y limpieza de campos
  useEffect(() => {
    // Manejar la lógica para mostrar/ocultar el campo de detalle del artículo
    setShowInputArticulo(seleccionArticulo === "SI");
    if (seleccionArticulo !== "SI") {
      setValue("detalleArticuloSI", "");
    }

    // Lógica para la selección de la declaración según los rubros
    if (hospedaje === "SI" || movilizacion === "SI" || alimentacion === "SI") {
      setValue("seleccionDeclaracion", "siCubre");
    } else if (hospedaje === "NO" && movilizacion === "NO" && alimentacion === "NO") {
      setValue("seleccionDeclaracion", "noCubre");
    }

    // Manejar la habilitación o limpieza de campos bancarios según la selección de viáticos
    if (!habilitarCampos) {
      setValue("nombreBanco", "");
      setValue("tipoCuenta", "");
      setValue("numeroCuenta", "");
      clearErrors(["nombreBanco", "tipoCuenta", "numeroCuenta"]);
    }

    if(inscripcion === "SI"){
      setSeleccionInscripcion(true);
    }else{
      setSeleccionInscripcion(false);
      setValue("inscripciones")
    }

    if (fields.length === 0) {
      append({
        valorInscripcion: "",
        pagoLimite: "",
        limiteFecha: "",
      });
    }


  }, [seleccionArticulo, hospedaje, movilizacion, alimentacion, habilitarCampos,inscripcion, append, fields.length, setValue, clearErrors]);

  

  // Función que se ejecuta al enviar el formulario
  const onSubmitNationalOutside = (data) => {
    console.log(data);
    setShowDownloadSection(true);
    console.log(methods.getValues());
  };

  // Función para descargar el formulario como JSON
  const handleDownloadJson = () => {
    const data = methods.getValues(); // Obtiene los datos actuales del formulario
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Participación Nacional Fuera de Proyectos.json"; // Nombre del archivo
    link.click();
  };

  // Función para cargar un archivo JSON y rellenar el formulario
  const handleUploadJson = (event) => {
    const file = event.target.files[0];  // Verificar si hay archivo
    if (file) {
      const reader = new FileReader();  // Inicializa el FileReader para leer el archivo
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target.result);  // Parsear el archivo JSON
  
          // Reset del formulario con los datos del JSON
          reset(json, {
            keepErrors: false,
            keepDirty: false,
            keepValues: false,
            keepTouched: false,
            keepIsSubmitted: false,
          });
  
          // Actualizar localStorage con los datos cargados
          sessionStorage.setItem(formStorageKey, JSON.stringify(json));
        } catch (err) {
          console.error("Error al cargar el archivo JSON:", err);
        }
      };
      reader.readAsText(file);  // Leer el archivo como texto
    }
  };

  const handleGenerateMemo1 = () => {
   const formNationalOutsideProject = methods.getValues();
    generateMemoNationalOutsideProject1(formNationalOutsideProject);
    setShowDownloadSection(false);
  };

  const handleGenerateMemo2 = () => {
    const formNationalOutsideProject = methods.getValues();
    generateMemoNationalOutsideProject2(formNationalOutsideProject);
    setShowDownloadSection(false);
  };

  const handleGeneratePdf = () => {
    const formNationalOutsideProject= methods.getValues();
    generateAnexoANationalOutsideProject(formNationalOutsideProject);
    setShowDownloadSection(false);
  };

  const handleGeneratePdf2 = () => {
    const formNationalOutsideProject = methods.getValues();
    generateAnexo10NationalOutsideProject(formNationalOutsideProject);
    setShowDownloadSection(false);
  };
  

  // Función para descargar todos los documentos

  const handleDownloadAll = async() => {
    const formData = methods.getValues();
    const docxBlob1 = await generateMemoNationalOutsideProject1(formData,true);
    const docxBlob2 = await generateMemoNationalOutsideProject2(formData,true);
    const pdfBlob1 = await generateAnexoANationalOutsideProject(formData,true);
    const pdfBlob2 = await generateAnexo10NationalOutsideProject(formData,true);
    const zip = new JSZip();

    zip.file(`Memorando para Jefe del Departamento al VIIV.docx`, docxBlob1);
    zip.file(`Memorando del Profesor al Jefe.docx`, docxBlob2);
    zip.file(`Anexo 10 - Formulario salidas nacionales fuera de proyecto.pdf`, pdfBlob1);
    zip.file(`Anexo 1 - Solicitud de viáticos EPN.pdf`, pdfBlob2);
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "Documentos participacion en eventos nacionales fuera de proyectos.zip");
    setShowDownloadSection(false);
  };

  // Función para limpiar el formulario y resetear datos
  const handleClearForm = () => {
    sessionStorage.removeItem(formStorageKey);
    setShowDownloadSection(false);
    window.location.reload();
  };
  const validarFechaLimiteInscripcion = (index) => {
    const limiteFecha = watch(`inscripciones[${index}].limiteFecha`);
  
    if (limiteFecha && fechaFinEvento && limiteFecha > fechaFinEvento) {
      return `La fecha no puede ser mayor que la fecha de finalización del evento (${fechaFinEvento})`;
    }
  
    return true;
  };



  return (
    <FormProvider {...methods}>
      <Container>
        {/* Título del formulario */}
        <h1 className="text-center my-4">
          Formulario para participacion nacional en eventos fuera de proyectos
        </h1>
        <div className="form-container">
          <Label text="Descargar datos actuales en (.json)"/>
          {/* Botón para descargar el formulario como .json */}
          <ActionButton
            onClick={handleDownloadJson}
            label="Descargar datos como JSON"
            variant="success"
          />
          <Label text="Cargar datos desde archivo (.json)"/>
          {/* Input nativo para cargar un archivo JSON */}
          <input
            type="file"
            accept=".json"
            onChange={handleUploadJson}  // Conectar con la función
            style={{ marginTop: '20px' }}  // Estilos opcionales
          />
        </div>
        <Form
          onSubmit={methods.handleSubmit(onSubmitNationalOutside)}
        >
        
          <div className="form-container">
            <LabelTitle text="Datos Personales" />
            <InputText
              name="nombres"
              label="Nombres del participante"
              placeholder="Juan Sebastian"
              rules={{ required: "Los nombres son requeridos" }}
              disabled={false}
            />

            <InputText
              name="apellidos"
              label="Apellidos del participante"
              placeholder="Perez Ramirez"
              rules={{ required: "Los apellidos son requeridos" }}
              disabled={false}
            />

            <InputText
              name="cedula"
              label="Cédula de ciudadania"
              rules={{
                required: "La cédula es requerida",
                pattern: {
                  value: /^\d{10}$/,
                  message: "La cédula debe contener solo 10 dígitos",
                },
                validate: (value) =>
                  validarCedulaEcuatoriana(value) || "la cédula no es válida",
              }}
              disabled={false}
            />
            
            <InputText
              name="puesto"
              label="Puesto que ocupa"
              infoText="Tal como consta en su acción de personal. Ejemplos: Profesor
              Agregado a Tiempo Completo; Profesor Auxiliar a Tiempo Completo;
              Profesor Principal a Tiempo Completo."
              rules={{ required: "El puesta que ocupa es requerido" }}
              disabled={false}
            />
                
            <InputSelect
              name="departamento"
              label="Departamento / Instituto"
              rules={{ required: "El departamento es requerido" }}
              disabled={false}
              options={departamentoOptions}
            />
            
            <InputText
              name="nombreJefeInmediato"
              label="Nombres y Apellidos del Jefe Inmediato"
              rules={{ required: "El nombre del jefe inmediato es requerido" }}
              disabled={false}
            />
            <InputText
              name="cargoJefeInmediato"
              label="Cargo del Jefe inmediato"
              infoText="Favor colocar el cargo del Jefe inmediato, puede usar las siglas
              para referirse al departamento. Para referirse al departamento. Ejemplo: Jefe del DACI / Jefe del DACI, subrogante"
              rules={{
                required: "El cargo del jefe inmediato es requerido",
            minLength: {
              value: 10,
              message: "El cargo que escribio es demasiado corto",
            },
              }}
            />

            <LabelTitle text="Detalles del evento" />
            <InputText
              name="tituloEvento"
              label="Título del Evento"
              rules={{ required: "El título del evento es requerido" }}
              disabled={false}
            />

            <InputText
              name="ciudadEvento"
              label="Ciudad"
              rules={{ required: "La ciudad del evento es requerida" }}
              disabled={false}
            />

            <InputText
              name="paisEvento"
              label="País"
              defaultValue="Ecuador"
              disabled
            />
            <Label text="Fechas del evento" />
            <InputDate
              name="fechaInicioEvento"
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
              name="fechaFinEvento"
              label="Hasta:"
              rules={{
                required: "La fecha de finalización es requerida",
                validate: (value) =>
                  validarFechaFin(value, watch("fechaInicioEvento")),
                }}
              disabled={false}
            />

            <InputTextArea
              name="RelevanciaAcademica"
              label="Relevancia Académica del evento"
              rules={{
                required: "La relevancia académica del evento es requerida",
              }}
              disabled={false}
            />

            <InputText
              name="tituloPonencia"
              label="Título de la Ponencia"
              rules={{ required: "El título de la ponencia es requerido" }}
              disabled={false}
            />

            <InputText
              name="tipoPonencia"
              label="Tipo de Ponencia"
              placeholder="Plenaria, poster, otros"
              rules={{ required: "El tipo de ponencia es requerido" }}
              disabled={false}
            />

            <RadioGroup
              label="¿El Artículo será publicado?"
              name="articuloPublicado"
              options={articuloOptions}
              rules={{ required: "Indique si el artículo será publicado" }}
              disabled={false}
            />

            {showInputArticulo && (
              <InputText
                name="detalleArticuloSI"
                label="Detalle"
                infoText="Por favor, ingrese el nombre de la revista y base de datos indexadas, 
                el número especial de revista o memorias del evento, 
                la revista o memorias en las cuales se publicará el artículo."
                placeholder="Especifique"
                rules={{
                  required: "El detalle del artículo es requerido",
                }}
                disabled={false}
              />
            )}

            <RadioGroup
              label="Pasajes aéreos"
              name="pasajesAereos"
              options={participarElementosOptions}
              rules={{ required: "Indique si requiere pasajes aéreos" }}
              disable={false}
            />

            <RadioGroup
              label="Viáticos y subsistencias"
              name="viaticosSubsistencias"
              options={participarElementosOptions}
              rules={{
                required: "Indique si requiere viáticos y subsistencias",
              }}
              disabled={false}
            />
            <RadioGroup
              label="Inscripción"
              name="inscripcion"
              options={participarElementosOptions}
              rules={{ required: "Indique si requiere inscripción" }}
              disabled={false}
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
            <LabelText text="Para el ingreso de itinerario de viaje, considere que se puede llegar al destino máximo un día antes del inicio del evento." />

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
                                    value >= today ||
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
                                    value >= today || "La fecha no puede ser menor a la fecha actual",
                                  afterSalida: (value) =>
                                    value >= fechaSalida || "La fecha de llegada debe ser posterior o igual a la fecha de salida",
                                  
                                  // Condicionalmente, aplica la validación de llegada si es el último campo en `fieldsIda`
                                  validateFechaLlegadaIda: (value) =>
                                    index === fieldsIda.length - 1
                                      ? validateFechaLlegadaIda(value, fechaInicioEvento)
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
                    tipoTransporte: "Aéreo",
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
                                    value >= today || "La fecha no puede ser menor a la fecha actual",
                                  validSequence: (value) =>
                                    !fechaLlegadaAnterior ||
                                    value >= fechaLlegadaAnterior ||
                                    "La fecha de salida debe ser posterior a la fecha de llegada anterior",
                                  
                                  // Condicionalmente, aplica la validación de salida si es el primer campo en `fieldsRegreso`
                                  validateRegreso: (value) =>
                                    index === 0 ? validateFechaSalidaRegreso(value, fechaFinEvento) : true,
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
                    tipoTransporte: "Aéreo",
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
             

            {seleccionInscripcion  && (
             <div >
             <h3>• Valor de la inscripción</h3>
             <p>
               Por favor, ingrese las fechas máximas de pago según la información
               proporcionada en la página oficial del evento. Recuerde que solo se debe
               seleccionar una de las tres opciones disponibles para la fecha de pago,
               y asegúrese de que la fecha seleccionada no sea posterior a la fecha de
               inicio del evento.
             </p>
       
             {/* Tabla Dinámica */}
             <div className="scroll-table-container">
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
                         <option value="Hasta el ">
                           Fecha maxima de pago
                         </option>
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
                           validate: () => validarFechaLimiteInscripcion(index),
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
                      <ActionButton
                        onClick={() => remove(index)}
                        label="Eliminar"
                        variant="danger"
                      />
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
             <ActionButton
                onClick={() =>
                  append({
                    valorInscripcion: "",
                    pagoLimite: "",
                    limiteFecha: "",
                  })
                }
                label="Agregar"
                variant="success"
              />
            </div>
            <LabelText text=" Considere que si el pago de inscripción es una moneda diferente a la
               moneda legal del país se requiere un banco intermediario , por lo que se
               solicita se comunique con la organización del evento para obtener esta
               información." />
            <LabelText text="En el caso que no exista banco intermediario se podrá solicitar un pago
               por reembolso siempre y cuando se tenga la contestación oficial de la
               organización de no tener un banco intermediario." />
       
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
                    <LabelText text="En la solicitud se debe adjuntar los siguientes documentos:" />
                    <LabelText text="Formulario de pagos al exterior (Anexo 6)" />
                    <LabelText text="Documento donde se puede verificar el costo y fechas de la inscripción al evento" />
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
                   
                  <Label text="Incluir la siguiente información y documentos:" />
                  <LabelText text="Solicitud de REEMBOLSO. Incluir en el texto del memorando la justificación de por qué se solicita este método de pago." />
                  <LabelText text="Documento donde se puede verificar el costo y fechas de la inscripción al evento" />
                  <LabelText text="Documento en el cual se indique que el pago solo se puede realizar con tarjeta de crédito o efectivo o que no cuenta con banco intermediario." />
                 </div>
               )}
               {errors.metodoPago && (
                 <span className="error-text">{errors.metodoPago.message}</span>
               )}
             </div>
           </div>
            )}
              
              <LabelTitle text="Declaración de gastos, conforme reglamento de viáticos al exterior" />
              <LabelText text=" Selecciona según corresponda. Responda SI aunque la organización del
              evento cubra el rubro parcialmente. "/>
              <LabelText text= "La organización del evento cubre los siguientes rubros:"/>
              
            <RadioGroup
              label="a) Hospedaje"
              name="hospedaje"
              options={participarElementosOptions}
              rules={{ required: "Este campo es requerido" }}
              disabled={false}
            />

            <RadioGroup
              label="b) Movilización interna"
              name="movilizacion"
              options={participarElementosOptions}
              rules={{ required: "Este campo es requerido" }}
              disabled={false}
            />

            <RadioGroup
              label="c) Alimentación"
              name="alimentacion"
              options={participarElementosOptions}
              rules={{ required: "Este campo es requerido" }}
              disabled={false}
            />

            <RadioGroup
              label="Selección de declaración"
              name="seleccionDeclaracion"
              options={declaracionOptions}
              disabled
            />
            {watch("siCubre") && (
            <>
            <LabelText text="En mi calidad de profesor-investigador de la EPN, declaro que la
            Organización del evento SI cubre gastos, por lo que solicito se
            gestione la asignación viáticos conforme se establece en el artículo
            13 del Reglamento de Viáticos al Exterior."/>

            <LabelText text= "**A su regreso el investigador(a) deberá presentar la factura o nota de venta de los gastos de hospedaje y/o alimentación, o de los establecidos en el artículo 9 del Reglamento de Viáticos al Exterior, que no hayan sido cubiertos por estas instituciones u organismos, para el reconocimiento de estos rubros y su correspondiente liquidación."/>
            </>
              )}

            {watch("noCubre") && (
            <LabelText text= "En mi calidad de profesor-investigador de la EPN, declaro que la Organización del evento NO cubre ningún gasto, por lo que solicito se gestione la asignación de viáticos conforme se establece en el artículo 7 del Reglamento de Viáticos al Exterior."/>
          )}

            <LabelTitle text="Cuenta bancaria del servidor para recibir los viáticos"/>
            <LabelText text="Obligatorio si marcó viáticos."/>

            <InputText
            name="nombreBanco"
            label="Nombre del banco"
            rules={{required: habilitarCampos? "Este campo es requerido": false}}
            disabled={!habilitarCampos}
            />

            <InputSelect
              name="tipoCuenta"
              label="Tipo de Cuenta"
              rules={{ required: habilitarCampos? "Este campo es requerido":false }}
              disabled={!habilitarCampos}
              options={tipoCuentaOptions}
            />

            <InputText
            name="numeroCuenta"
            label="No. de Cuenta"
            rules={{required: habilitarCampos? "Este campo es requerido": false}}
            disabled={!habilitarCampos}
            />

            <LabelTitle text= "Serviores que integran los servicios institucionales (opcional)"/>

            <InputTextArea
            name="servidores"
            infoText="Completar esta sección solo en caso de que usted asista al mismo evento junto con otros funcionarios."
            label="Nombre de los funcionarios"
            placeholder="Escriba aquí los nombres de los funcionarios, separados por comas"
            disabled={false}
            />

            <LabelTitle text= "DOCUMENTACIÓN REQUERIDA PARA AUSPICIOS DE SALIDA NACIONAL FUERA DE PROYECTOS"/>
            <Label text= "REQUISITOS:"/>
            <LabelText text="• Formulario de solicitud de autorización para cumplimiento de servicios institucionales."/>
            <LabelText text="• Formulario para salida nacional  fuera de proyectos."/>
            <LabelText text="• Copia de la carta o correo de aceptación de la ponencia y/o poster a ser presentada por el profesor solicitante."/>
            <LabelText text="• Copia de artículo, ponencia o poster aceptado para verificación de autores y afiliación de la EPN."/>
            <LabelText text="• Planificación/cronograma de actividades académicas a recuperar, avaladas por el Jefe o Director de la Unidad Académica del profesor que realizará la salida nacional y del representante estudiantil del curso. O en el caso de que esta actividad se realice fuera del periodo de clases  el aval del Jefe o Director de la Unidad Académica indicando este particular."/>
            <LabelText text="• Documento donde se puede verificar el costo, fechas de la inscripción al evento y fechas de participación en el evento (NO factura/ NO invoice)."/>
            <LabelText text="• Formulario de pagos al exterior, según el caso, incluir el banco intermediario que corresponda o Información de la cuenta bancaria."/>
            <LabelText text="• Quipux del profesor al Jefe o Director de la Unidad Académica solicitando el permiso y aval correspondiente para participar en el evento, deberá detallar todo el requerimiento, viáticos, pasajes, inscripción, de ser el caso."/>
            <LabelText text="• Quipux por parte del Jefe o Director de la Unidad Académica, al Vicerrectorado de Investigación, Innovación y Vinculación, detallando el requerimiento de la salida nacional y auspicio solicitado."/>



          </div>

          {/* Botón para enviar el formulario */}
          <Row className="mt-4">
            <Col className="text-center">
            <Button id="btn_enviar" type="submit" variant="primary">
                Enviar
              </Button>
            </Col>
          </Row>

          {/* Sección de descarga de documentos, visible tras enviar el formulario */}
          {showDownloadSection && (
            <div className="mt-4">
              <Row className="justify-content-center">
                <Col md={4} className="text-center">
                  <DownloadButton
                    onClick={handleGenerateMemo1}
                    label="Descargar Memorando del Jefe del Departamento"
                    icon="IconWord.png"
                  />
                </Col>
                <Col md={4} className="text-center">
                  <DownloadButton
                    onClick={handleGenerateMemo2}
                    label="Descargar Memorando del Profesor al Jefe"
                    icon="IconWord.png"
                  />
                </Col>
                <Col md={4} className="text-center">
                <DownloadButton
                    onClick={handleGeneratePdf}
                    label="Descargar Anexo A"
                    icon="IconPdf.png"
                  />
                </Col>
                <Col md={4} className="text-center">
                  <DownloadButton
                    onClick={handleGeneratePdf2}
                    label="Descargar Anexo 10"
                    icon="IconPdf.png"
                  />
                </Col>
              </Row>

              {/* Botón para descargar todos los documentos */}
              <Row className="mt-3">
                <Col className="text-center">
                  <ActionButton
                  onClick={handleDownloadAll}
                  label="Descargar Todo"
                  variant="success"
                  />
                </Col>
              </Row>
            </div>
          )}

          {/* Botón para limpiar el formulario */}
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
export default ExternalNationalEventsForm;


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

const articuloOptions = [
  {
    value: "SI",
    label: "SI",
  },
  {
    value: "NO",
    label: "NO",
  },
];

const participarElementosOptions = [
  {
    value: "SI",
    label: "SI",
  },
  {
    value: "NO",
    label: "NO",
  },
];

const declaracionOptions = [
  {
    value: "noCubre",
    label: "Declaración si la organización NO cubre ningún rubro",
  },
  {
    value: "siCubre",
    label: "Declaración si la organización SI cubre algún rubro",
  },
];

const tipoCuentaOptions =[
  {
    value:"Ahorros", 
    label:"Ahorros",
  },
  {
    value: "Corriente",
    label: "Corriente",
  },
];