import React, { useState, useEffect } from "react";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { Container, Button, Row, Col, Form } from "react-bootstrap";

// Importación de los componentes Forma nueva como vamsos a crear el formulario
import InputText from "./Inputs/InputText";
import InputSelect from "./Inputs/InputSelect";
import LabelTitle from "./Labels/LabelTitle";
import DownloadButton from "./Buttons/DownloadButton";
import ActionButton from "./Buttons/ActionButton";

// Importación de los componentes del formulario
import PersonalDetails from "./ComponentTripWithinProjects/PersonalDetails";
import ProjectDetails from "./ComponentTripWithinProjects/ProjectDetails";
import EventDetails from "./ComponentTripWithinProjects/EventDetails";
import Justification from "./ComponentTripWithinProjects/Justification";
import Transportation from "./ComponentTripWithinProjects/Transportation";
import ActivitySchedule from "./ComponentTripWithinProjects/ActivitySchedule";
import BankAccount from "./ComponentTripWithinProjects/BankAccount";
import InstitutionalServices from "./ComponentTripWithinProjects/InstitutionalServices";
import ExteriorDetail from "./ComponentTripWithinProjects/ExteriorDetail";

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
  // Estados para manejar datos y visibilidad de la UI
  const [showDownloadSection, setShowDownloadSection] = useState(false);
  const [
    diferenciaDiasViajeTecnicoDeProyectos,
    setDiferenciaDiasViajeTecnicoDeProyectos,
  ] = useState(0);

  // Configuración de react-hook-form con valores predeterminados desde localStorage
  const methods = useForm({
    mode: "onChange", // El formulario se valida en cada cambio
    reValidateMode: "onChange", // Se revalida en cada cambio
    defaultValues:
      JSON.parse(localStorage.getItem("formTechnicalTripWithinProjects")) || {},
  });

  const {
    watch,
    setValue,
    formState: { errors },
  } = methods;

  // Efecto para sincronizar con localStorage y manejar cálculos de fechas
  useEffect(() => {
    // Función para calcular y actualizar la diferencia en días
    const calculateAndSetDiferenciaDiasViajeTecnico = (
      primeraFechaSalida,
      ultimaFechaLlegada
    ) => {
      if (ultimaFechaLlegada && primeraFechaSalida) {
        const fechaInicio = new Date(primeraFechaSalida);
        const fechaFinal = new Date(ultimaFechaLlegada);
        const diferenciaDiasViajeTecnicoDeProyectos =
          Math.ceil((fechaFinal - fechaInicio) / (1000 * 60 * 60 * 24)) + 1;

        localStorage.setItem(
          "diferenciaDiasViajeTecnicoDeProyectos",
          JSON.stringify({ diferencia: diferenciaDiasViajeTecnicoDeProyectos })
        );
        setDiferenciaDiasViajeTecnicoDeProyectos(
          setDiferenciaDiasViajeTecnicoDeProyectos
        );
      } else {
        localStorage.setItem(
          "diferenciaDiasViajeTecnicoDeProyectos",
          JSON.stringify({ diferencia: 0 })
        );
        setDiferenciaDiasViajeTecnicoDeProyectos(0);
      }
    };

    // Función para inicializar el estado desde localStorage
    const initializeFromLocalStorage = () => {
      const formTechnicalTripWithinProjects =
        JSON.parse(localStorage.getItem("formTechnicalTripWithinProjects")) ||
        {};

      // Calcular y actualizar diferencia en días entre las fechas seleccionadas
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

    // Llamar a la inicialización al montar el componente
    initializeFromLocalStorage();

    // Suscripción a los cambios en el formulario
    const subscription = watch((data) => {
      localStorage.setItem(
        "formTechnicalTripWithinProjects",
        JSON.stringify(data)
      );

      // Calcular y actualizar diferencia en días entre las fechas seleccionadas
      const primeraFechaSalida = data.transporteIda?.[0]?.fechaSalida || "";
      const ultimaFechaLlegada =
        data.transporteRegreso?.[data.transporteRegreso.length - 1]
          ?.fechaLlegada || "";
      calculateAndSetDiferenciaDiasViajeTecnico(
        primeraFechaSalida,
        ultimaFechaLlegada
      );
    });

    // Limpieza al desmontar el componente
    return () => subscription.unsubscribe();
  }, [watch, setDiferenciaDiasViajeTecnicoDeProyectos]);

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

  const [showInputDirector, setShowInputDirector] = useState(false);

  useEffect(() => {
    if (rolEnProyecto === "Codirector" || rolEnProyecto === "Colaborador") {
      setShowInputDirector(true);
    } else {
      setShowInputDirector(false);
      setValue("nombreDirector", "");
    }
  }, [rolEnProyecto, setValue]);

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
              placeholder="JUAN SEBASTIAN"
              rules={{ required: "Los nombres son requeridos" }}
              disabled={false}
            />

            {/* Apellidos del participante */}
            <InputText
              name="apellidos"
              label="Apellidos del participante:"
              placeholder="PEREZ RAMIREZ"
              rules={{ required: "Los apellidos son requeridos" }}
              disabled={false}
            />

            {/* Cargo del participante */}
            <InputText
              name="cargo"
              label="Cargo:"
              placeholder="Profesor Agregado a Tiempo Completo..."
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
              rules={{
                required: "El cargo del jefe inmediato es requerido",
                minLength: {
                  value: 10,
                  message: "El cargo que escribio es demasiado corto",
                },
              }}
              disabled={false}
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
