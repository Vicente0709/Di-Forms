import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import { generate } from "@pdfme/generator";
import { text, image, barcodes } from "@pdfme/schemas";
import { Font } from "@react-pdf/renderer";
import {
  Page,
  Text,
  View,
  Document as PDFDocument,
  StyleSheet,
  PDFDownloadLink,
  pdf,
} from "@react-pdf/renderer";

//basepdf and schemas AnexoA
import { basePdfAnexoA } from "./basePdfAnexoA";
import { schemasAnexoA } from "./schemasAnexoA";
//basepdf and schemas AnexoA2
import { basePdfAnexoA2 } from "./basePdfAnexoA2";
import { schemasAnexoA2 } from "./schemasAnexoA2";

// Registra la fuente Roboto desde Google Fonts
Font.register({
  family: "Roboto",
  src: "https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu72xKOzY.woff2",
  fontWeight: 900,
});

const styles = StyleSheet.create({
  page: {
    padding: 60,
    fontFamily: "Roboto",
  },
  // Título principal
  header: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    color: "#2573ca",
    fontFamily: "Roboto",
  },
  // Títulos (extra bold, centrado)
  sectionTitle: {
    fontSize: 11,
    marginBottom: 10,
    fontWeight: 900, // Extra bold
    fontFamily: "Roboto",
  },
  // Subtítulos (bold, centrado)
  subSectionTitle: {
    fontSize: 10,
    marginBottom: 10,
    fontWeight: "bold", // Bold normal
    fontFamily: "Roboto",
    textAlign: "center",
  },
  // Texto genérico estándar
  baseText: {
    margin: 5,
    fontSize: 9,
    fontFamily: "Roboto",
    color: "black",
  },

  // Texto genérico centrado
  baseTextCenter: {
    margin: 5,
    fontSize: 9,
    fontFamily: "Roboto",
    color: "black",
    textAlign: "center",
  },

  // Texto en azul, no centrado
  textBlue: {
    margin: 5,
    fontSize: 10,
    fontFamily: "Roboto",
    color: "#2573ca",
  },

  // Texto en azul centrado
  textBlueCenter: {
    margin: 5,
    fontSize: 10,
    fontFamily: "Roboto",
    color: "#2573ca",
    textAlign: "center",
  },
  // Estilo para celdas de tabla
  tableCellText: {
    margin: 5,
    fontSize: 10,
    fontWeight: 700, // Extra bold
    textAlign: "center",
    fontFamily: "Roboto",
    justifyContent: "center",
    flexDirection: "column",
  },
  // Estilo para celdas de tabla
  tableCellTextCenter: {
    margin: 5,
    fontSize: 10,
    fontWeight: 700, // Extra bold
    textAlign: "center",
    fontFamily: "Roboto",
  },

  // Estilo para texto dentro de celdas de tabla (color azul)
  tableCellTextBlue: {
    margin: 5,
    fontSize: 10,
    color: "#2573ca",
    fontFamily: "Roboto",
  },
  // Estilo para texto dentro de celdas de tabla (color azul)
  tableCellTextBlueCenter: {
    margin: 5,
    fontSize: 10,
    color: "#2573ca",
    fontFamily: "Roboto",
    textAlign: "center",
  },

  // Tabla general
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 0.5, // Línea continua de 1/2 punto
    borderColor: "#000000",
    marginBottom: 10,
  },

  // Filas de la tabla
  tableRow: {
    flexDirection: "row",
  },

  // Columnas de tamaño variable
  tableCol: {
    flex: 1,
    borderStyle: "solid",
    borderWidth: 0.5,
    borderColor: "#000000",
    fontFamily: "Roboto",
  },
  // Columna con ajuste automático
  tableColAuto: {
    flex: 1, // Ajuste automático
    borderStyle: "solid",
    borderWidth: 0.5,
    borderColor: "#000000",
    fontFamily: "Roboto",
  },
  // Columna de 15%
  tableCol15: {
    width: "15%",
    borderStyle: "solid",
    borderWidth: 0.5,
    borderColor: "#000000",
    fontFamily: "Roboto",
  },
  // Columna de 20%
  tableCol20: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 0.5,
    borderColor: "#000000",
    fontFamily: "Roboto",
  },
  // Columna de 25%
  tableCol25: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 0.5,
    borderColor: "#000000",
    fontFamily: "Roboto",
  },
  // Columna de 40%
  tableCol40: {
    width: "40%",
    borderStyle: "solid",
    borderWidth: 0.5,
    borderColor: "#000000",
    fontFamily: "Roboto",
  },
  // Columna de 50%
  tableCol50: {
    width: "50%",
    borderStyle: "solid",
    borderWidth: 0.5,
    borderColor: "#000000",
    fontFamily: "Roboto",
  },
  // Columna de 60%
  tableCol60: {
    width: "60%",
    borderStyle: "solid",
    borderWidth: 0.5,
    borderColor: "#000000",
    fontFamily: "Roboto",
  },
  // Columna de 75%
  tableCol75: {
    width: "75%",
    borderStyle: "solid",
    borderWidth: 0.5,
    borderColor: "#000000",
    fontFamily: "Roboto",
  },
  // Columna de 80%
  tableCol80: {
    width: "80%",
    borderStyle: "solid",
    borderWidth: 0.5,
    borderColor: "#000000",
    fontFamily: "Roboto",
  },
  // Columna que ocupa toda la fila (100%)
  tableColFullWidth: {
    width: "100%", // Columna de 100% del ancho total
    borderStyle: "solid",
    borderWidth: 0.5,
    borderColor: "#000000",
    backgroundColor: "#f0f0f0", // Fondo para resaltar el título o contenido
    fontFamily: "Roboto",
  },
});

//Constantes
const today = new Date();
const day = String(today.getDate()).padStart(2, "0");
const month = String(today.getMonth() + 1).padStart(2, "0"); // Los meses son 0-indexados, por lo que se suma 1
const year = today.getFullYear();
const formattedDate = `${day}/${month}/${year}`;

export function generateMemoWithinProject(data) {
  const nombresApellidos = capitalizeWords(
    (data.nombres + " " + data.apellidos).toLowerCase()
  );
  
  // Función interna para generar solicitudes dentro de generateMemoWithinProject
  const generarSolicitudes = () => {
    let solicitudes = [];
    
    if (data.pasajesAereos === "SI") {
      solicitudes.push("la compra de pasajes aéreos");
    }
    if (data.viaticosSubsistencias === "SI") {
      solicitudes.push("la asignación de viáticos y subsistencias");
    }
    if (data.inscripcion === "SI") {
      solicitudes.push("el pago de inscripción");
    }

    if (solicitudes.length > 0) {
      return `Para lo cual solicito ${solicitudes.join(", ")}.`;
    }
    return ""; // No se solicita nada
  };

  const solicitudOracion = generarSolicitudes();

  // Determina el contenido del cuerpo del memorando basado en el rol
  const cuerpoMemorando = data.rolEnProyecto === "Director"
    ? `En mi calidad de Director del Proyecto ${data.codigoProyecto}, autorizo el gasto y solicito a usted se realicen las gestiones correspondientes para participar en el evento titulado "${data.tituloEvento}" a realizarse en ${data.ciudadEvento}, ${data.paisEvento}, desde ${data.fechaInicioEvento} hasta ${data.fechaFinEvento}. ${solicitudOracion}`
    : `En mi calidad de Director del Proyecto ${data.codigoProyecto}, autorizo el gasto y solicito a usted se realicen las gestiones correspondientes para que el Sr./Sra. "${nombresApellidos}", ${data.rolEnProyecto} del proyecto, pueda participar en el evento titulado "${data.tituloEvento}" a realizarse en ${data.ciudadEvento}, ${data.paisEvento}, desde ${data.fechaInicioEvento} hasta ${data.fechaFinEvento}. ${solicitudOracion}`;

  // Generación del documento Word
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: "Formato de memorando PARTICIPACION EN EVENTO DENTRO DE PROYECTO",
                bold: true,
                size: 24,
                font: "Aptos (Cuerpo)",
              }),
            ],
            spacing: { after: 300 },
            alignment: "start",
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "PARA:\t\t",
                bold: true,
                size: 22,
                font: "Aptos (Cuerpo)",
              }),
              new TextRun({
                text: "Dr. Marco Santorum",
                size: 22,
                font: "Aptos (Cuerpo)",
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "\t\tVicerrector de Investigación, Innovación y Vinculación",
                size: 22,
                bold: true,
                font: "Aptos (Cuerpo)",
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "ASUNTO:\t",
                bold: true,
                size: 22,
                font: "Aptos (Cuerpo)",
              }),
              new TextRun({
                text: `Solicitud para participar en evento académico/${data.codigoProyecto}`,
                size: 22,
                font: "Aptos (Cuerpo)",
              }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: cuerpoMemorando,
                size: 20,
                font: "Times New Roman",
              }),
            ],
            spacing: { after: 300 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Se adjunta la documentación correspondiente",
                size: 22,
                font: "Aptos (Cuerpo)",
              }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Con sentimientos de distinguida consideración.",
                size: 20,
                font: "Times New Roman",
              }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Atentamente,",
                size: 20,
                font: "Times New Roman",
              }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text:
                  data.rolEnProyecto === "Director"
                    ? data.nombres.toUpperCase() +
                      " " +
                      data.apellidos.toUpperCase()
                    : data.nombreDirector.toUpperCase(),
                size: 20,
                bold: true,
                font: "Times New Roman",
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `DIRECTOR DEL PROYECTO ${data.codigoProyecto.toUpperCase()}`,
                size: 20,
                font: "Times New Roman",
              }),
            ],
          }),
        ],
      },
    ],
  });

  Packer.toBlob(doc).then((blob) => {
    saveAs(
      blob,
      `Memorando solicitud para participar en evento académico ${data.codigoProyecto}.docx`
    );
  });
}

