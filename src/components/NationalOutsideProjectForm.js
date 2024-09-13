import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Container, Button, Row, Col, Form } from "react-bootstrap";

// Importación de los componentes del formulario
import PaymentDetails from "./ComponentNationalOutsideProject/PaymentDetails.js";
import Transportation from "./ComponentNationalOutsideProject/Transportation.js";
import Label from "./Labels/Label.js";
import LabelTitle from "./Labels/LabelTitle.js";
import LabelText from "./Labels/LabelText.js";
import InputSelect from "./Inputs/InputSelect";
import InputText from "./Inputs/InputText";
import InputTextArea from "./Inputs/InputTextArea";
import InputDate from "./Inputs/InputDate";
import RadioGroup from "./Inputs/RadioGroup";
import ActionButton from "./Buttons/ActionButton";
import DownloadButton from "./Buttons/DownloadButton";

// Importación de las funciones para generar documentos

import {
  generateMemoNationalOutsideProject1,
  generateMemoNationalOutsideProject2,
  generateAnexo10NationalOutsideProject,
  generateAnexoANationalOutsideProject,
} from "../utils/documentGeneratorNational.js";

//Funciones Validación

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

function NationalOutsideProjectForm() {
  // Configuración de react-hook-form con valores predeterminados desde localStorage
  const methods = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues:
      JSON.parse(localStorage.getItem("formNationalOutsideProject")) || {},
  });

  const { watch, setValue, reset, clearErrors } = methods;

  // Estados para manejar la visibilidad de la sección de descargas y el input condicional
  const [showDownloadSection, setShowDownloadSection] = useState(false);
  const [showInputArticulo, setShowInputArticulo] = useState(false);

  // Observadores para los cambios en los campos del formulario
  const participacionEvento = watch("participacionEvento"); // Observa el campo "participacionEvento"
  const seleccionArticulo = watch("articuloPublicado"); // Observa el campo "articuloPublicado"
  const fechaInicioEvento = watch("fechaInicioEvento"); // Observa el campo "fechaInicioEvento"
  // Obtener la fecha y la zona horaria local
  const now = new Date();
  const localOffset = now.getTimezoneOffset() * 60000; // Offset en milisegundos
  const adjustedNow = new Date(now.getTime() - localOffset).toISOString().split("T")[0]; // Fecha ajustada para la zona horaria local
    const hospedaje = watch("hospedaje");
    const movilizacion = watch("movilizacion");
    const alimentacion = watch("alimentacion");
    const seleccionDeclaracion = watch("seleccionDeclaracion");
    const seleccionViaticosSubsistencias = watch("viaticosSubsistencias");
    const habilitarCampos = seleccionViaticosSubsistencias === "SI";
  
    // Efecto para sincronizar con localStorage y manejar la inicialización

    useEffect(() => {
      // Función para inicializar los valores desde localStorage
      const initializeFromLocalStorage = () => {
        const formNationalOutsideProject =
          JSON.parse(localStorage.getItem("formNationalOutsideProject")) || {};
        reset(formNationalOutsideProject);
      };
      initializeFromLocalStorage();
      // Suscribirse a los cambios en el formulario para guardar en localStorage
      const subscription = watch((data) => {
        localStorage.setItem("formNationalOutsideProject", JSON.stringify(data));
      });
      // Limpiar la suscripción al desmontar el componente
      return () => subscription.unsubscribe();
    }, [watch, reset]);

  useEffect(() => {
    
    // Manejar la lógica para mostrar u ocultar el campo de detalle del artículo
    if (seleccionArticulo === "SI") {
      setShowInputArticulo(true);
    } else {
      setShowInputArticulo(false);
      setValue("detalleArticuloSI", "");
    }

    if (hospedaje === "SI" || movilizacion === "SI" || alimentacion === "SI") {
      // Si cualquiera de los rubros está marcado como SI, la declaración debe ser "siCubre"
      setValue("seleccionDeclaracion", "siCubre");
    } else if (
      hospedaje === "NO" &&
      movilizacion === "NO" &&
      alimentacion === "NO"
    ) {
      // Si todos los rubros están marcados como NO, la declaración debe ser "noCubre"
      setValue("seleccionDeclaracion", "noCubre");
    }

    if (!habilitarCampos) {
      // Limpiar valores de los campos cuando se selecciona "NO"
      setValue("nombreBanco", "");
      setValue("tipoCuenta", "");
      setValue("numeroCuenta", "");
      clearErrors(["nombreBanco", "tipoCuenta", "numeroCuenta"]);
    }
        
  }, [watch, reset, seleccionArticulo, hospedaje, movilizacion, alimentacion, habilitarCampos, setValue, clearErrors]);

  const validateFechaFin = (fechaFin) => {
    if (!fechaInicioEvento) {
      return "Primero seleccione la fecha de inicio.";
    }
    return (
      fechaFin >= fechaInicioEvento ||
      "La fecha de finalización no puede ser anterior a la fecha de inicio."
    );
  };
  // Función que se ejecuta al enviar el formulario
  const onSubmitNationalOutside = (data) => {
    console.log(data);
    setShowDownloadSection(true);
    console.log(methods.getValues());
  };

  // Funciones para manejar la generación de documentos
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

  const handleDownloadAll = () => {
    handleGenerateMemo1();
    handleGenerateMemo2();
    handleGeneratePdf();
    handleGeneratePdf2();
    setShowDownloadSection(false);
  };

  // Función para limpiar el formulario y resetear datos
  const handleClearForm = () => {
    localStorage.removeItem("formNationalOutsideProject");
    setShowDownloadSection(false);
    window.location.reload();
  };

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
  ]


  return (
    <FormProvider {...methods}>
      <Container>
        {/* Título del formulario */}
        <h1 className="text-center my-4">
          Formulario para participacion nacional en eventos fuera de proyectos
        </h1>
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
                  const today = new Date(now.getTime() - localOffset).toISOString().split("T")[0];
                  return (
                    value >= today ||
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
                validate: validateFechaFin,
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

              <PaymentDetails />
              <Transportation />
              
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
            {seleccionDeclaracion === "siCubre" && (
            <>
            <LabelText text="En mi calidad de profesor-investigador de la EPN, declaro que la
            Organización del evento SI cubre gastos, por lo que solicito se
            gestione la asignación viáticos conforme se establece en el artículo
            13 del Reglamento de Viáticos al Exterior."/>

            <LabelText text= "**A su regreso el investigador(a) deberá presentar la factura o nota de venta de los gastos de hospedaje y/o alimentación, o de los establecidos en el artículo 9 del Reglamento de Viáticos al Exterior, que no hayan sido cubiertos por estas instituciones u organismos, para el reconocimiento de estos rubros y su correspondiente liquidación."/>
            </>
              )}

            {seleccionDeclaracion === "noCubre" && (
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
              <ActionButton
              type="submit"
              onClick={onSubmitNationalOutside}
              label="Enviar"
              variant="primary"
              />
            </Col>
          </Row>

          {/* Sección de descarga de documentos, visible tras enviar el formulario */}
          {showDownloadSection && (
            <div className="mt-4">
              <Row className="justify-content-center">
                <Col md={4} className="text-center">
                  <div onClick={handleGenerateMemo1} className="download-item">
                    <img
                      src="IconWord.png"
                      alt="Word Icon"
                      className="download-icon"
                      style={{ cursor: "pointer" }}
                    />
                    <span>Descargar Memorando del Jefe del Departamento</span>
                  </div>
                </Col>
                <Col md={4} className="text-center">
                  <div onClick={handleGenerateMemo2} className="download-item">
                    <img
                      src="IconWord.png"
                      alt="Word Icon"
                      className="download-icon"
                      style={{ cursor: "pointer" }}
                    />
                    <span>Descargar Memorando del Profesor al Jefe </span>
                  </div>
                </Col>
                <Col md={4} className="text-center">
                  <div onClick={handleGeneratePdf} className="download-item">
                    <img
                      src="IconPdf.png"
                      alt="PDF Icon"
                      className="download-icon"
                      style={{ cursor: "pointer" }}
                    />
                    <span>Descargar Anexo A</span>
                  </div>
                </Col>
                <Col md={4} className="text-center">
                  <div onClick={handleGeneratePdf2} className="download-item">
                    <img
                      src="IconPdf.png"
                      alt="PDF Icon"
                      className="download-icon"
                      style={{ cursor: "pointer" }}
                    />
                    <span>Descargar Anexo 10</span>
                  </div>
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
export default NationalOutsideProjectForm;
