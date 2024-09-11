import React, { useState, useEffect } from "react";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
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

// Importación de los componentes del formulario

// Importación de las funciones para generar documentos

// Validaciones personalizadas
const validarCedulaEcuatoriana = (cedula) => {
  if (cedula.length !== 10) return false;
  const provincia = parseInt(cedula.slice(0, 2), 10);
  if (provincia < 1 || provincia > 24) return false;

  let suma = 0;
  for (let i = 0; i < 9; i++) {
    let digito = parseInt(cedula[i], 10);
    if (i % 2 === 0) {
      digito *= 2;
      if (digito > 9) digito -= 9;
    }
    suma += digito;
  }

  const digitoVerificador = (10 - (suma % 10)) % 10;
  return digitoVerificador === parseInt(cedula[9], 10);
};
// Validación personalizada para la fecha de fin del evento
const validateFechaFin = (fechaFin, fechaInicioEvento) => {
  if (!fechaInicioEvento) {
    return "Primero seleccione la fecha de inicio del evento.";
  } else if (!fechaFin) {
    return (
      fechaFin >= fechaInicioEvento ||
      "La fecha de fin debe ser mayor o igual a la fecha de inicio."
    );
  }
  return (
    fechaFin >= fechaInicioEvento ||
    "La fecha de fin debe ser mayor o igual a la fecha de inicio."
  );
};

function NationalWithinProjectsForm() {
  // Configuración del formulario con react-hook-form y valores predeterminados desde localStorage
  const methods = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues:
      JSON.parse(localStorage.getItem("formNationalWithinProjects")) || {},
  });

  const [showDownloadSection, setShowDownloadSection] = useState(false);

  const {
    watch,
    setValue,
    reset,
    clearErrors,
    formState: { errors },
  } = methods;

  const now = new Date();
  const localOffset = now.getTimezoneOffset() * 60000;
  const adjustedNow = new Date(now.getTime() - localOffset)
    .toISOString()
    .split("T")[0];

  // Efecto para sincronizar con localStorage y manejar cálculos de fechas
  useEffect(() => {
    // Función para inicializar los valores desde localStorage
    const initializeFromLocalStorage = () => {
      const formNationalWithinProjects =
        JSON.parse(localStorage.getItem("formNationalWithinProjects")) || {};
      reset(formNationalWithinProjects);
    };
    initializeFromLocalStorage();
    // Suscribirse a los cambios en el formulario para guardar en localStorage
    const subscription = watch((data) => {
      localStorage.setItem("formNationalWithinProjects", JSON.stringify(data));
    });
    // Limpiar la suscripción al desmontar el componente
    return () => subscription.unsubscribe();
  }, [watch, reset]);
  // A partir de aqui los handleButtons

  // Observadores de campos y visualización de campos
  const rolEnProyecto = watch("rolEnProyecto");
  const seleccionViaticosSubsistencias = watch("viaticosSubsistencias");
  const tipoEventoSeleccionado = watch("tipoEvento");
  const participacionEvento = watch("participacionEvento");
  const seleccionDeclaracion = watch("seleccionDeclaracion");
  const hospedaje = watch("hospedaje");
  const movilizacion = watch("movilizacion");
  const alimentacion = watch("alimentacion");

  // Estados derivados de las observaciones
  const habilitarCampos = seleccionViaticosSubsistencias === "SI";
  const isAsistencia = participacionEvento === "Asistencia";

  // Estados locales para mostrar/ocultar campos
  const [showInputDirector, setShowInputDirector] = useState(false);
  const [showOtherEvent, setShowOtherEvent] = useState(false);

  useEffect(() => {
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

    // Mostrar campo adicional si se selecciona 'Otro evento académico'
    setShowOtherEvent(tipoEventoSeleccionado === "Otro evento académico");

    // Limpiar errores si el usuario selecciona 'Asistencia'
    if (isAsistencia) {
      clearErrors(["tituloPonencia"]);
    }

    // Automáticamente ajustar la declaración de gastos según los rubros seleccionados
    if (hospedaje === "SI" || movilizacion === "SI" || alimentacion === "SI") {
      setValue("seleccionDeclaracion", "siCubre"); // Si cubre algún rubro
    } else if (
      hospedaje === "NO" &&
      movilizacion === "NO" &&
      alimentacion === "NO"
    ) {
      setValue("seleccionDeclaracion", "noCubre"); // Si no cubre ningún rubro
    }
  }, [
    rolEnProyecto,
    tipoEventoSeleccionado,
    habilitarCampos,
    isAsistencia,
    hospedaje,
    movilizacion,
    alimentacion,
    setValue,
    clearErrors,
  ]);
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

  return (
    <FormProvider {...methods}>
      <Container>
        <h1 className="text-center my-4">
          Formulario para participación en viajes técnicos dentro de proyectos
        </h1>
        <Form onSubmit={methods.handleSubmit()}>
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
                    value >= adjustedNow ||
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
                  validateFechaFin(value, watch("fechaInicioEvento")),
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
              disabled={isAsistencia}
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
          </div>
        </Form>
      </Container>
    </FormProvider>
  );
}

export default NationalWithinProjectsForm;