export function generateMemoOutsideProject1(data) {
  const departament = capitalizeWords(data.departamento.toLowerCase());
  // Array para almacenar las solicitudes
  let solicitudes = [];

  // Verificar si se debe incluir "viáticos y subsistencias"
  if (data.viaticosSubsistencias === "SI") {
    solicitudes.push(" la asignación de viáticos y subsistencias al exterior");
  }
  // Verificar si se debe incluir "pasajes aéreos"
  if (data.pasajesAereos === "SI") {
    solicitudes.push(" la compra de pasajes aéreos");
  }
  // Verificar si se debe incluir "pago de inscripción"
  if (data.inscripcion === "SI") {
    solicitudes.push(" el pago de inscripción");
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: "Formato de memorando para Jefe del Departamento al VIIV",
                bold: true,
                size: 24,
                font: "Aptos (Cuerpo)",
              }),
            ],
            spacing: { after: 300 },
            alignment: "start",
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "PARA:\t\t",
                bold: true,
                size: 22,
                font: "Aptos (Cuerpo)",
              }),
              new TextRun({
                text: "Dr. Marco Santorum",
                size: 22,
                font: "Aptos (Cuerpo)",
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "\t\tVicerrector de Investigación, Innovación y Vinculación",
                size: 22,
                bold: true,
                font: "Aptos (Cuerpo)",
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "ASUNTO:\t",
                bold: true,
                size: 22,
                font: "Aptos (Cuerpo)",
              }),
              new TextRun({
                text: "Solicitud de auspicio institucional y solicitud de autorización para viaje al exterior",
                size: 22,
                font: "Aptos (Cuerpo)",
              }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "De mi consideración:",
                size: 22,
                font: "Aptos (Cuerpo)",
              }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Por medio del presente comunico a usted que, en mi calidad de ${data.cargoJefeInmediato}, se ha otorgado el aval y permiso al profesor(a) ${data.nombres} ${data.apellidos}, profesor titular adscrito al ${departament}, para que participe en el evento " ${data.tituloEvento} " a realizarse en ${data.ciudadEvento}, ${data.paisEvento}, del ${data.fechaInicioEvento} al ${data.fechaFinEvento}, para la presentación de la ponencia: " ${data.tituloPonencia} ". `,
                size: 20,
                font: "Times New Roman",
              }),
            ],
            spacing: { after: 300 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Por lo expuesto, solicito muy comedidamente, se realicen los trámites pertinentes para que el profesor ${data.nombres} ${data.apellidos}, pueda participar en la conferencia antes mencionada y de igual forma se auspicie con presupuesto del Vicerrectorado de Investigación, Innovación y Vinculación,${solicitudes}.`,
                size: 20,
                font: "Times New Roman",
              }),
            ],
            spacing: { after: 300 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Se adjunta la documentación correspondiente",
                size: 22,
                font: "Aptos (Cuerpo)",
              }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Con sentimientos de distinguida consideración.",
                size: 20,
                font: "Times New Roman",
              }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Atentamente,",
                size: 20,
                font: "Times New Roman",
              }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: data.nombreJefeInmediato.toUpperCase(),
                size: 20,
                bold: true,
                font: "Times New Roman",
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: data.cargoJefeInmediato.toUpperCase(),
                size: 20,
                font: "Times New Roman",
              }),
            ],
          }),
        ],
      },
    ],
  });

  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, "Memorando para Jefe del Departamento al VIIV.docx");
  });
}
export function generateMemoOutsideProject2(data) {
  let solicitudes = [];

  // Verificar si se debe incluir "viáticos y subsistencias"
  if (data.viaticosSubsistencias === "SI") {
    solicitudes.push(" la asignación de viáticos y subsistencias al exterior");
  }
  if (data.pasajesAereos === "SI") {
    solicitudes.push(" la compra de pasajes aéreos");
  }
  // Verificar si se debe incluir "pago de inscripción"
  if (data.inscripcion === "SI") {
    solicitudes.push(" el pago de inscripción");
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: "Formato de memorando del Profesor al Jefe",
                bold: true,
                size: 24,
                font: "Aptos (Cuerpo)",
              }),
            ],
            spacing: { after: 300 },
            alignment: "start",
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "PARA:\t\t",
                bold: true,
                size: 22,
                font: "Aptos (Cuerpo)",
              }),
              new TextRun({
                text: data.nombreJefeInmediato,
                size: 22,
                font: "Aptos (Cuerpo)",
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `\t\t${data.cargoJefeInmediato}`,
                size: 22,
                bold: true,
                font: "Aptos (Cuerpo)",
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "ASUNTO:\t",
                bold: true,
                size: 22,
                font: "Aptos (Cuerpo)",
              }),
              new TextRun({
                text: "Solicitud de auspicio institucional y solicitud de autorización para viaje al exterior",
                size: 22,
                font: "Aptos (Cuerpo)",
              }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "De mi consideración:",
                size: 22,
                font: "Aptos (Cuerpo)",
              }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Por medio del presente solicito el aval y permiso para participar en el evento " ${data.tituloEvento} " a realizarse en ${data.ciudadEvento}, ${data.paisEvento}, del ${data.fechaInicioEvento} al ${data.fechaFinEvento}, para la presentación de la ponencia: " ${data.tituloPonencia} ". `,
                size: 20,
                font: "Times New Roman",
              }),
            ],
            spacing: { after: 300 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Adicionalmente solicito se realicen los trámites pertinentes para que se auspicie con presupuesto del Vicerrectorado de Investigación, Innovación y Vinculación,${solicitudes}.`,
                size: 20,
                font: "Times New Roman",
              }),
            ],
            spacing: { after: 300 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Se adjunta la documentación correspondiente",
                size: 22,
                font: "Aptos (Cuerpo)",
              }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Con sentimientos de distinguida consideración.",
                size: 20,
                font: "Times New Roman",
              }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Atentamente,",
                size: 20,
                font: "Times New Roman",
              }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text:
                  data.nombres.toUpperCase() +
                  " " +
                  data.apellidos.toUpperCase(),
                size: 20,
                bold: true,
                font: "Times New Roman",
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Profesor",
                size: 20,
                font: "Times New Roman",
              }),
            ],
          }),
        ],
      },
    ],
  });

  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, "Memorando del Profesor al Jefe.docx");
  });
}

export function generateMemoTripWithinProjec1(data) {
  let solicitudOracion = "Para lo cual solicito ";

  // Verificar si se debe incluir "pasajes aéreos"
  if (data.pasajesAereos === "SI" && data.viaticosSubsistencias === "SI") {
    solicitudOracion +=
      "se realice la compra de pasajes aéreos y asignación de viáticos y subsistencias.";
  } else if (data.pasajesAereos === "SI") {
    solicitudOracion += "se realice la compra de pasajes aéreos.";
  } else if (data.viaticosSubsistencias === "SI") {
    solicitudOracion += "la asignación de viáticos y subsistencias.";
  } else {
    solicitudOracion = ""; // No se solicita nada, por lo que la oración queda vacía.
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: "Formato de memorando VIAJE TECNICO DENTRO DE PROYECTO",
                bold: true,
                size: 24,
                font: "Aptos (Cuerpo)",
              }),
            ],
            spacing: { after: 300 },
            alignment: "start",
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "PARA:\t\t",
                bold: true,
                size: 22,
                font: "Aptos (Cuerpo)",
              }),
              new TextRun({
                text: "Dr. Marco Santorum",
                size: 22,
                font: "Aptos (Cuerpo)",
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "\t\tVicerrector de Investigación, Innovación y Vinculación",
                size: 22,
                bold: true,
                font: "Aptos (Cuerpo)",
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "ASUNTO:\t",
                bold: true,
                size: 22,
                font: "Aptos (Cuerpo)",
              }),
              new TextRun({
                text: `Solicitud para viaje técnico/ ${data.codigoProyecto}`,
                size: 22,
                font: "Aptos (Cuerpo)",
              }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `En mi calidad de Director del Proyecto ${data.codigoProyecto}, autorizo el gasto y solicito a usted se realicen las gestiones correspondientes para realizar un viaje técnico  "${data.nombreIntitucionAcogida}" a realizarse en ${data.ciudadEvento}, ${data.paisEvento}, desde ${data.fechaInicioEvento} hasta ${data.fechaFinEvento}. ${solicitudOracion}`,
                size: 20,
                font: "Times New Roman",
              }),
            ],
            spacing: { after: 300 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Se adjunta la documentación correspondiente",
                size: 22,
                font: "Aptos (Cuerpo)",
              }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Con sentimientos de distinguida consideración.",
                size: 20,
                font: "Times New Roman",
              }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Atentamente,",
                size: 20,
                font: "Times New Roman",
              }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text:
                  data.nombres.toUpperCase() +
                  " " +
                  data.apellidos.toUpperCase(),
                size: 20,
                bold: true,
                font: "Times New Roman",
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `DIRECTOR DEL PROYECTO ${data.codigoProyecto.toUpperCase()}`,
                size: 20,
                font: "Times New Roman",
              }),
            ],
          }),
        ],
      },
    ],
  });

  Packer.toBlob(doc).then((blob) => {
    saveAs(
      blob,
      "Memorando solicitud para viaje técnico " + data.codigoProyecto + ".docx"
    );
  });
}
export function generateMemoTripWithinProjec2(data) {
  const nombresApellidos = capitalizeWords(
    (data.nombres + " " + data.apellidos).toLowerCase()
  );
  let solicitudOracion = "Para lo cual solicito ";

  // Verificar si se debe incluir "pasajes aéreos"
  if (data.pasajesAereos === "SI" && data.viaticosSubsistencias === "SI") {
    solicitudOracion +=
      "se realice la compra de pasajes aéreos y asignación de viáticos y subsistencias.";
  } else if (data.pasajesAereos === "SI") {
    solicitudOracion += "se realice la compra de pasajes aéreos.";
  } else if (data.viaticosSubsistencias === "SI") {
    solicitudOracion += "la asignación de viáticos y subsistencias.";
  } else {
    solicitudOracion = ""; // No se solicita nada, por lo que la oración queda vacía.
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: "Formato de memorando VIAJE TECNICO DENTRO DE PROYECTO",
                bold: true,
                size: 24,
                font: "Aptos (Cuerpo)",
              }),
            ],
            spacing: { after: 300 },
            alignment: "start",
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "PARA:\t\t",
                bold: true,
                size: 22,
                font: "Aptos (Cuerpo)",
              }),
              new TextRun({
                text: "Dr. Marco Santorum",
                size: 22,
                font: "Aptos (Cuerpo)",
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "\t\tVicerrector de Investigación, Innovación y Vinculación",
                size: 22,
                bold: true,
                font: "Aptos (Cuerpo)",
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "ASUNTO:\t",
                bold: true,
                size: 22,
                font: "Aptos (Cuerpo)",
              }),
              new TextRun({
                text: `Solicitud para viaje técnico/${data.codigoProyecto} `,
                size: 22,
                font: "Aptos (Cuerpo)",
              }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `En mi calidad de Director del Proyecto ${data.codigoProyecto}, autorizo el gasto y solicito a usted se realicen las gestiones correspondientes para que el Sr."${nombresApellidos}", ${data.rolEnProyecto} del proyecto pueda realizar un viaje tecnico "${data.nombreIntitucionAcogida}", a realizarse en ${data.ciudadEvento}, ${data.paisEvento}, desde ${data.fechaInicioEvento} hasta ${data.fechaFinEvento}. ${solicitudOracion}`,
                size: 20,
                font: "Times New Roman",
              }),
            ],
            spacing: { after: 300 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Se adjunta la documentación correspondiente",
                size: 22,
                font: "Aptos (Cuerpo)",
              }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Con sentimientos de distinguida consideración.",
                size: 20,
                font: "Times New Roman",
              }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Atentamente,",
                size: 20,
                font: "Times New Roman",
              }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: data.nombreDirector.toUpperCase(),
                size: 20,
                bold: true,
                font: "Times New Roman",
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `DIRECTOR DEL PROYECTO ${data.codigoProyecto.toUpperCase()}`,
                size: 20,
                font: "Times New Roman",
              }),
            ],
          }),
        ],
      },
    ],
  });

  Packer.toBlob(doc).then((blob) => {
    saveAs(
      blob,
      "Memorando solicitud para viaje técnico" + data.codigoProyecto + ".docx"
    );
  });
}

