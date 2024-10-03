import React, { useState, useEffect, useCallback } from "react";
import { useForm, FormProvider,useFieldArray} from "react-hook-form";
import { Container, Button, Row, Col, Form } from "react-bootstrap";

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

// Importación de funciones 
import { generateDateRange } from "../utils/dataRange.js";
import today from "../utils/date.js";
import {validarCedulaEcuatoriana, validarFechaFin, validateFechaLlegadaIda, validateFechaSalidaRegreso} from "../utils/validaciones.js";
import { generateAnexoATripWithingProject, generateMemoTripWithinProjec1, generateMemoTripWithinProjec2, generateAnexoB2WithinProject } from "../utils/documentGenerator.js";

//Constantes globales para el formulario
const formStorageKey = "formTechnicalTripWithinProjects";
const daysStorageKey = "diferenciaDiasViajeTecnicoDeProyectos";
const formTechnicalTripWithinProjects = JSON.parse(localStorage.getItem(formStorageKey)) || {};

function InternationalTechnicalTrips() {
  
  // Configuración del formulario con react-hook-form y valores predeterminados desde localStorage
  const methods = useForm({ mode: "onChange", reValidateMode: "onChange", defaultValues: formTechnicalTripWithinProjects });
  const {register,control, watch, setValue, reset, clearErrors, formState: { errors },} = methods;
  
  //FielsdArray para tablas de transporte y actividades
  const { fields: fieldsIda, append: appendIda, remove: removeIda } = useFieldArray({ control, name: "transporteIda"});
  const { fields: fieldsRegreso, append: appendRegreso, remove: removeRegreso} = useFieldArray({ control, name: "transporteRegreso"});
  const { fields: immutableFields, replace } = useFieldArray({ control, name: "actividadesInmutables" });
  

  // Visualizadores con watch
  const rolEnProyecto = watch("rolEnProyecto");
  const seleccionViaticosSubsistencias = watch("viaticosSubsistencias");
  const fechaFinEvento = watch("fechaFinEvento");
  const fechaInicioEvento = watch("fechaInicioEvento");

  // Estados derivados de las observaciones
  const habilitarCampos = seleccionViaticosSubsistencias === "SI";
  
  // Manejadores de estado para showSections
  const [showDownloadSection, setShowDownloadSection] = useState(false);
  const [showInputDirector, setShowInputDirector] = useState(false);
  const [diferenciaEnDias, setDiferenciaEnDias] = useState(0);
  const [showInputJustificacion, setshowInputJustificacion] = useState(false);

  const [fechaInicioEventoActividades, setFechaInicioEvento] = useState("");
  const [fechaFinEventoActividades, setFechaFinEvento] = useState(""); 
  
  // Funciónes auxiliares y handlers para eventos
  const onSubmitTechnicalTrip = (data) => {
    console.log(data);
    setShowDownloadSection(true);
  };

  const handleGenerateDocx = () => {
    const formTripWothinProject = methods.getValues();
    if (formTripWothinProject.rolEnProyecto === "Director") {
      generateMemoTripWithinProjec1(formTripWothinProject);
      setShowDownloadSection(false);
    }
    if (
      formTripWothinProject.rolEnProyecto === "Codirector" ||
      formTripWothinProject.rolEnProyecto === "Colaborador"
    ) {
      generateMemoTripWithinProjec2(formTripWothinProject);
      setShowDownloadSection(false);
    }
  };

  const handleGeneratePdf = () => {
    const formTripWothinProject = methods.getValues();
    generateAnexoATripWithingProject(formTripWothinProject);
    setShowDownloadSection(false);
  };

  const handleGeneratePdf2 = () => {
    const formTripWothinProject = methods.getValues();
    generateAnexoB2WithinProject(formTripWothinProject);
    setShowDownloadSection(false);
  };

  const handleDownloadAll = () => {
    console.log("Descargando todos los documentos");
    const formTripWothinProject = methods.getValues();
    handleGenerateDocx(formTripWothinProject);
    handleGeneratePdf(formTripWothinProject);
    handleGeneratePdf2(formTripWothinProject);
  };

  const handleClearForm = () => {
    localStorage.removeItem(formStorageKey);
    localStorage.removeItem(daysStorageKey);
    setShowDownloadSection(false);
    window.location.reload();
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
      localStorage.setItem(daysStorageKey, JSON.stringify({ diferencia: 0 }));
      return;
    }
    const diferenciaEnDias = Math.ceil((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24)) + 1;
    setDiferenciaEnDias(diferenciaEnDias);
    localStorage.setItem(daysStorageKey, JSON.stringify({ diferencia: diferenciaEnDias }));
  };

  const handleDownloadJson = () => {
    const data = methods.getValues();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Viajes Técnicos Dentro de Proyectos.json";
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
          localStorage.setItem(formStorageKey, JSON.stringify(json));
        } catch (err) {
          console.error("Error al cargar el archivo JSON:", err);
        }
      };
      reader.readAsText(file);
    }
  };
  
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
    if (fieldsIda.length === 0) appendIda(initialTransporte);
    if (fieldsRegreso.length === 0) appendRegreso(initialTransporte);
  },[appendIda,appendRegreso,fieldsIda,fieldsRegreso]);
  
  // Efecto para sincronizar con localStorage
  useEffect(() => {
    reset(formTechnicalTripWithinProjects);
    extraerYCalcularFechas(formTechnicalTripWithinProjects);

    // Suscribirse a los cambios en el formulario en tiempo real.
    const subscription = watch((data) => {
      localStorage.setItem(formStorageKey, JSON.stringify(data));
      extraerYCalcularFechas(data);
    });
    return () => subscription.unsubscribe();
  }, [extraerYCalcularFechas, watch, reset]);
  
  //aqui el use efect donde van todo a el control de las validaciones entre los imputs
  useEffect(() => {
    manejarTablas();
    const sincronizarFechasCronogramaActividades = () => {
      const formData = JSON.parse(localStorage.getItem(formStorageKey));
      
      if (formData) {
        const fechaInicio = formData.transporteIda?.[0]?.fechaSalida || "";
        const fechaFin = formData.transporteRegreso?.[formData.transporteRegreso.length - 1]?.fechaLlegada || "";
        setFechaInicioEvento(fechaInicio);
        setFechaFinEvento(fechaFin);
      }
      const diferenciaDias = JSON.parse(localStorage.getItem(daysStorageKey));
      if (diferenciaDias) setDiferenciaEnDias(diferenciaDias.diferencia);
    };
    
    
    
    // Mostrar el campo 'nombreDirector' solo para ciertos roles en el proyecto
    if (rolEnProyecto === "Codirector" || rolEnProyecto === "Colaborador") {
      setShowInputDirector(true);
    } else {
      setShowInputDirector(false);
      setValue("nombreDirector", ""); // Limpiar campo 'nombreDirector' cuando no aplica
    }

    // Limpiar los campos de cuenta bancaria si no se requieren viáticos
    if (!habilitarCampos) {
      setValue("nombreBanco", "");
      setValue("tipoCuenta", "");
      setValue("numeroCuenta", "");

      // Limpiar errores asociados a los campos de cuenta bancaria
      clearErrors(["nombreBanco", "tipoCuenta", "numeroCuenta"]);
    }

    if (diferenciaEnDias > 15) {
      setshowInputJustificacion(true);
       
    } else {
      setshowInputJustificacion(false);
      setValue("justificacionComision", "No Aplica"); // Limpia el campo si la diferencia es 15 días o menos
      setValue("justificacionComision", "");
    }

    sincronizarFechasCronogramaActividades();
    const intervalId = setInterval(sincronizarFechasCronogramaActividades, 1000); // Cada 1 segundo
    return () => clearInterval(intervalId);
  }, [
    manejarTablas,
    diferenciaEnDias,
    rolEnProyecto,
    habilitarCampos,
    fieldsIda.length,
    fieldsRegreso.length,
    setShowInputDirector,
    setValue,
    clearErrors,
  ]);

  //Actividades fijas inmutables
  useEffect(() => { 
    if (fechaInicioEventoActividades && fechaFinEventoActividades) {
      const dates = generateDateRange(fechaInicioEventoActividades, fechaFinEventoActividades);
      const newFields = dates.map(date => ({
        fecha: date,
        descripcion: ""
      }));
      replace(newFields); // Reemplaza las actividades inmutables con las nuevas fechas
    }
  }, [replace, fechaInicioEventoActividades, fechaFinEventoActividades]);

  return (
    <FormProvider {...methods}>
      <Container>
        <h1 className="text-center my-4">
          Formulario para participación en viajes técnicos dentro de proyectos
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
        <Form onSubmit={methods.handleSubmit(onSubmitTechnicalTrip)}>
          <div className="form-container">
            {/* Datos del proyecto */}
            <LabelTitle text="Detalles del proyecto" disabled={false} />

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

            {/* Datos personales */}
            <LabelTitle text="Datos personales" disabled={false} />

            <InputText
              name="cedula"
              label="Cédula de ciudadanía:"
              rules={{
                required: "La cédula es requerida",
                pattern: {
                  value: /^\d{10}$/,
                  message: "La cédula debe contener solo 10 dígitos",
                },
                validate: (value) =>
                  validarCedulaEcuatoriana(value) || "La cédula no es válida",
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
            <LabelTitle text="Detalles del viaje técnico" disabled={false} />
            <InputText
              name="nombreIntitucionAcogida"
              label="Nombre de la institución de acogida:"
              rules={{
                required: "El nombre de la institución de acogida es requerido",
              }}
              disabled={false}
            />
            <Label text="Lugar del evento" />
            <InputText
              name="ciudadEvento"
              label="Ciudad:"
              rules={{ required: "La ciudad del evento es requerida" }}
              disabled={false}
            />
            <InputText
              name="paisEvento"
              label="País:"
              rules={{ required: "El país del evento es requerido" }}
              disabled={false}
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
                required: "La fecha de fin del evento es requerida",
                validate: (value) =>
                  validarFechaFin(value, watch("fechaInicioEvento")),
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
            <Label text="Justificación del viaje técnico" />
            <InputTextArea
              name="objetivoProyecto"
              label="Objetivo, resultado o producto del proyecto al que aporta el viaje técnico."
              infoText="Escriba textualmente el objetivo, resultado o producto del proyecto.<br /> Esta información debe ser tomada de la propuesta aprobada."
              rules={{ required: "Este campo es requerido" }}
              disabled={false}
            />
            <InputTextArea
              name="relevanciaViajeTecnico"
              label="Relevancia del viaje técnico para el desarrollo del proyecto:"
              infoText="Describa la relevancia del viaje técnico y aporte al cumplimiento del objetivo, resultado o producto."
              rules={{ required: "Este campo es requerido" }}
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
                                    value >= today()||
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
            
            <div >
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

              {/* Sección para justificar la comisión mayor a 15 días */}
              {showInputJustificacion && (
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
              ) }
            </div>
            <LabelTitle text="CUENTA BANCARIA DEL SERVIDOR PARA RECIBIR LOS VIÁTICOS" />
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
            <LabelTitle text="SERVIDORES QUE INTEGRAN LOS SERVICIOS INSTITUCIONALES (opcional)" />
            <LabelText text="Completar esta sección solo en caso de que usted asista al mismo evento junto con otros funcionarios." />
            <InputTextArea
              name="servidores"
              label="Nombre de los funcionarios:"
              placeholder="Escriba aquí los nombres de los funcionarios, separados por comas"
              rules={{ required: false }}
              disabled={false}
            />
            <LabelTitle text="DOCUMENTACIÓN REQUERIDA PARA AUSPICIOS AL EXTERIOR" />
            <Label text="REQUISITOS:" />
            <LabelText text="• Formulario de solicitud de autorización para cumplimiento de servicios institucionales" />
            <LabelText text="• Formulario para salida al exterior dentro de proyectos – viajes técnicos" />
            <LabelText text="• Copia de la carta de invitación" />
            <LabelText text="• Planificación/cronograma de actividades académicas a recuperar, avalada por el represente del curso y el Jefe o Director de la Unidad Académica. O en el caso de que esta actividad se realice fuera del periodo de clases aval del Jefe o Director de la Unidad Académica indicando este particular." />
            <LabelText text="• Quipux por parte del Director del Proyecto al Vicerrectorado de Investigación, Innovación y Vinculación, detallando el requerimiento de la salida al exterior." />

            {/* Fin del fomrulario */}
          </div>

          {/* Botón para enviar el formulario */}
          <Row className="mt-4">
            <Col className="text-center">
              <Button id="btn_enviar" type="submit" variant="primary">
                Enviar
              </Button>
            </Col>
          </Row>

          {/* Sección de descargas que aparece después de enviar el formulario */}
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
                    onClick={handleGeneratePdf}
                    icon="IconPdf.png"
                    altText="PDF Icon"
                    label="Descargar Anexo A"
                  />
                </Col>
                <Col md={4} className="text-center">
                  <DownloadButton
                    onClick={handleGeneratePdf2}
                    icon="IconPdf.png"
                    altText="PDF Icon"
                    label="Descargar Anexo 2B"
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
export default InternationalTechnicalTrips;
