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
import Transportation from "./ComponentTripWithinProjects/Transportation";
import ActivitySchedule from "./ComponentTripWithinProjects/ActivitySchedule";

// Importación de las funciones para generar documentos
import {
  generateAnexoATripWithingProject,
  generateMemoTripWithinProjec1,
  generateMemoTripWithinProjec2,
  generateAnexoB2WithinProject,
} from "../utils/documentGenerator";

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

function TechnicalTripWithinProjectsForm() {
  const methods = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues:
      JSON.parse(localStorage.getItem("formTechnicalTripWithinProjects")) || {},
  });

  const [showDownloadSection, setShowDownloadSection] = useState(false);
  const [
    diferenciaDiasViajeTecnicoDeProyectos,
    setDiferenciaDiasViajeTecnicoDeProyectos,
  ] = useState(0);

  const {
    watch,
    setValue,
    reset,
    clearErrors,
    formState: { errors },
  } = methods;

  // Efecto para sincronizar con localStorage y manejar cálculos de fechas
  useEffect(() => {
    const calculateAndSetDiferenciaDiasViajeTecnico = (
      primeraFechaSalida,
      ultimaFechaLlegada
    ) => {
      if (ultimaFechaLlegada && primeraFechaSalida) {
        const fechaInicio = new Date(primeraFechaSalida);
        const fechaFinal = new Date(ultimaFechaLlegada);
        const diferenciaDias =
          Math.ceil((fechaFinal - fechaInicio) / (1000 * 60 * 60 * 24)) + 1;

        localStorage.setItem(
          "diferenciaDiasViajeTecnicoDeProyectos",
          JSON.stringify({ diferencia: diferenciaDias })
        );
        setDiferenciaDiasViajeTecnicoDeProyectos(diferenciaDias);
      } else {
        localStorage.setItem(
          "diferenciaDiasViajeTecnicoDeProyectos",
          JSON.stringify({ diferencia: 0 })
        );
        setDiferenciaDiasViajeTecnicoDeProyectos(0);
      }
    };

    const initializeFromLocalStorage = () => {
      const formTechnicalTripWithinProjects =
        JSON.parse(localStorage.getItem("formTechnicalTripWithinProjects")) ||
        {};
      reset(formTechnicalTripWithinProjects);

      const primeraFechaSalida =
        formTechnicalTripWithinProjects.transporteIda?.[0]?.fechaSalida || "";
      const ultimaFechaLlegada =
        formTechnicalTripWithinProjects.transporteRegreso?.[
          formTechnicalTripWithinProjects.transporteRegreso.length - 1
        ]?.fechaLlegada || "";
      calculateAndSetDiferenciaDiasViajeTecnico(
        primeraFechaSalida,
        ultimaFechaLlegada
      );
    };

    initializeFromLocalStorage();

    const subscription = watch((data) => {
      localStorage.setItem(
        "formTechnicalTripWithinProjects",
        JSON.stringify(data)
      );

      const primeraFechaSalida = data.transporteIda?.[0]?.fechaSalida || "";
      const ultimaFechaLlegada =
        data.transporteRegreso?.[data.transporteRegreso.length - 1]
          ?.fechaLlegada || "";
      calculateAndSetDiferenciaDiasViajeTecnico(
        primeraFechaSalida,
        ultimaFechaLlegada
      );
    });

    return () => subscription.unsubscribe();
  }, [watch, reset]);

  // Función que se ejecuta cuando se envía el formulario
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

  const handleDownloadAll = () => {};

  // Función para limpiar el formulario y resetear datos
  const handleClearForm = () => {
    localStorage.removeItem("formTechnicalTripWithinProjects");
    localStorage.removeItem("diferenciaDiasViajeTecnicoDeProyectos");
    setDiferenciaDiasViajeTecnicoDeProyectos(0);
    window.location.reload();
  };

  //Prueba de conceptro como vamso a manejar el formualrio
  const rolEnProyecto = watch("rolEnProyecto");
  const seleccionViaticosSubsistencias = watch("viaticosSubsistencias");
  const habilitarCampos = seleccionViaticosSubsistencias === "SI";

  const [showInputDirector, setShowInputDirector] = useState(false);

  useEffect(() => {
    if (rolEnProyecto === "Codirector" || rolEnProyecto === "Colaborador") {
      setShowInputDirector(true);
    } else {
      setShowInputDirector(false);
      setValue("nombreDirector", "");
    }

    if (!habilitarCampos) {
      // Limpiar valores de los campos cuando se selecciona "NO"
      setValue("nombreBanco", "");
      setValue("tipoCuenta", "");
      setValue("numeroCuenta", "");

      // Limpiar errores asociados a estos campos
      clearErrors(["nombreBanco", "tipoCuenta", "numeroCuenta"]);
    }
  }, [rolEnProyecto, setValue, habilitarCampos, clearErrors]);

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

  return (
    <FormProvider {...methods}>
      <Container>
        <h1 className="text-center my-4">
          Formulario para participación en viajes técnicos dentro de proyectos
        </h1>
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
              rules={{ required: "La fecha de inicio del evento es requerida" }}
              disabled={false}
            />
            <InputDate
              name="fechaFinEvento"
              label="Hasta:"
              rules={{ required: "La fecha de fin del evento es requerida" }}
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
            <Transportation />
            <ActivitySchedule />
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

export default TechnicalTripWithinProjectsForm;