export function generateMemoInscriptionPaymentOutProyect1(data) {
  // Array para almacenar las solicitudes
  let ponencias = [];
  // Verificar si se debe incluir "titulo ponencia"
  if (data.tituloPonencia === "") {
    ponencias.push();
  } else {
    ponencias.push(
      `, para la presentación de la ponencia: " ${data.tituloPonencia} "`
    );
  }

  let codigo = [];
  if (data.codigoProyecto === "") {
    codigo.push();
  } else {
    codigo.push(` / ${data.codigoProyecto} `);
  }

  let director = [];
  if (data.nombreDirector === "") {
    director.push(
      `${data.nombres.toUpperCase()} ${data.apellidos.toUpperCase()}`
    );
  } else {
    director.push(`${data.nombreDirector.toUpperCase()}`);
  }

  let dirCargo = [];

    if (data.nombreDirector === "" && data.participacionProyecto === "fueraProyecto") {
      dirCargo.push("Profesor");
    } else {
      dirCargo.push(`Director del Proyecto ${data.codigoProyecto}`);
    }

    let formulario = [];
    if (data.participacionProyecto === "fueraProyecto") {
      formulario.push("Fuera de Proyecto");
    } else {
      formulario.push("Dentro de Proyecto");
    }

    let codigoP = [];
    if (data.codigoProyecto === "") {
      codigoP.push();
    } else {
      codigoP.push(`${data.codigoProyecto} `);
    }

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: `Formato de memorando para pago de inscripción ${formulario}`,
                  bold: true,
                  size: 24,
                  font: "Aptos (Cuerpo)",
                }),
              ],
              spacing: { after: 300 },
              alignment: "start",
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "PARA:\t\t",
                  bold: true,
                  size: 22,
                  font: "Aptos (Cuerpo)",
                }),
                new TextRun({
                  text: "Dr. Marco Santorum",
                  size: 22,
                  font: "Aptos (Cuerpo)",
                }),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "\t\tVicerector de Investigación, Innovación y Vinculación",
                  size: 22,
                  bold: true,
                  font: "Aptos (Cuerpo)",
                }),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "ASUNTO:\t",
                  bold: true,
                  size: 22,
                  font: "Aptos (Cuerpo)",
                }),
                new TextRun({
                  text: `Solicitud para pago de inscripción ${codigo}`,
                  size: 22,
                  font: "Aptos (Cuerpo)",
                }),
              ],
              spacing: { after: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "De mi consideración:",
                  size: 22,
                  font: "Aptos (Cuerpo)",
                }),
              ],
              spacing: { after: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Por medio del presente solicito se realicen los trámites pertinentes para que se auspicie con presupuesto del Vicerrectorado de Investigación, Innovación y Vinculación, el pago de inscripción para el evento " ${data.tituloEvento} " a realizarse en ${data.ciudadEvento}, ${data.paisEvento}, del ${data.fechaInicioEvento} al ${data.fechaFinEvento}${ponencias}. `,
                  size: 20,
                  font: "Times New Roman",
                }),
              ],
              spacing: { after: 300 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Se adjunta la documentación correspondiente",
                  size: 22,
                  font: "Aptos (Cuerpo)",
                }),
              ],
              spacing: { after: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Con sentimientos de distinguida consideración.",
                  size: 20,
                  font: "Times New Roman",
                }),
              ],
              spacing: { after: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Atentamente,",
                  size: 20,
                  font: "Times New Roman",
                }),
              ],
              spacing: { after: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `${director}`,
                  size: 20,
                  bold: true,
                  font: "Times New Roman",
                }),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `${dirCargo}`,
                  size: 20,
                  font: "Times New Roman",
                }),
              ],
            }),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(
        blob,
        `Memorando para Pago de Inscripción ${formulario} ${codigoP}.docx`
      );
    });
  
}

export function generateMemoPublicationPaymentProject(data) {
  let codigo = [];
  if (data.codigoProyecto === "") {
    codigo.push();
  } else {
    codigo.push(` / ${data.codigoProyecto} `);
  }

  let director = [];
  if (data.nombreDirector === "") {
    director.push(
      `${data.nombres.toUpperCase()} ${data.apellidos.toUpperCase()}`
    );
  } else {
    director.push(`${data.nombreDirector.toUpperCase()}`);
  }

  let dirCargo = [];

  if (data.nombreDirector === "" && data.participacionProyecto==="fueraProyecto") {
    dirCargo.push("Profesor");
  } else {
    dirCargo.push(`Director del Proyecto ${data.codigoProyecto}`);
  }

  let formulario = [];
  if (data.participacionProyecto === "fueraProyecto") {
    formulario.push("Fuera de Proyecto");
  } else {
    formulario.push("Dentro de Proyecto");
  }

  let codigoP = [];
  if (data.codigoProyecto === "") {
    codigoP.push();
  } else {
    codigoP.push(`${data.codigoProyecto} `);
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: `Formato de memorando para pago de inscripción ${formulario}`,
                bold: true,
                size: 24,
                font: "Aptos (Cuerpo)",
              }),
            ],
            spacing: { after: 300 },
            alignment: "start",
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "PARA:\t\t",
                bold: true,
                size: 22,
                font: "Aptos (Cuerpo)",
              }),
              new TextRun({
                text: "Dr. Marco Santorum",
                size: 22,
                font: "Aptos (Cuerpo)",
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "\t\tVicerector de Investigación, Innovación y Vinculación",
                size: 22,
                bold: true,
                font: "Aptos (Cuerpo)",
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "ASUNTO:\t",
                bold: true,
                size: 22,
                font: "Aptos (Cuerpo)",
              }),
              new TextRun({
                text: `Solicitud para pago de publicación ${codigo}`,
                size: 22,
                font: "Aptos (Cuerpo)",
              }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "De mi consideración:",
                size: 22,
                font: "Aptos (Cuerpo)",
              }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Por medio del presente solicito se realicen los trámites pertinentes para que se auspicie con presupuesto del Vicerrectorado de Investigación, Innovación y Vinculación, el pago de la publicación " ${data.tituloPublicacion} ", en la revista "${data.nombreRevista}". `,
                size: 20,
                font: "Times New Roman",
              }),
            ],
            spacing: { after: 300 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Se adjunta la documentación correspondiente",
                size: 22,
                font: "Aptos (Cuerpo)",
              }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Con sentimientos de distinguida consideración.",
                size: 20,
                font: "Times New Roman",
              }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Atentamente,",
                size: 20,
                font: "Times New Roman",
              }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `${director}`,
                size: 20,
                bold: true,
                font: "Times New Roman",
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `${dirCargo}`,
                size: 20,
                font: "Times New Roman",
              }),
            ],
          }),
        ],
      },
    ],
  });

  Packer.toBlob(doc).then((blob) => {
    saveAs(
      blob,
      `Memorando para Pago de Publicación ${formulario} ${codigoP}.docx`
    );
  });
}

// Nueva función para generar el Anexo A en PDF
export async function generateAnexoA(data) {
  const template = {
    schemas: schemasAnexoA,
    basePdf: basePdfAnexoA,
  };

  // Fusionar los arrays transporteIda y transporteRegreso en un solo array llamado transporte
  const transporte = data.transporteIda.concat(data.transporteRegreso);
  console.log("Transporte Array:", transporte);
  const ultimaFechaLlegada =
    transporte.length > 0
      ? transporte[transporte.length - 1]?.fechaLlegada
      : "";
  const ultimaHoraLlegada =
    transporte.length > 0 ? transporte[transporte.length - 1]?.horaLlegada : "";
  var ponentciaText = "";
  if (
    data.tituloPonencia &&
    data.tituloPonencia.trim() !== "" &&
    data.tituloPonencia.trim() !== "No Aplica"
  ) {
    ponentciaText =
      "Para la participacion de la ponencia '" + data.tituloPonencia + "'";
  } else {
    ponentciaText = "";
  }
  const plugins = { text, image, qrcode: barcodes.qrcode };
  const transporteInfo = {};
  // Genera dinámicamente las propiedades para transporteTipo, transporteNombre, transporteRuta, transporteFechaS, transporteFechaSH, transporteFechaL, y transporteFechaLH
  for (let i = 0; i < 8; i++) {
    transporteInfo[`transporteTipo${i + 1}`] =
      transporte[i]?.tipoTransporte || "";
    transporteInfo[`transporteNombre${i + 1}`] =
      transporte[i]?.nombreTransporte || "";
    transporteInfo[`transporteRuta${i + 1}`] = transporte[i]?.ruta || "";
    transporteInfo[`transporteFechaS${i + 1}`] =
      formatDate(transporte[i]?.fechaSalida) || "";
    transporteInfo[`transporteFechaSH${i + 1}`] =
      transporte[i]?.horaSalida || "";
    transporteInfo[`transporteFechaL${i + 1}`] =
      formatDate(transporte[i]?.fechaLlegada) || "";
    transporteInfo[`transporteFechaLH${i + 1}`] =
      transporte[i]?.horaLlegada || "";
  }
  const inputs = [
    {
      fechaSolicitud: formattedDate,
      viaticos: data.viaticosSubsistencias === "SI" ? "X" : "",
      movilizacion: data.viaticosSubsistencia === "SI" ? "X" : "",
      subsistencias: data.viaticosSubsistencias === "SI" ? "X" : "",
      alimentacion: data.viaticosSubsistencia === "SI" ? "X" : "",

      nombresCompletos:
        data.apellidos.toUpperCase() + " " + data.nombres.toUpperCase(),
      lugar: data.ciudadEvento + ", " + data.paisEvento,
      puesto: data.cargo,
      unidadPerteneciente: data.departamento,

      fechaSalida: formatDate(data.transporteIda[0]?.fechaSalida),
      horaSalida: data.transporteIda[0]?.horaSalida,

      fechaLlegada: formatDate(ultimaFechaLlegada),
      horaLlegada: ultimaHoraLlegada,

      servidores:
        data.apellidos.toUpperCase() +
        " " +
        data.nombres.toUpperCase() +
        data.servidores.toUpperCase(),

      actividades:
        "Dentro de las actividades del proyecto  " +
        data.codigoProyecto +
        " titulado  '" +
        data.tituloProyecto +
        "'  se llevará a cabo la participación en el evento  '" +
        data.tituloEvento +
        "', que tendrá lugar del  " +
        data.fechaInicioEvento +
        "  al  " +
        data.fechaFinEvento +
        " en la ciudad de  " +
        data.ciudadEvento +
        "," +
        data.paisEvento +
        ". " +
        ponentciaText,

      ...transporteInfo,

      banco: data.nombreBanco,
      bancoTipoCuenta: data.tipoCuenta,
      numeroCuenta: data.numeroCuenta,

      nombresCompletos2:
        data.nombres.toUpperCase() +
        " " +
        data.apellidos.toUpperCase() +
        "\n" +
        data.cargo.toUpperCase() +
        "\n" +
        data.cedula,

      nombresCompletosJefeInmediato:
        data.nombreJefeInmediato.toUpperCase() +
        "\n" +
        data.cargoJefeInmediato.toUpperCase(),
    },
  ];

  const pdf = await generate({ template, plugins, inputs });

  const blob = new Blob([pdf.buffer], { type: "application/pdf" });
  saveAs(
    blob,
    "Anexo 1 - Solicitud de viáticos EPN " + data.codigoProyecto + ".pdf"
  );
}

