import React, { useState, useEffect,useCallback } from "react";
import { useForm, FormProvider, useFieldArray} from "react-hook-form";
import { Container, Button, Row, Col, Form } from "react-bootstrap";
import JSZip from "jszip";
import { saveAs } from "file-saver";

// Importación de los componentes Props
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

// Importación de las funciones
import today from "../utils/date.js";
import { generateDateRange } from "../utils/dataRange.js";
import { validarCedulaEcuatoriana, validarFechaFin, validateFechaLlegadaIda, validateFechaSalidaRegreso } from "../utils/validaciones.js";
import { generateAnexoAWithinProject, generateMemoWithinProject, generateAnexo2WithinProject } from "../utils/generatorDocuments/event/nationalEventDocuments.js";

//Constaltes globales para el formulario
const formStorageKey = "formNationalWithinProjects";
const daysStorageKey = "diasNationalWithinProjects";

function NationalWithinProjectsForm() {
  const formData = JSON.parse(sessionStorage.getItem(formStorageKey)) || {};
  // Configuración del formulario con react-hook-form y valores predeterminados desde localStorage
  const methods = useForm({ mode: "onChange", reValidateMode: "onChange", defaultValues: formData });
  const { register, control, watch, setValue, reset, clearErrors, formState: { errors }} = methods;
  
  //FielsdArray para tablas de transporte y actividades
  const { fields: fieldsIda, append: appendIda, remove: removeIda } = useFieldArray({ control, name: "transporteIda"});
  const { fields: fieldsRegreso, append: appendRegreso, remove: removeRegreso} = useFieldArray({ control, name: "transporteRegreso"});
  const { fields: immutableFields, replace } = useFieldArray({ control, name: "actividadesInmutables" });
  const { fields, append, remove } = useFieldArray({ control, name: "inscripciones"});
  
  // Observadores de campos
  const rolEnProyecto = watch("rolEnProyecto");
  const seleccionViaticosSubsistencias = watch("viaticosSubsistencias");
  const seleccionInscripcionform = watch("inscripcion");
  const tipoEventoSeleccionado = watch("tipoEvento");
  const participacionEvento = watch("participacionEvento");
  const hospedaje = watch("hospedaje");
  const movilizacion = watch("movilizacion");
  const alimentacion = watch("alimentacion");
  const fechaFinEvento = watch("fechaFinEvento");
  const fechaInicioEvento = watch("fechaInicioEvento");
  const metodoPago = watch("metodoPago");
  
  // Estados derivados de las observaciones
  const habilitarCampos = seleccionViaticosSubsistencias === "SI";
  const habilitarInscripcion = seleccionInscripcionform === "SI";
  
  // Estados locales para mostrar/ocultar campos
  const [loading, setLoading] = useState(false); //para el spinner de carga
  const [showDownloadSection, setShowDownloadSection] = useState(false);
  const [diferenciaEnDias, setDiferenciaEnDias] = useState(0);
  const [showInputDirector, setShowInputDirector] = useState(false);
  const [showOtherEvent, setShowOtherEvent] = useState(false);
  
  const [seleccionInscripcion, setSeleccionInscripcion] = useState("");
  const [fechaInicioEventoActividades, setFechaInicioEvento] = useState("");
  const [fechaFinEventoActividades, setFechaFinEvento] = useState(""); 
  
  // Funciones auxiliares y handler de eventos
  const onSubmitNationalEvent = (data) => {
    setShowDownloadSection(true);
  };

  const handleGenerateDocx = () => {
    const formData = methods.getValues();
    generateMemoWithinProject(formData);
    setShowDownloadSection(false);
  };

  const handleGeneratePdf = () => {
    const formData = methods.getValues();
    generateAnexoAWithinProject(formData);
    setShowDownloadSection(false);
  };

  const handleGeneratePdf2 = () => {
    const formData = methods.getValues();
    generateAnexo2WithinProject(formData);
    setShowDownloadSection(false);
  };

  const handleDownloadAll = async() => {
    setLoading(true); // Activar spinner
    const formData = methods.getValues();
    const jsonBlob = handleDownloadJson(true);
    const docxBlob = await generateMemoWithinProject(formData,true);
    const pdfBlob = await generateAnexoAWithinProject(formData,true);
    const pdfBlob2 = await generateAnexo2WithinProject(formData,true);
    const zip = new JSZip();
    zip.file(`Formulario para participacion en evento Nacional dentro de proyectos.json`, jsonBlob);
    zip.file(`Memorando solicitud para participar en evento académico.docx`, docxBlob);
    zip.file(`Anexo A - Solicitud de Viaticos EPN ${formData.codigoProyecto}.pdf`, pdfBlob);
    zip.file(`Anexo2_Formulario para salidas nacionales ${formData.codigoProyecto}.pdf`, pdfBlob2);
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "Documentos participacion en eventos nacionales dentro de proyectos.zip");
    setLoading(false); // Desactivar
    setShowDownloadSection(false);
  };

  const handleClearForm = () => {
    sessionStorage.removeItem(formStorageKey);
    sessionStorage.removeItem(daysStorageKey);
    setShowDownloadSection(false);
    window.location.reload();
  };
  
  const handleDownloadJson = (returnDocument = false) => {
    const data = methods.getValues();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    if (returnDocument) return blob;
    if (returnDocument) return blob;
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Participación Nacional Dentro de Proyectos.json";
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
  
  const extraerYCalcularFechas = useCallback((formData) => {
    const { transporteIda = [], transporteRegreso = [] } = formData;
    const fechaInicio = transporteIda[0]?.fechaSalida || "";
    const fechaFin = transporteRegreso[transporteRegreso.length - 1]?.fechaLlegada || "";
    calcularDiferenciaEnDias(fechaInicio, fechaFin);
  },[]);

  const calcularDiferenciaEnDias = (fechaInicioString, fechaFinString) => {
    const fechaInicio = new Date(fechaInicioString);
    const fechaFin = new Date(fechaFinString);  
    if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
      setDiferenciaEnDias(0);
      sessionStorage.setItem(daysStorageKey, JSON.stringify({ diferencia: 0 }));
      return;
    }
    const diferenciaEnDias = Math.ceil((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24)) + 1;
    setDiferenciaEnDias(diferenciaEnDias);
    sessionStorage.setItem(daysStorageKey, JSON.stringify({ diferencia: diferenciaEnDias }));
  };

  // Funciones auxiliares
  const limpiarCamposBancarios = useCallback(() => {
    setValue("nombreBanco", "");
    setValue("tipoCuenta", "");
    setValue("numeroCuenta", "");
    clearErrors(["nombreBanco", "tipoCuenta", "numeroCuenta"]);
  },[setValue, clearErrors]);

  const actualizarDeclaracionSegunRubros =  useCallback(( hospedaje, movilizacion, alimentacion ) => {
    if (hospedaje === "SI" || movilizacion === "SI" || alimentacion === "SI") {
      setValue("seleccionDeclaracion", "siCubre");
    } else {
      setValue("seleccionDeclaracion", "noCubre");
    }
  },[setValue]);

  const manejarTablas = useCallback(() => {
    const initialTransporte = {
      tipoTransporte: "Aéreo",
      nombreTransporte: "",
      ruta: "",
      fechaSalida: "",
      horaSalida: "",
      fechaLlegada: "",
      horaLlegada: "",
    };
    if (fields.length === 0) {
      append({
        valorInscripcion: "",
        pagoLimite: "",
        limiteFecha: "",
      });
    }
    if (fieldsIda.length === 0) appendIda(initialTransporte);
    if (fieldsRegreso.length === 0) appendRegreso(initialTransporte);
  },[fieldsIda,fieldsRegreso,fields,append,appendIda,appendRegreso]);

  const validarFechaLimiteInscripcion = (index) => {
    const limiteFecha = watch(`inscripciones[${index}].limiteFecha`);
  
    if (limiteFecha && fechaFinEvento && limiteFecha > fechaFinEvento) {
      return `La fecha no puede ser mayor que la fecha de finalización del evento (${fechaFinEvento})`;
    }
    
    return true;
  };
  
  // UseEffect principal y separado para la suscripción de cambios en el formulario
  useEffect(() => {
    reset(formData);
    setSeleccionInscripcion(formData.inscripcion || "");
    extraerYCalcularFechas(formData);
    
    const subscription = watch((data) => {
      sessionStorage.setItem(formStorageKey, JSON.stringify(data));
      setSeleccionInscripcion(data.inscripcion || "");
      extraerYCalcularFechas(data);
    });
    
    return () => subscription.unsubscribe();
  }, [extraerYCalcularFechas,watch, reset]);
  
  // useEffect para controlar los campos del formulario
  useEffect(() => {
    setValue("paisEvento", "Ecuador"); // Valor por defecto para el país
    manejarTablas();

    if (rolEnProyecto === "Codirector" || rolEnProyecto === "Colaborador") {
      setShowInputDirector(true);
    } else {
      setShowInputDirector(false);
      setValue("nombreDirector", "");
    }

    if (seleccionViaticosSubsistencias === "NO") limpiarCamposBancarios();

    setShowOtherEvent(tipoEventoSeleccionado === "Otro evento académico");
    actualizarDeclaracionSegunRubros(hospedaje, movilizacion, alimentacion);
    

    
    if (diferenciaEnDias < 16) {
      setValue("justificacionComision", "No Aplica")
    }else{
      setValue("justificacionComision", "")
    };
    
    if (fechaInicioEventoActividades && fechaFinEventoActividades) {
      const dates = generateDateRange( fechaInicioEventoActividades, fechaFinEventoActividades );
      const newFields = dates.map((date) => ({ fecha: date, descripcion: "" }));
      replace(newFields);
    }
    
    // Limpiar errores si el usuario selecciona 'Asistencia'
    if (participacionEvento === "Asistencia") {
      setValue("tituloPonencia", "No Aplica");
      clearErrors(["tituloPonencia"]);
    }

    const sincronizarFechasCronogramaActividades = () => {
      const formData = JSON.parse(sessionStorage.getItem(formStorageKey));
      
      if (formData) {
        const fechaInicio = formData.transporteIda?.[0]?.fechaSalida || "";
        const fechaFin = formData.transporteRegreso?.[formData.transporteRegreso.length - 1]?.fechaLlegada || "";
        setFechaInicioEvento(fechaInicio);
        setFechaFinEvento(fechaFin);
      }
      const diferenciaDias = JSON.parse(sessionStorage.getItem(daysStorageKey));
      if (diferenciaDias) setDiferenciaEnDias(diferenciaDias.diferencia);
    };
    
    // Ejecutar todas las funciones necesarias en cada renderización
    
    sincronizarFechasCronogramaActividades();
    const intervalId = setInterval(sincronizarFechasCronogramaActividades, 1000); // Cada 1 segundo
    return () => clearInterval(intervalId);
    
  }, [
    actualizarDeclaracionSegunRubros,
    seleccionViaticosSubsistencias,
    diferenciaEnDias,
    limpiarCamposBancarios,
    manejarTablas,
    replace,
    fields, 
    append,
    rolEnProyecto,
    participacionEvento,
    fechaInicioEventoActividades,
    fechaFinEventoActividades,
    fieldsIda.length,
    fieldsRegreso.length,
    tipoEventoSeleccionado,
    habilitarCampos,
    hospedaje,
    movilizacion,
    alimentacion,
    habilitarInscripcion,
    setValue,
    clearErrors,
  ]);

  return (
    <FormProvider {...methods}>
      <Container>
        <h1 className="text-center my-4">
        Formulario para salidas nacionales dentro de proyectos
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
            className="input-file"
          />
        </div>
        <Form onSubmit={methods.handleSubmit(onSubmitNationalEvent)}>
          <div className="form-container">
            <LabelTitle text="Detalles del Proyecto" disabled={false} />

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
            <LabelTitle text="Datos Personales" disabled={false} />
            <InputText
              name="cedula"
              label="Cédula de ciudadanía"
              rules={{
                required: "La cedula es requerida",
                pattern: {
                  value: /^\d{10}$/,
                  message: "La cedula debe contener solo 10 digitos",
                },
                validate: (value) =>
                  validarCedulaEcuatoriana(value) || "La cedula es invalida",
              }}
              disabled={false}
            />
            <InputText
              name="nombres"
              label="Nombres del participante:"
              placeholder="Juan Sebastian"
              rules={{ required: "Los nombres son requeridos" }}
              disabled={false}
            />

            {/* Apellidos del participante */}
            <InputText
              name="apellidos"
              label="Apellidos del participante:"
              placeholder="Perez Ramirez"
              rules={{ required: "Los apellidos son requeridos" }}
              disabled={false}
            />

            {/* Cargo del participante */}
            <InputText
              name="cargo"
              label="Cargo:"
              placeholder="Profesor Agregado a Tiempo Completo..."
              infoText="Tal como consta en su acción de personal. Ejemplos: Profesor Agregado a Tiempo Completo; Profesor Auxiliar a Tiempo Completo; Profesor Principal a Tiempo Completo."
              rules={{ required: "El cargo es requerido" }}
              disabled={false}
            />

            {/* Rol en el proyecto */}
            <InputSelect
              name="rolEnProyecto"
              label="Rol en el proyecto:"
              options={rolesOptions}
              rules={{ required: "El rol en el proyecto es requerido" }}
              disabled={false}
            />

            {/* Nombre del Director (si es necesario) */}
            {showInputDirector && (
              <InputText
                name="nombreDirector"
                label="Nombre del Director del proyecto:"
                rules={{ required: "El nombre del Director es requerido" }}
                disabled={false}
              />
            )}

            {/* Departamento / Instituto */}
            <InputSelect
              name="departamento"
              label="Departamento / Instituto:"
              options={departamentoOptions}
              rules={{ required: "El departamento es requerido" }}
              disabled={false}
            />

            {/* Nombres y apellidos del Jefe inmediato */}
            <InputText
              name="nombreJefeInmediato"
              label="Nombres y apellidos del Jefe inmediato:"
              rules={{ required: "El nombre del jefe inmediato es requerido" }}
              disabled={false}
            />

            {/* Cargo del Jefe inmediato */}
            <InputText
              name="cargoJefeInmediato"
              label="Cargo del Jefe inmediato:"
              placeholder="Jefe del DACI, subrogante"
              infoText="Favor colocar el cargo del Jefe inmediato, puede usar las siglas para referirse al departamento. Ejemplo: Jefe del DACI / Jefe del DACI, subrogante"
              rules={{
                required: "El cargo del jefe inmediato es requerido",
                minLength: {
                  value: 10,
                  message: "El cargo que escribio es demasiado corto",
                },
              }}
              disabled={false}
            />

            <LabelTitle
              text="Datos Del Evento y Requerimientos "
              disabled={false}
            />

            <InputText
              name="tituloEvento"
              label="Título del evento:"
              rules={{
                required: "El título del evento es requerido",
              }}
              disabled={false}
            />

            <LabelText text="Lugar del evento:" />

            <InputText
              name="ciudadEvento"
              label="Ciudad:"
              rules={{
                required: "La ciudad del evento es requerida",
              }}
              disabled={false}
            />

            <InputText
              name="paisEvento"
              label="País:"
              rules={{
                required: "El país del evento es requerido",
              }}
              defaultValue="Ecuador"
              disabled={true}
            />

            <LabelText text="Fechas del evento:" />

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
                required: "La fecha de fin del evento es requerida",
                validate: (value) =>
                  validarFechaFin(value, watch("fechaInicioEvento")),
              }}
              disabled={false}
            />
            <RadioGroup
              name="presentacionPonencia"
              label="¿Va a realizar la presentación de una ponencia? "
              options={[
                { value: "SI", label: "SI" },
                { value: "NO", label: "NO" },
              ]}
              rules={{
                required:
                  "Indique si se va a realizar la presentación de una ponencia",
              }}
            />

            <RadioGroup
              name="tipoEvento"
              label="Tipo de evento:"
              options={eventTypeOptions}
              rules={{ required: "El tipo de evento es requerido" }}
            />

            {showOtherEvent && (
              <InputText
                name="otroEventoEspecificar"
                label="Especifique el otro evento académico:"
                placeholder="Especifique"
                rules={{
                  required: "Por favor especifique el otro evento académico",
                }}
              />
            )}
            <RadioGroup
              name="participacionEvento"
              label="Participación en el evento:"
              options={participationOptions}
              rules={{ required: "Seleccione una opción" }}
            />

            {/* Título de la ponencia */}
            <InputText
              name="tituloPonencia"
              label="Título de la Ponencia:"
              rules={{
                required: "El título de la ponencia es requerido",
              }}
              defaultValue="No Aplica" // Valor por defecto si está deshabilitado
              disabled={participacionEvento === "Asistencia"}
            />
            <Label text="Solicita para participar en el evento:" />
            {/* Pasajes aéreos */}
            <RadioGroup
              name="pasajesAereos"
              label="Pasajes aéreos:"
              options={pasajesAereosOptions}
              rules={{ required: "Indique si requiere pasajes aéreos" }}
            />

            {/* Viáticos y subsistencias */}
            <RadioGroup
              name="viaticosSubsistencias"
              label="Viáticos y subsistencias:"
              options={viaticosOptions}
              rules={{
                required: "Indique si requiere viáticos y subsistencias",
              }}
            />

            {/* Inscripción */}
            <RadioGroup
              name="inscripcion"
              label="Inscripción:"
              options={inscripcionOptions}
              rules={{ required: "Indique si requiere inscripción" }}
            />

            <LabelTitle
              text="JUSTIFICACIÓN Y RELEVANCIA DE LA PARTICIPACIÓN"
              disabled={false}
            />

            {/* 3.1 Objetivo, resultado o producto del proyecto */}
            <InputTextArea
              name="objetivoProyecto"
              label="Objetivo, resultado o producto del proyecto al que aporta la participación en el evento"
              placeholder="Escriba textualmente el objetivo, resultado o producto del proyecto."
              rules={{
                required: "Este campo es requerido",
                validate: (value) =>
                  value.length >= 50 ||
                  "La descripción está muy corta. Debe tener al menos 50 caracteres.",
              }}
              infoText="Esta información debe ser tomada de la propuesta aprobada."
              disabled={false}
            />

            {/* 3.2 Relevancia del evento para su proyecto */}
            <InputTextArea
              name="relevanciaEvento"
              label="Relevancia del evento para su proyecto relacionado con el objetivo, resultado o producto del punto anterior"
              placeholder="Describa la relevación del evento y aporte al cumplimiento del objetivo, resultado o producto."
              rules={{
                required: "Este campo es requerido",
                validate: (value) =>
                  value.length >= 50 ||
                  "La descripción está muy corta. Debe tener al menos 50 caracteres.",
              }}
              infoText="Describa la relevancia del evento y aporte al cumplimiento del objetivo."
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
                                    value >= today() || "La fecha no puede ser menor a la fecha actual",
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
                                    value >= today() ||
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

            {diferenciaEnDias>15 && (
              <div>
                <LabelTitle text="CRONOGRAMA DE ACTIVIDADES" />
                <LabelText
                  text="Incluir desde la fecha de salida del país y días de traslado
                  hasta el día de llegada al destino. <br />
                  Hasta incluir la fecha de llegada al país."
                />

                {/* Tabla de actividades inmutables */}
                <LabelText text="Fechas del Evento" />
                <table className="activity-schedule-table">
                  <thead>
                    <tr>
                      <th>Nro.</th>
                      <th>Fecha</th>
                      <th>Descripción de la Actividad a Realizar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {immutableFields.map((field, index) => (
                      <tr key={field.id}>
                        <td>
                          <input
                            type="number"
                            value={index + 1} // Asigna el número basado en el índice (1, 2, 3, etc.)
                            readOnly
                            className="form-input"
                          />
                        </td>
                        <td>
                          <input
                            type="date"
                            id={`fechaInmutable-${index}`}
                            className="form-input"
                            {...register(
                              `actividadesInmutables[${index}].fecha`,
                              {
                                required: "Este campo es requerido",
                              }
                            )}
                            readOnly // Campo de fecha de solo lectura
                          />
                          {errors.actividadesInmutables &&
                            errors.actividadesInmutables[index]?.fecha && (
                              <span className="error-text">
                                {
                                  errors.actividadesInmutables[index].fecha
                                    .message
                                }
                              </span>
                            )}
                        </td>
                        <td>
                          <input
                            type="text"
                            id={`descripcionInmutable-${index}`}
                            className="form-input"
                            {...register(
                              `actividadesInmutables[${index}].descripcion`,
                              {
                                required: "Este campo es requerido",
                              }
                            )}
                            placeholder="Describe la actividad a realizar"
                          />
                          {errors.actividadesInmutables &&
                            errors.actividadesInmutables[index]
                              ?.descripcion && (
                              <span className="error-text">
                                {
                                  errors.actividadesInmutables[index]
                                    .descripcion.message
                                }
                              </span>
                            )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {diferenciaEnDias >15 && (
              <div>
                <LabelTitle
                  text=" Justificar la necesidad de la comisión de servicios mayor
                  a 15 días"
                />
                <LabelText
                  text="Completar esta sección solo en caso de que la participación al
                  evento requiera más de quince días de comisión de servicio."
                />
                <InputTextArea
                  name="justificacionComision"
                  label="Justificación de la comisión de servicios mayor a 15 días"
                  placeholder="Escriba aquí la justificación."
                  rules={{
                    required: "Este campo es requerido",
                  }}
                  disabled={diferenciaEnDias <= 15}
                  defaultValue="No Aplica"
                />
              </div>
            )}

            {seleccionInscripcion === "SI" && 
             
             <div >
             <LabelTitle text="Valor de la Inscripción" />
             <LabelText text=" Por favor, ingrese las fechas máximas de pago según la información proporcionada 
             en la página oficial del evento. Recuerde que solo se debe seleccionar una de las tres opciones disponibles 
             para la fecha de pago, y asegúrese de que la fecha seleccionada no sea posterior a la fecha deinicio del evento."/>
             {/* Tabla Dinámica */}
             <div className="scroll-table-container">
             <table className="payment-table">
               <thead>
               <tr>
                   <th>Nro.</th>
                   <th>Moneda</th>
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
                       <select
                         id="monedaPago"
                         {...register(`inscripciones[${index}].monedaPago`, {
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
                    <LabelText text="Formulario de pagos al exterior (Anexo 4)" />
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
                 </div>
               )}
               {errors.metodoPago && (
                 <span className="error-text">{errors.metodoPago.message}</span>
               )}
             </div>
           </div>
            }
            


            <LabelTitle
              text="CUENTA BANCARIA DEL SERVIDOR PARA RECIBIR LOS VIÁTICOS"
              disabled={false}
            />
            <LabelText text="Obligatorio si marcó viáticos" />

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
                { value: "", label: "Seleccione" },
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

            <LabelTitle
              text="SERVIDORES QUE INTEGRAN LOS SERVICIOS INSTITUCIONALES (opcional)"
              disabled={false}
            />
            <LabelText text="Completar esta sección solo en caso de que usted asista al mismo evento junto con otros funcionarios." />

            {/* Nombre de los funcionarios */}
            <InputTextArea
              name="servidores"
              label="Nombre de los funcionarios:"
              placeholder="Escriba aquí los nombres de los funcionarios, separados por comas"
              rules={{ required: false }} // Este campo es opcional
              infoText="Escriba los nombres separados por comas."
            />

            <LabelTitle
              text="DOCUMENTACIÓN REQUERIDA PARA AUSPICIOS AL EXTERIOR"
              disabled={false}
            />

            <Label text="REQUISITOS:" />

            {/* Documentos de Requisito */}
            <LabelText text="• Formulario de solicitud de autorización para cumplimiento de servicios institucionales." />
            <LabelText text="• Formulario para salida nacional dentro de proyectos." />
            <LabelText text="• Copia de la carta o correo de aceptación de la ponencia y/o poster a ser presentado, o copia del documento de registro en el evento, o copia de la carta de invitación de la organización del evento." />
            <LabelText text="• Copia del artículo, ponencia o poster, cuando aplique, aceptado para verificación de autores y afiliación de la EPN" />
            <LabelText text="• Planificación/cronograma de actividades académicas a recuperar, avaladas por el Jefe o Director de la Unidad Académica del profesor que realizará la salida nacional y del representante estudiantil del curso. O En el caso de que esta actividad se realice fuera del periodo de clases el aval del Jefe o Director de la Unidad Académica indicando este particular." />
            <LabelText text="• Documento donde se puede verificar el costo y fechas de la inscripción (NO factura/ NO invoice)." />
            <LabelText text="• Formulario de pagos al exterior, según el caso, incluir el banco intermediario que corresponda o Información de la cuenta bancaria." />
            <LabelText text="• Quipux por parte del Director del Proyecto al Vicerrectorado de Investigación, Innovación y Vinculación detallando el requerimiento de la salida nacional." />
            
            <Label text="RECUERDE" />
            <LabelText text="* A su regreso el investigador(a) deberá presentar la factura o nota de venta de los gastos de hospedaje y/o alimentación, mismos que deberán justificar el 70% del valor del viatico, caso contrario la diferencia deberá ser reintegrada a la cuenta de la EOD-UGIPS. (Norma Técnica para el pago de viáticos Artículo 15 Control y liquidación)
 
" />

            {/* Fin del formulario */}
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
                    onClick={handleGenerateDocx}
                    label="Descargar Memorando"
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
                    label="Descargar Anexo 2"
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
                    loading={loading} // Usar el prop loading
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
// Opciones para roles
const rolesOptions = [
  { value: "Director", label: "Director" },
  { value: "Codirector", label: "Codirector" },
  { value: "Colaborador", label: "Colaborador" },
];

// Opciones para tipo de departamento
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

//opciones para tipo de evento
const eventTypeOptions = [
  { label: "Conferencia o congreso", value: "Conferencia o congreso" },
  { label: "Taller", value: "Taller" },
  { label: "Otro evento académico", value: "Otro evento académico" },
];

// Opciones para el radio group de participación en el evento
const participationOptions = [
  {
    label: "Presentación de artículo indexado",
    value: "Presentación de artículo indexado",
  },
  {
    label: "Presentación de póster, abstract, charla magistral u otros",
    value: "Presentación de póster, abstract, charla magistral u otros",
  },
  { label: "Asistencia", value: "Asistencia" },
];

// Opciones para pasajes aéreos
const pasajesAereosOptions = [
  { label: "SI", value: "SI" },
  { label: "NO", value: "NO" },
];

// Opciones para viáticos y subsistencias
const viaticosOptions = [
  { label: "SI", value: "SI" },
  { label: "NO", value: "NO" },
];

// Opciones para inscripción
const inscripcionOptions = [
  { label: "SI", value: "SI" },
  { label: "NO", value: "NO" },
];

export default NationalWithinProjectsForm;