// Nueva función para generar el Anexo A en PDF
export async function generateAnexoATripWithingProject(data) {
  const template = {
    schemas: schemasAnexoA,
    basePdf: basePdfAnexoA,
  };

  // Fusionar los arrays transporteIda y transporteRegreso en un solo array llamado transporte
  const transporte = data.transporteIda.concat(data.transporteRegreso);

  const ultimaFechaLlegada =
    transporte.length > 0
      ? transporte[transporte.length - 1]?.fechaLlegada
      : "";
  const ultimaHoraLlegada =
    transporte.length > 0 ? transporte[transporte.length - 1]?.horaLlegada : "";

  const plugins = { text, image, qrcode: barcodes.qrcode };
  const transporteInfo = {};
  // Genera dinámicamente las propiedades para transporteTipo, transporteNombre, transporteRuta, transporteFechaS, transporteFechaSH, transporteFechaL, y transporteFechaLH
  for (let i = 0; i < 8; i++) {
    transporteInfo[`transporteTipo${i + 1}`] =
      transporte[i]?.tipoTransporte || "";
    transporteInfo[`transporteNombre${i + 1}`] =
      transporte[i]?.nombreTransporte || "";
    transporteInfo[`transporteRuta${i + 1}`] = transporte[i]?.ruta || "";
    transporteInfo[`transporteFechaS${i + 1}`] =
      formatDate(transporte[i]?.fechaSalida) || "";
    transporteInfo[`transporteFechaSH${i + 1}`] =
      transporte[i]?.horaSalida || "";
    transporteInfo[`transporteFechaL${i + 1}`] =
      formatDate(transporte[i]?.fechaLlegada) || "";
    transporteInfo[`transporteFechaLH${i + 1}`] =
      transporte[i]?.horaLlegada || "";
  }

  const inputs = [
    {
      fechaSolicitud: formattedDate,
      viaticos: data.viaticosSubsistencias === "SI" ? "X" : "",
      movilizacion: data.viaticosSubsistencias === "SI" ? "X" : "",
      subsistencias: data.viaticosSubsistencias === "SI" ? "X" : "",
      alimentacion: data.viaticosSubsistencias === "SI" ? "X" : "",

      nombresCompletos:
        data.apellidos.toUpperCase() + " " + data.nombres.toUpperCase(),
      lugar: data.ciudadEvento + ", " + data.paisEvento,
      puesto: data.cargo,
      unidadPerteneciente: data.departamento,

      fechaSalida: formatDate(data.transporteIda[0]?.fechaSalida),
      horaSalida: data.transporteIda[0]?.horaSalida,

      fechaLlegada: formatDate(ultimaFechaLlegada),
      horaLlegada: ultimaHoraLlegada,

      servidores:
        data.apellidos.toUpperCase() +
        " " +
        data.nombres.toUpperCase() +
        ". " +
        data.servidores.toUpperCase(),

      actividades:
        "Dentro de las actividades del proyecto  " +
        data.codigoProyecto +
        " titulado  '" +
        data.tituloProyecto +
        "'  se llevará a cabo un viaje técnico a cargo de la intitucion de acogida '" +
        data.nombreIntitucionAcogida +
        "', que tendrá lugar del  " +
        data.fechaInicioEvento +
        "  al  " +
        data.fechaFinEvento +
        " en la ciudad de  " +
        data.ciudadEvento +
        ", " +
        data.paisEvento +
        ". ",

      ...transporteInfo,

      banco: data.nombreBanco,
      bancoTipoCuenta: data.tipoCuenta,
      numeroCuenta: data.numeroCuenta,

      nombresCompletos2:
        data.nombres.toUpperCase() +
        " " +
        data.apellidos.toUpperCase() +
        "\n" +
        data.cargo.toUpperCase() +
        "\n" +
        data.cedula,

      nombresCompletosJefeInmediato:
        data.nombreJefeInmediato.toUpperCase() +
        "\n" +
        data.cargoJefeInmediato.toUpperCase(),
    },
  ];

  const pdf = await generate({ template, plugins, inputs });

  const blob = new Blob([pdf.buffer], { type: "application/pdf" });
  saveAs(
    blob,
    "Anexo 1 - Solicitud de viáticos EPN " + data.codigoProyecto + ".pdf"
  );
}

// Nueva función para generar el Anexo A2 en PDF
export async function generateAnexoA2(data) {
  const template = {
    schemas: schemasAnexoA2,
    basePdf: basePdfAnexoA2,
  };
  const plugins = { text, image, qrcode: barcodes.qrcode };
  const diferencia =
    JSON.parse(localStorage.getItem("diferenciaDias"))?.diferencia || 0;
  const actividades = {};

  // Genera dinámicamente las propiedades para activN, activFecha, y activDescripcion
  for (let i = 0; i < 22; i++) {
    actividades[`activN${i + 1}`] =
      data.actividadesInmutables[i] && diferencia > 15
        ? (i + 1).toString()
        : "";
    actividades[`activFecha${i + 1}`] =
      diferencia < 16 ? "" : data.actividadesInmutables[i]?.fecha || "";
    actividades[`activDescripcion${i + 1}`] =
      diferencia < 16 ? "" : data.actividadesInmutables[i]?.descripcion || "";
  }
  let valorInscripcionStr = "";
  let fechaPagoInscripcionStr = "";

  // Iteramos sobre cada inscripción en el array 'inscripciones'
  data.inscripciones.forEach((inscripcion) => {
    // Concatenamos el valor de inscripción con un '$' y un salto de línea
    if (data.inscripcion === "SI" && inscripcion.valorInscripcion) {
      valorInscripcionStr += `${inscripcion.monedaPago}${inscripcion.valorInscripcion}\n`;
    }

    // Construimos la cadena de la fecha de pago dependiendo de cuál campo tiene valor
    if (
      data.inscripcion === "SI" &&
      inscripcion.pagoLimite &&
      inscripcion.limiteFecha
    ) {
      fechaPagoInscripcionStr += `${inscripcion.pagoLimite} ${inscripcion.limiteFecha}\n`;
    }
  });

  const inputs = [
    {
      fechaPag1: formattedDate,
      codigoProyecto: data.codigoProyecto,
      tituloProyecto: data.tituloProyecto,
      nombresParticipante:
        data.apellidos.toUpperCase() + " " + data.nombres.toUpperCase(),
      rolProyecto: data.rolEnProyecto,
      departamento: data.departamento,
      tituloEvento: data.tituloEvento,
      ciudad: data.ciudadEvento.toUpperCase(),
      pais: data.paisEvento.toUpperCase(),
      fechasEvento:
        "Desde el " +
        data.fechaInicioEvento +
        " hasta el " +
        data.fechaFinEvento,
      tipoEvento1: data.tipoEvento === "Conferencia o congreso" ? "X" : "",
      tipoEvento2: data.tipoEvento === "Taller" ? "X" : "",
      tipoEvento3: data.tipoEvento === "Otro evento académico" ? "X" : "",
      tipoEvento3otro: data.otroEventoEspecificar,
      participacion1:
        data.participacionEvento === "Presentación de artículo indexado"
          ? "X"
          : "",
      participacion2:
        data.participacionEvento ===
        "Presentación de póster, abstract, charla magistral u otros"
          ? "X"
          : "",
      participacion3: data.participacionEvento === "Asistencia" ? "X" : "",
      ponencia: data.tituloPonencia,
      pasajesS: data.pasajesAereos === "SI" ? "X" : "",
      viaticosS: data.viaticosSubsistencias === "SI" ? "X" : "",
      inscripcionS: data.inscripcion === "SI" ? "X" : "",
      pasajesN: data.pasajesAereos === "NO" ? "X" : "",
      viaticosN: data.viaticosSubsistencias === "NO" ? "X" : "",
      inscripciónN: data.inscripcion === "NO" ? "X" : "",

      fechaPag2: formattedDate,
      objetivoEvento: data.objetivoProyecto,
      relevanciaEvento: data.relevanciaEvento,

      valorInscripcion: valorInscripcionStr.trim(), // Removemos el último salto de línea
      fechaPagoInscripcion: fechaPagoInscripcionStr.trim(), // Removemos el último salto de línea

      transferencia:
        data.metodoPago === "Transferencia" && data.inscripcion === "SI"
          ? "X"
          : "",
      otroPago:
        data.metodoPago === "Otra" && data.inscripcion === "SI" ? "X" : "",
      hospedajeS: data.hospedaje === "SI" ? "X" : "",
      hospedajeN: data.hospedaje === "NO" ? "X" : "",
      movS: data.movilizacion === "SI" ? "X" : "",
      movN: data.movilizacion === "NO" ? "X" : "",
      alimentacionS: data.alimentacion === "SI" ? "X" : "",
      alimentacionN: data.alimentacion === "NO" ? "X" : "",
      declaraciónN: data.seleccionDeclaracion === "noCubre" ? "X" : "",
      declaracioneS: data.seleccionDeclaracion === "siCubre" ? "X" : "",

      fechaPag3: formattedDate,

      ...actividades,

      justificacionMas15:
        diferencia < 16 ? "No aplica" : data.justificacionComision,
      fechaSolicitud: formattedDate,
      nombreDirector:
        data.nombres.toUpperCase() + " " + data.apellidos.toUpperCase(),
      codigoProyecto2: data.codigoProyecto,

      fechaPag4: formattedDate,
      calculo:
        "Calculo dias de comision entre las fechas de salida y de regreso: " +
        diferencia,
    },
  ];

  const pdf = await generate({ template, plugins, inputs });

  const blob = new Blob([pdf.buffer], { type: "application/pdf" });
  saveAs(
    blob,
    "Anexo 2a-Participación en EVENTO dentro de Proyecto " +
      data.codigoProyecto +
      ".pdf"
  );
}

export async function generateAnexoAOutsideProject(data) {
  const template = {
    schemas: schemasAnexoA,
    basePdf: basePdfAnexoA,
  };

  // Fusionar los arrays transporteIda y transporteRegreso en un solo array llamado transporte
  const transporte = data.transporteIda.concat(data.transporteRegreso);

  const ultimaFechaLlegada =
    transporte.length > 0
      ? transporte[transporte.length - 1]?.fechaLlegada
      : "";
  const ultimaHoraLlegada =
    transporte.length > 0 ? transporte[transporte.length - 1]?.horaLlegada : "";

  var ponentciaText = "";
  if (
    data.tituloPonencia &&
    data.tituloPonencia.trim() !== "" &&
    data.tituloPonencia.trim() !== "No aplica"
  ) {
    ponentciaText =
      " Para la presentación de la ponencia '" +
      data.tituloPonencia +
      "' del tipo " +
      data.tipoPonencia;
  } else {
    ponentciaText = "";
  }
  const plugins = { text, image, qrcode: barcodes.qrcode };
  const transporteInfo = {};
  // Genera dinámicamente las propiedades para transporteTipo, transporteNombre, transporteRuta, transporteFechaS, transporteFechaSH, transporteFechaL, y transporteFechaLH
  for (let i = 0; i < 8; i++) {
    transporteInfo[`transporteTipo${i + 1}`] =
      transporte[i]?.tipoTransporte || "";
    transporteInfo[`transporteNombre${i + 1}`] =
      transporte[i]?.nombreTransporte || "";
    transporteInfo[`transporteRuta${i + 1}`] = transporte[i]?.ruta || "";
    transporteInfo[`transporteFechaS${i + 1}`] =
      formatDate(transporte[i]?.fechaSalida) || "";
    transporteInfo[`transporteFechaSH${i + 1}`] =
      transporte[i]?.horaSalida || "";
    transporteInfo[`transporteFechaL${i + 1}`] =
      formatDate(transporte[i]?.fechaLlegada) || "";
    transporteInfo[`transporteFechaLH${i + 1}`] =
      transporte[i]?.horaLlegada || "";
  }

  const inputs = [
    {
      fechaSolicitud: formattedDate,
      viaticos: data.viaticosSubsistencias === "SI" ? "X" : "",
      movilizacion: data.viaticosSubsistencias === "SI" ? "X" : "",
      subsistencias: data.viaticosSubsistencias === "SI" ? "X" : "",
      alimentacion: data.viaticosSubsistencias === "SI" ? "X" : "",
      nombresCompletos:
        data.apellidos.toUpperCase() + " " + data.nombres.toUpperCase(),
      lugar: data.ciudadEvento + ", " + data.paisEvento,
      puesto: data.puesto,
      unidadPerteneciente: data.departamento,

      fechaSalida: formatDate(data.transporteIda[0]?.fechaSalida),
      horaSalida: data.transporteIda[0]?.horaSalida,

      fechaLlegada: formatDate(ultimaFechaLlegada),
      horaLlegada: ultimaHoraLlegada,

      servidores:
        data.apellidos.toUpperCase() +
        " " +
        data.nombres.toUpperCase() +
        ". " +
        data.servidores.toUpperCase(),

      actividades:
        "Asistencia al evento '" +
        data.tituloEvento +
        "', que tendrá lugar del  " +
        data.fechaInicioEvento +
        "  al  " +
        data.fechaFinEvento +
        " en la ciudad de  " +
        data.ciudadEvento +
        ", " +
        data.paisEvento +
        ". " +
        ponentciaText,

      ...transporteInfo,

      banco: data.nombreBanco,
      bancoTipoCuenta: data.tipoCuenta,
      numeroCuenta: data.numeroCuenta,

      nombresCompletos2:
        data.nombres.toUpperCase() +
        " " +
        data.apellidos.toUpperCase() +
        "\n" +
        data.puesto.toUpperCase() +
        "\n" +
        data.cedula,

      nombresCompletosJefeInmediato:
        data.nombreJefeInmediato.toUpperCase() +
        "\n" +
        data.cargoJefeInmediato.toUpperCase(),
    },
  ];

  const pdf = await generate({ template, plugins, inputs });

  const blob = new Blob([pdf.buffer], { type: "application/pdf" });
  saveAs(blob, "Anexo 1 - Solicitud de viáticos EPN.pdf");
}

export async function generateAnexo8OutsideProject(data) {
 
  const MyPDFDocument = (
    <PDFDocument>
      <Page style={styles.page}>
      <Text style={styles.header}>
      Anexo 8 – Formulario para salidas al exterior de Profesores Titulares fuera de proyectos 
      </Text>

      <Text style={styles.sectionTitle}>
        1. DATOS DEL INVESTIGADOR 
        </Text>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCol40}>
            <Text style={styles.tableCellText}>Nombres Completos:</Text>
            </View>
            <View style={styles.tableColAuto}>
              <Text style={styles.tableCellTextBlue}>
                {data.nombres.toUpperCase()+ " "+ data.apellidos.toUpperCase()}
              </Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol40}>
            <Text style={styles.tableCellText}>Departamento / Instituto:</Text>
            </View>
            <View style={styles.tableColAuto}>
              <Text style={styles.tableCellTextBlue}>
                {data.departamento}
              </Text>
            </View>
          </View>  
        </View>


      {/* 2. Datos del evento*/}

      <Text style={styles.sectionTitle}>2. DATOS DEL EVENTO Y REQUERIMIENTO </Text>

<View style={styles.table}>
  <View style={styles.tableRow}>
    <View style={styles.tableCol25}>
      <Text style={styles.tableCellText}>Titulo del Evento:</Text>
    </View>
    <View style={styles.tableCol}>
      <Text style={styles.tableCellTextBlue}>
        {data.tituloEvento}
      </Text>
    </View>
  </View>

  <View style={styles.tableRow}>
    <View style={styles.tableCol25}>
      <Text style={styles.tableCellText}>Lugar del Evento:</Text>
    </View>
    <View style={styles.tableCol15}>
      <Text style={styles.tableCellText}>Ciudad:</Text>
    </View>
    <View style={styles.tableCol}>
      <Text style={styles.tableCellTextBlue}>
        {data.ciudadEvento.toUpperCase()}
      </Text>
    </View>
    <View style={styles.tableCol15}>
      <Text style={styles.tableCellText}>País:</Text>
    </View>
    <View style={styles.tableCol}>
      <Text style={styles.tableCellTextBlue}>
        {data.paisEvento.toUpperCase() }
      </Text>
    </View>
    </View>
    <View style={styles.tableRow}>
    <View style={styles.tableCol25}>
      <Text style={styles.tableCellText}>Fecha del evento:</Text>
    </View>
    <View style={styles.tableCol}>
      <Text style={styles.textBlueCenter}>
        {"Desde el  "}
        <Text style={styles.tableCellTextBlue}>
          {data.fechaInicioEvento}
          <Text style={styles.textBlueCenter}>
            {" hasta el "}
            <Text style={styles.tableCellTextBlue}>
              {data.fechaFinEvento}
            </Text>
          </Text>
        </Text>
      </Text>
    </View>
    </View>
  
    

    <View style={styles.tableRow}>
      <View style={styles.tableCol25}>
        <Text style={styles.tableCellText}>Relevancia académica del evento:</Text>
      </View>
      <View style={styles.tableCol}>
        <Text style={styles.tableCellTextBlue}>
        {data.RelevanciaAcademica}
        </Text>
      </View>
    </View>

    <View style={styles.tableRow}>
      <View style={styles.tableCol25}>
        <Text style={styles.tableCellText}>Título de la Ponencia: </Text>
      </View>
      <View style={styles.tableCol}>
        <Text style={styles.tableCellTextBlue}>
        {data.tituloPonencia}
        </Text>
      </View>
    </View>

    <View style={styles.tableRow}>
        <View style={styles.tableCol25}>
          <Text style={styles.tableCellText}>Tipo de ponencia: </Text>
        </View>
        <View style={styles.tableCol}>
        <Text style={styles.tableCellTextBlue}>
          {data.tipoPonencia}
        </Text>
    </View>
    </View>
    
      <View style={styles.tableRow}>
        <View style={styles.tableCol25}>
          <Text style={styles.tableCellText}>
          ¿El artículo será publicado?
          </Text>
          <Text style={styles.baseText}>
            {"SI ( "}
            <Text style={styles.tableCellTextBlue}>
              {data.articuloPublicado === "SI" ? "X" : ""}
              <Text style={styles.baseText}>{" )"}</Text>
            </Text>
          </Text>
          <Text style={styles.baseText}>
            {"NO ( "}
            <Text style={styles.tableCellTextBlue}>
              {data.articuloPublicado === "NO" ? "X" : ""}
              <Text style={styles.baseText}>{" )"}</Text>
            </Text>
          </Text>
        </View>
        <View style={styles.tableCol}>
        <Text style={styles.tableCellTextBlue}>
          {data.detalleArticuloSI}
        </Text>
        </View>
        </View>
      

      <View style={styles.tableRow}>
            <View style={styles.tableCol25}>
              <Text style={styles.tableCellText}>Solicita:</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellText}>Pasajes aéreos:</Text>
            </View>
            <View style={styles.tableCol15}>
              <Text style={styles.baseText}>
                {"SI( "}
                <Text style={styles.tableCellTextBlue}>
                  {data.pasajesAereos === "SI" ? "X" : ""}
                  <Text style={styles.baseText}>{" )"}</Text>
                </Text>
              </Text>
              <Text style={styles.baseText}>
                {"NO( "}
                <Text style={styles.tableCellTextBlue}>
                  {data.pasajesAereos === "NO" ? "X" : ""}
                  <Text style={styles.baseText}>{" )"}</Text>
                </Text>
              </Text>
            </View>
            <View style={styles.tableCol15}>
              <Text style={styles.tableCellText}>
                Viáticos y subsistencias:
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.baseText}>
                {"SI( "}
                <Text style={styles.tableCellTextBlue}>
                  {data.viaticosSubsistencias === "SI" ? "X" : ""}
                  <Text style={styles.baseText}>{" )"}</Text>
                </Text>
              </Text>
              <Text style={styles.baseText}>
                {"NO( "}
                <Text style={styles.tableCellTextBlue}>
                  {data.viaticosSubsistencias === "NO" ? "X" : ""}
                  <Text style={styles.baseText}>{" )"}</Text>
                </Text>
              </Text>
            </View>
            <View style={styles.tableCol15}>
              <Text style={styles.tableCellText}>Inscripción:</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.baseText}>
                {"SI( "}
                <Text style={styles.tableCellTextBlue}>
                  {data.inscripcion === "SI" ? "X" : ""}
                  <Text style={styles.baseText}>{" )"}</Text>
                </Text>
              </Text>
              <Text style={styles.baseText}>
                {"NO( "}
                <Text style={styles.tableCellTextBlue}>
                  {data.inscripcion === "NO" ? "X" : ""}
                  <Text style={styles.baseText}>{" )"}</Text>
                </Text>
              </Text>
            </View>
          </View>
          </View>
    
    
    <View>
          <Text style={styles.sectionTitle}>
            3. INFORMACIÓN DEL PAGO DE INSCRIPCIÓN{" "}
          </Text>

          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableCol15}>
                <Text style={styles.tableCellText}>
                  Valor de la Inscripción:
                </Text>
              </View>
              <View style={styles.tableCol}>
                {data.inscripciones.map((inscripcion, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={styles.tableCellTextBlueCenter}>
                      {inscripcion.monedaPago
                        ? inscripcion.monedaPago +
                          " " +
                          (inscripcion.valorInscripcion || " ")
                        : ""}
                    </Text>
                  </View>
                ))}
              </View>

              <View style={styles.tableCol15}>
                <Text style={styles.tableCellText}>
                  Fechas de pago de inscripción:
                </Text>
              </View>
              <View style={styles.tableCol}>
                {data.inscripciones.map((inscripcion, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={styles.tableCellTextBlueCenter}>
                      {data.inscripciones.map((inscripcion, index) => (
                        <View key={index} style={styles.tableRow}>
                          <Text style={styles.tableCellTextBlueCenter}>
                            {inscripcion.pagoLimite
                              ? inscripcion.pagoLimite +
                                " " +
                                (inscripcion.limiteFecha || " ")
                              : ""}
                          </Text>
                        </View>
                      ))}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol15}>
                <Text style={styles.tableCellText}>Método de pago:</Text>
              </View>
              <View style={styles.tableCol}>
                <View style={styles.tableRow}>
                  <View style={styles.tableCol}>
                    <Text style={styles.baseText}>
                      - Transferencia:
                      <Text style={styles.baseText}>
                        {"( "}
                        <Text style={styles.tableCellTextBlue}>
                          {data.metodoPago === "Transferencia" 
                            ? "X"
                            : ""}
                          <Text style={styles.baseText}>{" )"}</Text>
                        </Text>
                      </Text>
                    </Text>
                    <Text style={styles.baseText}>
                      Adjuntar los siguientes documentos:
                    </Text>
                    <Text style={styles.baseText}>
                    a) Formulario de pagos al exterior (Anexo 6)
                    </Text>
                    <Text style={styles.baseText}>
                      b) Documento donde se puede verificar el costo y fechas de la inscripción al evento
                    </Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableCol}>
                    <Text style={styles.baseText}>
                      - Otra(tarjetadecrédito,efectivo,etc...):
                      <Text style={styles.baseText}>
                        {"( "}
                        <Text style={styles.tableCellTextBlue}>
                          {data.metodoPago === "Otra"
                            ? "X"
                            : ""}
                          <Text style={styles.baseText}>{" )"}</Text>
                        </Text>
                      </Text>
                    </Text>
                    <Text style={styles.baseText}>
                      Adjuntar los siguientes documentos:
                    </Text>
                    <Text style={styles.baseText}>
                      a) Solicitud de REEMBOLSO. Incluir texto con justificación en el mismo memorando del requerimiento.
                    </Text>
                    <Text style={styles.baseText}>
                      b)Documento donde se puede verificar el costo y fechas de la inscripción al evento
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View>
          <Text style={styles.sectionTitle}>
          4. DECLARACIÓN DE GASTOS, CONFORME REGLAMENTO DE VIÁTICOS AL EXTERIOR 
          </Text>
          <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCol25}>
              <Text style={styles.tableCellText}>La organización del evento cubre: </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellText}>Hospedaje:</Text>
            </View>
            <View style={styles.tableCol15}>
              <Text style={styles.baseText}>
                {"SI( "}
                <Text style={styles.tableCellTextBlue}>
                  {data.hospedaje === "SI" ? "X" : ""}
                  <Text style={styles.baseText}>{" )"}</Text>
                </Text>
              </Text>
              <Text style={styles.baseText}>
                {"NO( "}
                <Text style={styles.tableCellTextBlue}>
                  {data.hospedaje === "NO" ? "X" : ""}
                  <Text style={styles.baseText}>{" )"}</Text>
                </Text>
              </Text>
            </View>
            <View style={styles.tableCol15}>
              <Text style={styles.tableCellText}>
                Alimentación:
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.baseText}>
                {"SI( "}
                <Text style={styles.tableCellTextBlue}>
                  {data.alimentacion === "SI" ? "X" : ""}
                  <Text style={styles.baseText}>{" )"}</Text>
                </Text>
              </Text>
              <Text style={styles.baseText}>
                {"NO( "}
                <Text style={styles.tableCellTextBlue}>
                  {data.alimentacion === "NO" ? "X" : ""}
                  <Text style={styles.baseText}>{" )"}</Text>
                </Text>
              </Text>
            </View>
            <View style={styles.tableCol15}>
              <Text style={styles.tableCellText}>Movilización Interna:</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.baseText}>
                {"SI( "}
                <Text style={styles.tableCellTextBlue}>
                  {data.movilizacion === "SI" ? "X" : ""}
                  <Text style={styles.baseText}>{" )"}</Text>
                </Text>
              </Text>
              <Text style={styles.baseText}>
                {"NO( "}
                <Text style={styles.tableCellTextBlue}>
                  {data.movilizacion === "NO" ? "X" : ""}
                  <Text style={styles.baseText}>{" )"}</Text>
                </Text>
              </Text>
            </View>
          </View>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellText}>
            En mi calidad de profesor-investigador de la EPN, declaro que la Organización del evento NO cubre ningún 
            gasto, por lo que solicito se gestione la asignación de viáticos conforme se establece en el artículo 7 del 
            Reglamento de Viáticos al Exterior.     ( {data.seleccionDeclaracion === "noCubre" ? "X" : ""} ) 
            </Text>

          </View>
          <View style={styles.tableRow}>
              <Text style={styles.tableCellText}>
              En mi calidad de profesor-investigador de la EPN, declaro que la Organización del evento SI cubre gastos, por 
              lo que solicito se gestione la asignación viáticos conforme se establece en el artículo 13 del Reglamento de 
              Viáticos al Exterior. ( {data.seleccionDeclaracion === "siCubre" ? "X" : ""} )** 
              </Text>
              </View>
              <View style={styles.tableRow}>
              <Text style={styles.tableCellText}>
              **A su regreso el investigador(a) deberá presentar la factura o nota de venta de los gastos de hospedaje y/o alimentación, o 
              de los establecidos en el artículo 9 del Reglamento de Viáticos al Exterior, que no hayan sido cubiertos por estas instituciones 
              u organismos, para el reconocimiento de estos rubros y su correspondiente liquidación.
              </Text>
          </View>

        </View>

        {/* Etiqueta de Firma */}
        <Text style={styles.baseText}>Firma del Solicitante:</Text>


       {/* Espacio en blanco para la firma */}
       <Text>{"\n\n\n"}</Text>

{/* Nombre completo */}
<Text style={styles.baseTextCenter}>________________________</Text>

{/* Nombre completo */}
<Text style={styles.tableCellTextBlueCenter}>
  {`${data.nombres.toUpperCase() + " " + data.apellidos.toUpperCase()}`}
</Text>

{/* Nombre del director y código de proyecto */}
<Text style={styles.tableCellTextBlueCenter}>
  {`${data.puesto.toUpperCase()}`}
</Text>
      </Page>
    </PDFDocument>
  );
  // Convertir el documento PDF a un Blob
  const blob = await pdf(MyPDFDocument).toBlob();

  // Descargar automáticamente el archivo PDF
  saveAs(blob, `Anexo 8 - Formulario fuera de proyecto.pdf`);


}

export async function generateAnexoB2WithinProject(data) {
  const MyPDFDocument = (
    <PDFDocument>
      <Page style={styles.page}>
        {/* Título del formulario */}
        <Text style={styles.header}>
        Anexo 2B - FORMULARIO PARA SALIDAS AL EXTERIOR DENTRO DE PROYECTOS VIAJES TÉCNICOS
        </Text>
        {/* 1. Datos Generales */}

        <Text style={styles.sectionTitle}>
          1. DATOS DEL PROYECTO Y DEL INVESTIGADOR PARTICIPANTE
        </Text>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCol40}>
              <Text style={styles.tableCellText}>Código del Proyecto:</Text>
            </View>
            <View style={styles.tableColAuto}>
              <Text style={styles.tableCellTextBlue}>
                {data.codigoProyecto || "_________"}
              </Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol40}>
              <Text style={styles.tableCellText}>Título de Proyecto:</Text>
            </View>
            <View style={styles.tableColAuto}>
              <Text style={styles.tableCellTextBlue}>
                {data.tituloProyecto || "_________"}
              </Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol40}>
              <Text style={styles.tableCellText}>
                Nombres Completo del Participante:
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellTextBlue}>
                {(data.apellidos ? data.apellidos.toUpperCase() : "_________") +
                  " " +
                  (data.nombres ? data.nombres.toUpperCase() : "_________")}
              </Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol40}>
              <Text style={styles.tableCellText}>Rol en el Proyecto:</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellTextBlue}>
                {data.rolEnProyecto || "_________"}
              </Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol40}>
              <Text style={styles.tableCellText}>
                Departamento / Instituto:
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellTextBlue}>
                {data.departamento || "_________"}
              </Text>
            </View>
          </View>
        </View>

        {/* 1. Datos del evento*/}

        <Text style={styles.sectionTitle}>2. DATOS DEL EVENTO</Text>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCol25}>
              <Text style={styles.tableCellText}>
                Nombre de la institución de acogida:
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellTextBlue}>
                {data.nombreIntitucionAcogida || "_________"}
              </Text>
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={styles.tableCol25}>
              <Text style={styles.tableCellText}>Lugar del Evento:</Text>
            </View>
            <View style={styles.tableCol15}>
              <Text style={styles.tableCellText}>Ciudad:</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellTextBlue}>
                {data.ciudadEvento.toUpperCase() || "_________"}
              </Text>
            </View>
            <View style={styles.tableCol15}>
              <Text style={styles.tableCellText}>País:</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellTextBlue}>
                {data.ciudadEvento.toUpperCase() || "_________"}
              </Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol25}>
              <Text style={styles.tableCellText}>
                Fechas del viaje técnico:
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.textBlueCenter}>
                {"Desde el  "}
                <Text style={styles.tableCellTextBlue}>
                  {data.fechaInicioEvento || "_________"}
                  <Text style={styles.textBlueCenter}>
                    {" hasta el "}
                    <Text style={styles.tableCellTextBlue}>
                      {data.fechaFinEvento || "_________"}
                    </Text>
                  </Text>
                </Text>
              </Text>
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={styles.tableCol25}>
              <Text style={styles.tableCellText}>
                Solicita para el viaje técnico:
              </Text>
            </View>

            <View style={styles.tableCol}>
              <View style={styles.tableRow}>
                <View style={styles.tableCol40}>
                  <Text style={styles.tableCellText}>- Pasajes aéreos:</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.baseText}>
                    {"( "}
                    <Text style={styles.tableCellTextBlue}>
                      {data.pasajesAereos === "SI" ? "X" : ""}
                      <Text style={styles.baseText}>{" )"}</Text>
                    </Text>
                  </Text>
                </View>
              </View>

              <View style={styles.tableRow}>
                <View style={styles.tableCol40}>
                  <Text style={styles.tableCellText}>
                    - Viáticos y subsistencias:
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.baseText}>
                    {"( "}
                    <Text style={styles.tableCellTextBlue}>
                      {data.viaticosSubsistencias === "SI" ? "X" : ""}
                      <Text style={styles.baseText}>{" )"}</Text>
                    </Text>
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* 1. Datos De la Salida de Campo*/}

        <Text style={styles.sectionTitle}>
          3. JUSTIFICACIÓN DEL VIAJE TÉCNICO{" "}
        </Text>

        <Text style={styles.baseText}>
          3.1 Objetivo, resultado o producto del proyecto al que aporta el viaje
          técnico.
        </Text>
        <Text style={styles.textBlue}>{data.objetivoProyecto}</Text>
        <Text style={styles.baseText}>
          3.2 Relevancia del viaje técnico para el desarrollo del proyecto.
        </Text>
        <Text style={styles.textBlue}>{data.relevanciaViajeTecnico}</Text>
        <Text style={styles.sectionTitle}>
          4. CRONOGRAMA DE ACTIVIDADES A REALIZAR EN EL VIAJE TÉCNICO{" "}
        </Text>

        <Text style={styles.baseText}>4.1 Cronograma</Text>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCol15}>
              <Text style={styles.tableCellTextCenter}>N°</Text>
            </View>
            <View style={styles.tableCol25}>
              <Text style={styles.tableCellTextCenter}>Fecha</Text>
            </View>
            <View style={styles.tableColAuto}>
              <Text style={styles.tableCellTextCenter}>
                Descripcion de la actividad a realizar
              </Text>
            </View>
          </View>
          {data.actividadesInmutables.map((actividad, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={styles.tableCol15}>
                <Text style={styles.tableCellTextBlueCenter}>
                  {(index + 1).toString()}
                </Text>
              </View>
              <View style={styles.tableCol25}>
                <Text style={styles.tableCellTextBlueCenter}>
                  {actividad.fecha}
                </Text>
              </View>
              <View style={styles.tableColAuto}>
                <Text style={styles.tableCellTextBlue}>
                  {actividad.descripcion}
                </Text>
              </View>
            </View>
          ))}
        </View>

            <Text style={styles.baseText}>
              4.2 Justificar la necesidad de la comisión de servicios mayor a 15
              días{" "}
            </Text>
            <Text style={styles.textBlue}>
              {data.justificacionComision || "No Aplica"}
            </Text>
          
         <Text style={styles.sectionTitle}>
          5. CALCULO REFERENCIAL DE DÍAS DE LA COMISIÓN DE SERVICIOS{" "}
        </Text>
        <Text style={styles.textBlue}>
          {'Calculo dias de comision entre las fechas de salida y de regreso al pais: '+ data.actividadesInmutables.length }
        </Text>

        {/* Etiqueta de Firma */}
        <Text style={styles.baseText}>Firma del Solicitante:</Text>

        {/* Espacio en blanco para la firma */}
        <Text>{"\n\n\n"}</Text>

        {/* Nombre completo */}
        <Text style={styles.baseText}>________________________</Text>

        {/* Nombre completo */}
        <Text style={styles.tableCellTextBlue}>
          {`${data.rolEnProyecto === "Director"
              ? "Director " +data.nombres + " " + data.apellidos
              : data.nombreDirector}`}
        </Text>

        {/* Nombre del director y código de proyecto */}
        <Text style={styles.tableCellTextBlue}>
          {`${ "Director del Proyecto " + data.codigoProyecto}`}
        </Text>
      </Page>
    </PDFDocument>
  );

  // Convertir el documento PDF a un Blob
  const blob = await pdf(MyPDFDocument).toBlob();

  // Descargar automáticamente el archivo PDF
  saveAs(blob, "Anexo2B_Formulario para viajes tecnicos.pdf");
}

export async function generateAnexo5InscriptionPayment(data) {
  
  const nombreCompleto = (data.rolEnProyecto === "Director" || data.participacionProyecto === "fueraProyecto") 
  ? `${data.nombres.toUpperCase()} ${data.apellidos.toUpperCase()}` 
  : data.nombreDirector.toUpperCase();

  const formulario = (data.participacionProyecto === "fueraProyecto") ? "Fuera de Proyecto" :"Dentro de Proyecto";
  
  let codigoP = (data.codigoProyecto === "") ? "" :`${data.codigoProyecto} `;
  
  const MyPDFDocument = (
    <PDFDocument>
      <Page style={styles.page}>
      <Text style={styles.header}>
      Anexo 5 - FORMULARIO PARA PAGOS DE INSCRIPCIÓN 
      </Text>

      <Text style={styles.sectionTitle}>
        1. DATOS DEL INVESTIGADOR 
        </Text>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCol40}>
            <Text style={styles.tableCellText}>Nombres Completos:</Text>
            </View>
            <View style={styles.tableColAuto}>
              <Text style={styles.tableCellTextBlue}>
                {data.nombres.toUpperCase()+ " "+ data.apellidos.toUpperCase()}
              </Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol40}>
            <Text style={styles.tableCellText}>Departamento / Instituto:</Text>
            </View>
            <View style={styles.tableColAuto}>
              <Text style={styles.tableCellTextBlue}>
                {data.departamento}
              </Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol25}>
            <Text style={styles.baseText}>{"Fuera de Proyecto: ( "}
            <Text style={styles.tableCellTextBlue}>
                {data.participacionProyecto === "fueraProyecto" ? "X" : ""}
                <Text style={styles.baseText}>{" )"}</Text>
              </Text>
            </Text>
            </View>
            <View style={styles.tableCol25}>
            <Text style={styles.baseText}>{"Dentro de Proyecto: ( "}
            <Text style={styles.tableCellTextBlue}>
                {data.participacionProyecto === "dentroProyecto" ? "X" : ""}
                <Text style={styles.baseText}>{" )"}</Text>
              </Text>
            </Text>
            </View>
            <View style={styles.tableCol25}>
            <Text style={styles.tableCellText}>Código del Proyecto:</Text>
            </View>
            <View style={styles.tableColAuto}>
              <Text style={styles.tableCellTextBlue}>
                {data.codigoProyecto}
              </Text>
            </View>
          </View>
        </View>


      {/* 2. Datos del evento*/}

      <Text style={styles.sectionTitle}>2. DATOS DEL EVENTO</Text>

<View style={styles.table}>
  <View style={styles.tableRow}>
    <View style={styles.tableCol25}>
      <Text style={styles.tableCellText}>Titulo del Evento:</Text>
    </View>
    <View style={styles.tableCol}>
      <Text style={styles.tableCellTextBlue}>
        {data.tituloEvento}
      </Text>
    </View>
  </View>

  <View style={styles.tableRow}>
    <View style={styles.tableCol25}>
      <Text style={styles.tableCellText}>Lugar del Evento:</Text>
    </View>
    <View style={styles.tableCol15}>
      <Text style={styles.tableCellText}>Ciudad:</Text>
    </View>
    <View style={styles.tableCol}>
      <Text style={styles.tableCellTextBlue}>
        {data.ciudadEvento.toUpperCase()}
      </Text>
    </View>
    <View style={styles.tableCol15}>
      <Text style={styles.tableCellText}>País:</Text>
    </View>
    <View style={styles.tableCol}>
      <Text style={styles.tableCellTextBlue}>
        {data.paisEvento.toUpperCase() }
      </Text>
    </View>
    </View>
    <View style={styles.tableRow}>
    <View style={styles.tableCol25}>
      <Text style={styles.tableCellText}>Fecha del evento:</Text>
    </View>
    <View style={styles.tableCol}>
      <Text style={styles.textBlueCenter}>
        {"Desde el  "}
        <Text style={styles.tableCellTextBlue}>
          {data.fechaInicioEvento}
          <Text style={styles.textBlueCenter}>
            {" hasta el "}
            <Text style={styles.tableCellTextBlue}>
              {data.fechaFinEvento}
            </Text>
          </Text>
        </Text>
      </Text>
    </View>
    </View>
  
    

    <View style={styles.tableRow}>
      <View style={styles.tableCol25}>
        <Text style={styles.tableCellText}>Relevancia académica del evento:</Text>
      </View>
      <View style={styles.tableCol}>
        <Text style={styles.tableCellTextBlue}>
        {data.RelevanciaAcademica}
        </Text>
      </View>
    </View>

    <View style={styles.tableRow}>
        <View style={styles.tableCol25}>
          <Text style={styles.tableCellText}>Título del artículo:</Text>
        </View>
        <View style={styles.tableCol}>
        <Text style={styles.tableCellTextBlue}>
          {data.tituloArticulo}
        </Text>
    </View>
    </View>
    

    
      <View style={styles.tableRow}>
        <View style={styles.tableCol25}>
          <Text style={styles.tableCellText}>
          ¿El artículo será publicado?
          </Text>
          <Text style={styles.baseText}>
            {"SI ( "}
            <Text style={styles.tableCellTextBlue}>
              {data.articuloPublicado === "SI" ? "X" : ""}
              <Text style={styles.baseText}>{" )"}</Text>
            </Text>
          </Text>
          <Text style={styles.baseText}>
            {"NO ( "}
            <Text style={styles.tableCellTextBlue}>
              {data.articuloPublicado === "NO" ? "X" : ""}
              <Text style={styles.baseText}>{" )"}</Text>
            </Text>
          </Text>
        </View>
        <View style={styles.tableCol}>
        <Text style={styles.tableCellTextBlue}>
          {data.detalleArticuloSI}
        </Text>
        </View>
        </View>
      </View>

    
    
    <View>
          <Text style={styles.sectionTitle}>
            3. INFORMACIÓN DEL PAGO DE INSCRIPCIÓN{" "}
          </Text>

          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableCol15}>
                <Text style={styles.tableCellText}>
                  Valor de la Inscripción:
                </Text>
              </View>
              <View style={styles.tableCol}>
                {data.inscripciones.map((inscripcion, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={styles.tableCellTextBlueCenter}>
                      {inscripcion.monedaPago
                        ? inscripcion.monedaPago +
                          " " +
                          (inscripcion.valorInscripcion || " ")
                        : ""}
                    </Text>
                  </View>
                ))}
              </View>

              <View style={styles.tableCol15}>
                <Text style={styles.tableCellText}>
                  Fechas de pago de inscripción:
                </Text>
              </View>
              <View style={styles.tableCol}>
                {data.inscripciones.map((inscripcion, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={styles.tableCellTextBlueCenter}>
                      {data.inscripciones.map((inscripcion, index) => (
                        <View key={index} style={styles.tableRow}>
                          <Text style={styles.tableCellTextBlueCenter}>
                            {inscripcion.pagoLimite
                              ? inscripcion.pagoLimite +
                                " " +
                                (inscripcion.limiteFecha || " ")
                              : ""}
                          </Text>
                        </View>
                      ))}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol15}>
                <Text style={styles.tableCellText}>Método de pago:</Text>
              </View>
              <View style={styles.tableCol}>
                <View style={styles.tableRow}>
                  <View style={styles.tableCol}>
                    <Text style={styles.baseText}>
                      - Transferencia:
                      <Text style={styles.baseText}>
                        {"( "}
                        <Text style={styles.tableCellTextBlue}>
                          {data.metodoPago === "Transferencia" 
                            ? "X"
                            : ""}
                          <Text style={styles.baseText}>{" )"}</Text>
                        </Text>
                      </Text>
                    </Text>
                    <Text style={styles.baseText}>
                      Adjuntar los siguientes documentos:
                    </Text>
                    <Text style={styles.baseText}>
                    a) Formulario de pagos al exterior (Anexo 6)
                    </Text>
                    <Text style={styles.baseText}>
                      b) Documento donde se puede verificar el costo y fechas de la inscripción al evento
                    </Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableCol}>
                    <Text style={styles.baseText}>
                      - Otra(tarjetadecrédito,efectivo,etc...):
                      <Text style={styles.baseText}>
                        {"( "}
                        <Text style={styles.tableCellTextBlue}>
                          {data.metodoPago === "Otra"
                            ? "X"
                            : ""}
                          <Text style={styles.baseText}>{" )"}</Text>
                        </Text>
                      </Text>
                    </Text>
                    <Text style={styles.baseText}>
                      Adjuntar los siguientes documentos:
                    </Text>
                    <Text style={styles.baseText}>
                      a) Solicitud de REEMBOLSO. Incluir texto con justificación en el mismo memorando del requerimiento.
                    </Text>
                    <Text style={styles.baseText}>
                      b)Documento donde se puede verificar el costo y fechas de la inscripción al evento
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Etiqueta de Firma */}
        <Text style={styles.baseText}>Firma del Solicitante:</Text>


       {/* Espacio en blanco para la firma */}
       <Text>{"\n\n\n"}</Text>

{/* Nombre completo */}
<Text style={styles.baseTextCenter}>________________________</Text>

{/* Nombre completo */}
<Text style={styles.tableCellTextBlueCenter}>
  {`${nombreCompleto}`}
</Text>

{/* Nombre del director y código de proyecto */}
<Text style={styles.tableCellTextBlueCenter}>
  {`${data.departamento}`}
</Text>
      </Page>
    </PDFDocument>
  );
  // Convertir el documento PDF a un Blob
  const blob = await pdf(MyPDFDocument).toBlob();

  // Descargar automáticamente el archivo PDF
  saveAs(blob, `Anexo 5 - Formulario Pago Inscripción ${formulario} ${codigoP}.pdf`);


}

export async function generateAnexo1PublicationPaymentWithin(data) {
  
 const nombreCompleto = data.rolEnProyecto === "Director" 
  ? `${data.nombres.toUpperCase()+" "+data.apellidos.toUpperCase()}` 
  : data.nombreDirector.toUpperCase();
  const MyPDFDocument = (
    
    <PDFDocument>
      <Page style={styles.page}>
      <Text style={styles.header}>
      ANEXO 1 - FORMULARIO PARA EL PAGO DE ARTÍCULOS CIENTÍFICOS ACEPTADOS EN REVISTAS DE ALTO IMPACTO-DENTRO DE PROYECTOS 
        </Text>

        <Text style={styles.sectionTitle}>
        1. DATOS DEL INVESTIGADOR 
        </Text>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCol40}>
            <Text style={styles.tableCellText}>Nombres Completos:</Text>
            </View>
            <View style={styles.tableColAuto}>
              <Text style={styles.tableCellTextBlue}>
                {data.nombres.toUpperCase()+ " "+ data.apellidos.toUpperCase()}
              </Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol40}>
            <Text style={styles.tableCellText}>Departamento / Instituto:</Text>
            </View>
            <View style={styles.tableColAuto}>
              <Text style={styles.tableCellTextBlue}>
                {data.departamento}
              </Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol40}>
            <Text style={styles.tableCellText}>Código del Proyecto:</Text>
            </View>
            <View style={styles.tableColAuto}>
              <Text style={styles.tableCellTextBlue}>
                {data.codigoProyecto}
              </Text>
            </View>
          </View>
        </View>

        {/*2. DATOS DE LA PUBLICACIÓN  */}

        <Text style={styles.sectionTitle}>2. DATOS DE LA PUBLICACIÓN</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCol25}>
              <Text style={styles.tableCellText}>Título de la publicación:</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellTextBlue}>
                {data.tituloPublicacion}
              </Text>
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={styles.tableCol25}>
              <Text style={styles.tableCellText}>Nombre de la Revista:</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellTextBlue}>
                {data.nombreRevista}
              </Text>
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={styles.tableCol25}>
              <Text style={styles.tableCellText}>Autores de la EPN: (Titulares, Ocasionales, otros) </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellTextBlue}>
                {data.autoresEPN}
              </Text>
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={styles.tableCol25}>
              <Text style={styles.tableCellText}>Autores externos:</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellTextBlue}>
                {data.autoresExternos}
              </Text>
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={styles.tableCol25}>
              <Text style={styles.tableCellText}>Base de datos de indexación:</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellTextBlue}>
                {data.baseDatos}
              </Text>
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={styles.tableCol25}>
              <Text style={styles.tableCellText}>Cuartil de la publicación: </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellTextBlue}>
                {data.cuartilPublicacion}
              </Text>
            </View>
          </View>
        </View>


        <View>
          <Text style={styles.sectionTitle}>
          3. DETALLE DE LA FORMA DE PAGO DE PUBLICACIÓN {" "}
          </Text>

          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableCol15}>
                <Text style={styles.tableCellText}>
                Valor de la publicación: 
                </Text>
              </View>
              <View style={styles.tableCol}>
                {data.publicaciones.map((publicaciones, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={styles.tableCellTextBlueCenter}>
                      {publicaciones.monedaPago
                        ? publicaciones.monedaPago +
                          " " +
                          (publicaciones.valorPublicacion || " ")
                        : ""}
                    </Text>
                  </View>
                ))}
              </View>

              <View style={styles.tableCol15}>
                <Text style={styles.tableCellText}>
                Fecha máxima de pago de la publicación: 
                </Text>
              </View>
              <View style={styles.tableCol}>
                {data.publicaciones.map((publicaciones, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={styles.tableCellTextBlueCenter}>
                      {data.publicaciones.map((publicaciones, index) => (
                        <View key={index} style={styles.tableRow}>
                          <Text style={styles.tableCellTextBlueCenter}>
                            {publicaciones.limiteFecha
                              ? (publicaciones.limiteFecha || " ")
                              : ""}
                          </Text>
                        </View>
                      ))}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol15}>
                <Text style={styles.tableCellText}>Método de pago:</Text>
              </View>
              <View style={styles.tableCol}>
                <View style={styles.tableRow}>
                  <View style={styles.tableCol}>
                    <Text style={styles.baseText}>
                      - Transferencia:
                      <Text style={styles.baseText}>
                        {"( "}
                        <Text style={styles.tableCellTextBlue}>
                          {data.metodoPago === "Transferencia"
                            ? "X"
                            : ""}
                          <Text style={styles.baseText}>{" )"}</Text>
                        </Text>
                      </Text>
                    </Text>
                    <Text style={styles.baseText}>
                      Adjuntar los siguientes documentos:
                    </Text>
                    <Text style={styles.baseText}>
                      a)Formulario de registro de cuenta o formulario de giro al exterior (según corresponda) 
                    </Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableCol}>
                    <Text style={styles.baseText}>
                      - Otra(tarjetadecrédito,efectivo,etc...):
                      <Text style={styles.baseText}>
                        {"( "}
                        <Text style={styles.tableCellTextBlue}>
                          {data.metodoPago === "Otra" ? "X"
                            : ""}
                          <Text style={styles.baseText}>{" )"}</Text>
                        </Text>
                      </Text>
                    </Text>
                    <Text style={styles.baseText}>
                      Adjuntar los siguientes documentos:
                    </Text>
                    <Text style={styles.baseText}>
                     a)Solicitud de REEMBOLSO.
                    </Text>
                    <Text style={styles.baseText}>
                      b)Factura del solicitante a nombre de la Unidad de Gestión de Investigación y Proyección Social, adjuntando el respaldo de la transacción. * 
                    </Text>
                    <Text style={styles.baseText}>
                    *La Factura se entregará una vez que el investigador(a) solicite el pago de reembolso. 
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

         {/* Etiqueta de Firma */}
        <Text style={styles.baseText}>Firma del Director del Proyecto: </Text>

        {/* Espacio en blanco para la firma */}
        <Text>{"\n\n\n"}</Text>

        {/* Nombre completo */}
        <Text style={styles.baseTextCenter}>________________________</Text>

        {/* Nombre completo */}
        <Text style={styles.tableCellTextBlueCenter}>
          { `${nombreCompleto}`}
        </Text>

        {/* Nombre del director y código de proyecto */}
        <Text style={styles.tableCellTextBlueCenter}>
          {`${data.codigoProyecto || "Código de prueba"}`}
        </Text>


      </Page>
    </PDFDocument>
  );

   // Convertir el documento PDF a un Blob
   const blob = await pdf(MyPDFDocument).toBlob();

   // Descargar automáticamente el archivo PDF
   saveAs(blob, `Anexo 1 - Formulario Pago Publicación Dentro del Proyecto-${data.codigoProyecto} .pdf`);
  
}

export async function generateAnexo2PublicationPaymentOutside(data) {
 
  const MyPDFDocument = (
  <PDFDocument>
      <Page style={styles.page}>
      <Text style={styles.header}>
      ANEXO 2 - FORMULARIO PARA EL PAGO DE SUBVENCIONES PARA LA DIFUSIÓN DE ARTÍCULOS 
CIENTÍFICOS ACEPTADOS EN REVISTAS DE ALTO IMPACTO
      </Text>

        <Text style={styles.sectionTitle}>
        1. DATOS DEL INVESTIGADOR 
        </Text>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCol40}>
            <Text style={styles.tableCellText}>Nombres Completos:</Text>
            </View>
            <View style={styles.tableColAuto}>
              <Text style={styles.tableCellTextBlue}>
                {data.nombres.toUpperCase()+ " "+ data.apellidos.toUpperCase()}
              </Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol40}>
            <Text style={styles.tableCellText}>Departamento / Instituto:</Text>
            </View>
            <View style={styles.tableColAuto}>
              <Text style={styles.tableCellTextBlue}>
                {data.departamento}
              </Text>
            </View>
          </View>
        </View>

        {/*2. DATOS DE LA PUBLICACIÓN  */}

        <Text style={styles.sectionTitle}>2. DATOS DE LA PUBLICACIÓN</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCol25}>
              <Text style={styles.tableCellText}>Título de la publicación:</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellTextBlue}>
                {data.tituloPublicacion}
              </Text>
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={styles.tableCol25}>
              <Text style={styles.tableCellText}>Nombre de la Revista:</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellTextBlue}>
                {data.nombreRevista}
              </Text>
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={styles.tableCol25}>
              <Text style={styles.tableCellText}>Autores de la EPN: (Titulares, Ocasionales, otros) </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellTextBlue}>
                {data.autoresEPN}
              </Text>
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={styles.tableCol25}>
              <Text style={styles.tableCellText}>Autores externos:</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellTextBlue}>
                {data.autoresExternos}
              </Text>
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={styles.tableCol25}>
              <Text style={styles.tableCellText}>Base de datos de indexación:</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellTextBlue}>
                {data.baseDatos}
              </Text>
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={styles.tableCol25}>
              <Text style={styles.tableCellText}>Cuartil de la publicación: </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellTextBlue}>
                {data.cuartilPublicacion}
              </Text>
            </View>
          </View>
        </View>


        <View>
          <Text style={styles.sectionTitle}>
          3. DETALLE DE LA FORMA DE PAGO DE PUBLICACIÓN {" "}
          </Text>

          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableCol15}>
                <Text style={styles.tableCellText}>
                Valor de la publicación: 
                </Text>
              </View>
              <View style={styles.tableCol}>
                {data.publicaciones.map((publicaciones, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={styles.tableCellTextBlueCenter}>
                      {publicaciones.monedaPago
                        ? publicaciones.monedaPago +
                          " " +
                          (publicaciones.valorPublicacion || " ")
                        : ""}
                    </Text>
                  </View>
                ))}
              </View>

              <View style={styles.tableCol15}>
                <Text style={styles.tableCellText}>
                Fecha máxima de pago de la publicación: 
                </Text>
              </View>
              <View style={styles.tableCol}>
                {data.publicaciones.map((publicaciones, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={styles.tableCellTextBlueCenter}>
                      {data.publicaciones.map((publicaciones, index) => (
                        <View key={index} style={styles.tableRow}>
                          <Text style={styles.tableCellTextBlueCenter}>
                            {publicaciones.limiteFecha
                              ? (publicaciones.limiteFecha || " ")
                              : ""}
                          </Text>
                        </View>
                      ))}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol15}>
                <Text style={styles.tableCellText}>Método de pago:</Text>
              </View>
              <View style={styles.tableCol}>
                <View style={styles.tableRow}>
                  <View style={styles.tableCol}>
                    <Text style={styles.baseText}>
                      - Transferencia:
                      <Text style={styles.baseText}>
                        {"( "}
                        <Text style={styles.tableCellTextBlue}>
                          {data.metodoPago === "Transferencia"
                            ? "X"
                            : ""}
                          <Text style={styles.baseText}>{" )"}</Text>
                        </Text>
                      </Text>
                    </Text>
                    <Text style={styles.baseText}>
                      Adjuntar los siguientes documentos:
                    </Text>
                    <Text style={styles.baseText}>
                      a)Formulario de registro de cuenta o formulario de giro al exterior (según corresponda) 
                    </Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableCol}>
                    <Text style={styles.baseText}>
                      - Otra(tarjetadecrédito,efectivo,etc...):
                      <Text style={styles.baseText}>
                        {"( "}
                        <Text style={styles.tableCellTextBlue}>
                          {data.metodoPago === "Otra" ? "X"
                            : ""}
                          <Text style={styles.baseText}>{" )"}</Text>
                        </Text>
                      </Text>
                    </Text>
                    <Text style={styles.baseText}>
                      Adjuntar los siguientes documentos:
                    </Text>
                    <Text style={styles.baseText}>
                     a)Solicitud de REEMBOLSO.
                    </Text>
                    <Text style={styles.baseText}>
                      b)Factura del solicitante a nombre de la Unidad de Gestión de Investigación y Proyección Social, adjuntando el respaldo de la transacción. * 
                    </Text>
                    <Text style={styles.baseText}>
                    *La Factura se entregará una vez que el investigador(a) solicite el pago de reembolso. 
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

         {/* Etiqueta de Firma */}
        <Text style={styles.baseText}>Firma del solicitante:  </Text>

        {/* Espacio en blanco para la firma */}
        <Text>{"\n\n\n"}</Text>

        {/* Nombre completo */}
        <Text style={styles.baseTextCenter}>________________________</Text>

        {/* Nombre completo */}
        <Text style={styles.tableCellTextBlueCenter}>
          { `${data.nombres.toUpperCase() + " " + data.apellidos.toUpperCase()}`}
        </Text>

        {/* Nombre del director y código de proyecto */}
        <Text style={styles.tableCellTextBlueCenter}>
          {`${data.departamento || "Departamento de prueba"}`}
        </Text>


      </Page>
    </PDFDocument>
  );

   // Convertir el documento PDF a un Blob
   const blob = await pdf(MyPDFDocument).toBlob();

   // Descargar automáticamente el archivo PDF
   saveAs(blob, `Anexo 2 - Formulario Pago Publicación Fuera de Proyecto.pdf`);
}

//formatear la fecha en formato dd/mm/yyyy
function formatDate(dateString) {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return `${day}-${month}-${year}`;
}

function capitalizeWords(str) {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
