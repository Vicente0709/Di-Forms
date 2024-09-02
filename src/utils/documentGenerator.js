import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import { generate } from "@pdfme/generator";
import { text, image, barcodes } from "@pdfme/schemas";

//basepdf and schemas AnexoA
import { basePdfAnexoA } from "./basePdfAnexoA";
import { schemasAnexoA } from "./schemasAnexoA";
//basepdf and schemas AnexoA2
import { basePdfAnexoA2 } from "./basePdfAnexoA2";
import { schemasAnexoA2 } from "./schemasAnexoA2";

import { basepdfAnexo8 } from "./basepdfAnexo8";
import { schemaAnexo8 } from "./schemaAnexo8";


//Constantes
const today = new Date();
const day = String(today.getDate()).padStart(2, "0");
const month = String(today.getMonth() + 1).padStart(2, "0"); // Los meses son 0-indexados, por lo que se suma 1
const year = today.getFullYear();
const formattedDate = `${day}/${month}/${year}`;

 

export function generateMemoWithinProjec1(data) {
  
  let solicitudOracion = "Para lo cual solicito ";
  // Array para almacenar las solicitudes
  let solicitudes = [];
  // Verificar si se debe incluir "pasajes aéreos"
  if (data.pasajesAereos === "SI") {
    solicitudes.push("la compra de pasajes aéreos");
  }
  // Verificar si se debe incluir "viáticos y subsistencias"
  if (data.viaticosSubsistencias === "SI") {
    solicitudes.push("la asignación de viáticos y subsistencias");
  }
  // Verificar si se debe incluir "pago de inscripción"
  if (data.inscripcion === "SI") {
    solicitudes.push("el pago de inscripción");
  }

  // Construir la oración final
  if (solicitudes.length > 0) {
    solicitudOracion += solicitudes.join(", ") + ".";
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
                text: "Formato de memorando PARTICIPACION EN EVENTO DENTRO DE PROYECTO ",
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
                text: "Solicitud dentro de proyecto, de auspicio para movilidad al exterior para participar en evento académico",
                size: 22,
                font: "Aptos (Cuerpo)",
              }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `En mi calidad de Director del Proyecto ${data.codigoProyecto}, autorizo el gasto y solicito a usted se realicen las gestiones correspondientes para participar en el evento titulado "${data.tituloEvento}" a realizarse en ${data.ciudadEvento}, ${data.paisEvento}, desde ${data.fechaInicioEvento} hasta ${data.fechaFinEvento}. Para lo cual, adjunto los correspondientes documentos.`,
                size: 20,
                font: "Times New Roman",
              }),
            ],
            spacing: { after: 300 },
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
    saveAs(blob, "Memorando " + data.codigoProyecto + ".docx");
  });
}
export function generateMemoWithinProjec2(data) {
  const nombresApellidos = capitalizeWords((data.nombres + " " + data.apellidos).toLowerCase());
  let solicitudOracion = "Para lo cual solicito ";

  // Array para almacenar las solicitudes
  let solicitudes = [];
  // Verificar si se debe incluir "pasajes aéreos"
  if (data.pasajesAereos === "SI") {
    solicitudes.push("la compra de pasajes aéreos");
  }
  // Verificar si se debe incluir "viáticos y subsistencias"
  if (data.viaticosSubsistencias === "SI") {
    solicitudes.push("la asignación de viáticos y subsistencias");
  }
  // Verificar si se debe incluir "pago de inscripción"
  if (data.inscripcion === "SI") {
    solicitudes.push("el pago de inscripción");
  }

  // Construir la oración final
  if (solicitudes.length > 0) {
    solicitudOracion += solicitudes.join(", ") + ".";
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
                text: "Formato de memorando PARTICIPACION EN EVENTO DENTRO DE PROYECTO ",
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
                text: `Solicitud dentro de proyecto para movilidad al exterior para participar en evento académico/${data.codigoProyecto} `,
                size: 22,
                font: "Aptos (Cuerpo)",
              }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `En mi calidad de Director del Proyecto ${data.codigoProyecto}, autorizo el gasto y solicito a usted se realicen las gestiones correspondientes para que el Sr."${nombresApellidos}", ${data.rolEnProyecto} del proyecto pueda participar en el evento titulado "${data.tituloProyecto}", a realizarse en ${data.ciudadEvento}, ${data.paisEvento}, desde ${data.fechaInicioEvento} hasta ${data.fechaFinEvento}. ${solicitudOracion}`,
                size: 20,
                font: "Times New Roman",
              }),
            ],
            spacing: { after: 300 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Se adjunta los documentos correspondientes.",
                size: 20,
                font: "Times New Roman",
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
                text: `${data.rolEnProyecto.toUpperCase()} DEL PROYECTO ${data.codigoProyecto.toUpperCase()}`,
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
    saveAs(blob, "Memorando " + data.codigoProyecto + ".docx");
  });
}

export function generateMemoOutsideProject1(data){
  let solicitudOracion = "la asignación de ";
  // Array para almacenar las solicitudes
  let solicitudes = [];
  // Verificar si se debe incluir "pasajes aéreos"
  if (data.pasajesAereos === "SI") {
    solicitudes.push("la compra de pasajes aéreos");
  }
  // Verificar si se debe incluir "viáticos y subsistencias"
  if (data.viaticosSubsistencias === "SI") {
    solicitudes.push("viáticos y subsistencias");
  }
  // Verificar si se debe incluir "pago de inscripción"
  if (data.inscripcion === "SI") {
    solicitudes.push("el pago de inscripción");
  }

  // Construir la oración final
  if (solicitudes.length > 0) {
    solicitudOracion += solicitudes.join(", ") + ".";
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
                text: "Solicitud de auspicio institucional y solicitud de autorización para viaje al exterior",
                size: 22,
                font: "Aptos (Cuerpo)",
              }),
            ],
            spacing: { after: 200 },
          }),new Paragraph({
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
                text: `Por medio del presente comunico a usted que, en mi calidad de ${data.cargoJefeInmediato}, se ha otorgado el aval y permiso al profesor(a) ${data.nombres} ${data.apellidos}, profesor titular adscrito al ${data.departamento[0]}${data.departamento.slice(1).toLowerCase()}, para que participe en el evento " ${data.tituloEvento} " a realizarse en ${data.ciudadEvento}, ${data.paisEvento}, del ${data.fechaInicioEvento} al ${data.fechaFinEvento}, para la presentación de la ponencia: " ${data.tituloPonencia} ". `,
                size: 20,
                font: "Times New Roman",
              }),
            ],
            spacing: { after: 300 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Por lo expuesto, solicito muy comedidamente, se realicen los trámites pertinentes para que el profesor ${data.nombres} ${data.apellidos}, pueda participar en la conferencia antes mencionada y de igual forma se auspicie con presupuesto del Vicerrectorado de Investigación, Innovación y Vinculación, ${solicitudOracion}`,
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
                bold: true,
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
    saveAs(blob, "Memorando " + data.codigoProyecto + ".docx");
  });
}

export function generateMemoOutsideProject2(data){

  let solicitudOracion = "la asignación de ";
  // Array para almacenar las solicitudes
  let solicitudes = [];
  // Verificar si se debe incluir "pasajes aéreos"
  if (data.pasajesAereos === "SI") {
    solicitudes.push("la compra de pasajes aéreos");
  }
  // Verificar si se debe incluir "viáticos y subsistencias"
  if (data.viaticosSubsistencias === "SI") {
    solicitudes.push("viáticos y subsistencias");
  }
  // Verificar si se debe incluir "pago de inscripción"
  if (data.inscripcion === "SI") {
    solicitudes.push("el pago de inscripción");
  }

  // Construir la oración final
  if (solicitudes.length > 0) {
    solicitudOracion += solicitudes.join(", ") + ".";
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
                text: `Por medio del presente solicito el  aval y permiso para participar en el evento " ${data.tituloEvento} " a realizarse en ${data.ciudadEvento}, ${data.paisEvento}, del ${data.fechaInicioEvento} al ${data.fechaFinEvento}, para la presentación de la ponencia: " ${data.tituloPonencia} ". `,
                size: 20,
                font: "Times New Roman",
              }),
            ],
            spacing: { after: 300 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Adicionalmente solicito se realicen los trámites pertinentes para que se auspicie con presupuesto del Vicerrectorado de Investigación, Innovación y Vinculación, ${solicitudOracion}`, 
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
                bold: true,
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
    saveAs(blob, "Memorando " + data.codigoProyecto + ".docx");
  });
}

export function generateMemoTripWithinProjec1(data) {
  let solicitudOracion = "Para lo cual solicito ";

  // Verificar si se debe incluir "pasajes aéreos"
  if (data.pasajesAereos === "SI" && data.viaticosSubsistencias === "SI") {
    solicitudOracion += "se realice la compra de pasajes aéreos y asignación de viáticos y subsistencias.";
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
                text: `Solicitud dentro de proyecto para movilidad al exterior para viaje técnico/ ${data.codigoProyecto}`,
                size: 22,
                font: "Aptos (Cuerpo)",
              }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `En mi calidad de Director del Proyecto ${data.codigoProyecto}, autorizo el gasto y solicito a usted se realicen las gestiones correspondientes para realizar un viaje técnico  "${data.tituloEvento}" a realizarse en ${data.ciudadEvento}, ${data.paisEvento}, desde ${data.fechaInicioEvento} hasta ${data.fechaFinEvento}. ${solicitudOracion}`,
                size: 20,
                font: "Times New Roman",
              }),
            ],
            spacing: { after: 300 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Se adjunta los documentos correspondientes.",
                size: 20,
                font: "Times New Roman",
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
    saveAs(blob, "Memorando " + data.codigoProyecto + ".docx");
  });
}
export function generateMemoTripWithinProjec2(data) {
  const nombresApellidos = capitalizeWords((data.nombres + " " + data.apellidos).toLowerCase());
  let solicitudOracion = "Para lo cual solicito ";

  // Verificar si se debe incluir "pasajes aéreos"
  if (data.pasajesAereos === "SI" && data.viaticosSubsistencias === "SI") {
    solicitudOracion += "se realice la compra de pasajes aéreos y asignación de viáticos y subsistencias.";
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
                text: `Solicitud dentro de proyecto para movilidad al exterior para viaje técnico/${data.codigoProyecto} `,
                size: 22,
                font: "Aptos (Cuerpo)",
              }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `En mi calidad de Director del Proyecto ${data.codigoProyecto}, autorizo el gasto y solicito a usted se realicen las gestiones correspondientes para que el Sr."${nombresApellidos}", ${data.rolEnProyecto} del proyecto pueda realizar un viaje tecnico "${data.nombreInstitucionAcogida}", a realizarse en ${data.ciudadEvento}, ${data.paisEvento}, desde ${data.fechaInicioEvento} hasta ${data.fechaFinEvento}. ${solicitudOracion}`,
                size: 20,
                font: "Times New Roman",
              }),
            ],
            spacing: { after: 300 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Se adjunta los documentos correspondientes.",
                size: 20,
                font: "Times New Roman",
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
                text: `${data.rolEnProyecto.toUpperCase()} DEL PROYECTO ${data.codigoProyecto.toUpperCase()}`,
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
    saveAs(blob, "Memorando " + data.codigoProyecto + ".docx");
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
  console.log('Transporte Array:', transporte);
  const ultimaFechaLlegada =
    transporte.length > 0
      ? transporte[transporte.length - 1]?.fechaLlegada
      : "";
  const ultimaHoraLlegada =
    transporte.length > 0
      ? transporte[transporte.length - 1]?.horaLlegada
      : "";
  var ponentciaText = "";
  if (
    data.tituloPonencia &&
    data.tituloPonencia.trim() !== "" &&
    data.tituloPonencia.trim() !== "No aplica"
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
    transporteInfo[`transporteTipo${i + 1}`] = transporte[i]?.tipoTransporte || "";
    transporteInfo[`transporteNombre${i + 1}`] = transporte[i]?.nombreTransporte || "";
    transporteInfo[`transporteRuta${i + 1}`] = transporte[i]?.ruta || "";
    transporteInfo[`transporteFechaS${i + 1}`] = formatDate(transporte[i]?.fechaSalida) || "";
    transporteInfo[`transporteFechaSH${i + 1}`] = transporte[i]?.horaSalida || "";
    transporteInfo[`transporteFechaL${i + 1}`] = formatDate(transporte[i]?.fechaLlegada) || "";
    transporteInfo[`transporteFechaLH${i + 1}`] = transporte[i]?.horaLlegada || "";
  }
  const inputs = [
    {
      "fechaSolicitud":     formattedDate,
      "viaticos":           data.viaticosSubsistencias === "SI" ? "X" : "",
      "movilizacion":       data.viaticosSubsistencia === "SI" ? "X" : "",
      "subsistencias":      data.viaticosSubsistencias === "SI" ? "X" : "",
      "alimentacion":       data.viaticosSubsistencia === "SI" ? "X" : "",
      
      "nombresCompletos":   data.apellidos.toUpperCase() + " " + data.nombres.toUpperCase(),
      "lugar":              data.ciudadEvento + ", " + data.paisEvento,
      "puesto":             data.cargo,
      "unidadPerteneciente":data.departamento,

      "fechaSalida":        formatDate(data.transporteIda[0]?.fechaSalida),
      "horaSalida":         data.transporteIda[0]?.horaSalida,

      "fechaLlegada":       formatDate(ultimaFechaLlegada),
      "horaLlegada":        ultimaHoraLlegada,

      "servidores":         data.apellidos.toUpperCase() + " " + data.nombres.toUpperCase() + data.servidores.toUpperCase(),

      "actividades": "Dentro de las actividades del proyecto  " +
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

      "banco": data.nombreBanco,
      "bancoTipoCuenta": data.tipoCuenta,
      "numeroCuenta": data.numeroCuenta,

      "nombresCompletos2": data.nombres.toUpperCase() +
      " " +
      data.apellidos.toUpperCase() +
      "\n" +
      data.cargo.toUpperCase() +
      "\n" +
      data.cedula,

      "nombresCompletosJefeInmediato": data.nombreJefeInmediato.toUpperCase() +
      "\n" +
      data.cargoJefeInmediato.toUpperCase()
    }
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
    transporte.length > 0
      ? transporte[transporte.length - 1]?.horaLlegada
      : "";

  const plugins = { text, image, qrcode: barcodes.qrcode };
  const transporteInfo = {};
  // Genera dinámicamente las propiedades para transporteTipo, transporteNombre, transporteRuta, transporteFechaS, transporteFechaSH, transporteFechaL, y transporteFechaLH
  for (let i = 0; i < 8; i++) {
    transporteInfo[`transporteTipo${i + 1}`] = transporte[i]?.tipoTransporte || "";
    transporteInfo[`transporteNombre${i + 1}`] = transporte[i]?.nombreTransporte || "";
    transporteInfo[`transporteRuta${i + 1}`] = transporte[i]?.ruta || "";
    transporteInfo[`transporteFechaS${i + 1}`] = formatDate(transporte[i]?.fechaSalida) || "";
    transporteInfo[`transporteFechaSH${i + 1}`] = transporte[i]?.horaSalida || "";
    transporteInfo[`transporteFechaL${i + 1}`] = formatDate(transporte[i]?.fechaLlegada) || "";
    transporteInfo[`transporteFechaLH${i + 1}`] = transporte[i]?.horaLlegada || "";
  }

  const inputs = [
    {
      "fechaSolicitud":     formattedDate,
      "viaticos":           data.viaticosSubsistencias === "SI" ? "X" : "",
      "movilizacion":       data.viaticosSubsistencias === "SI" ? "X" : "",
      "subsistencias":      data.viaticosSubsistencias === "SI" ? "X" : "",
      "alimentacion":       data.viaticosSubsistencias === "SI" ? "X" : "",
      
      "nombresCompletos":   data.apellidos.toUpperCase() + " " + data.nombres.toUpperCase(),
      "lugar":              data.ciudadEvento + ", " + data.paisEvento,
      "puesto":             data.cargo,
      "unidadPerteneciente":data.departamento,

      "fechaSalida":        formatDate(data.transporteIda[0]?.fechaSalida),
      "horaSalida":         data.transporteIda[0]?.horaSalida,

      "fechaLlegada":       formatDate(ultimaFechaLlegada),
      "horaLlegada":        ultimaHoraLlegada,

      "servidores":         data.apellidos.toUpperCase() + " " + data.nombres.toUpperCase() +". "+ data.servidores.toUpperCase(),

      "actividades": "Dentro de las actividades del proyecto  " +
      data.codigoProyecto +
      " titulado  '" +
      data.tituloProyecto +
      "'  se llevará a cabo un viaje técnico a cargo de la intitucion de acogida '" +
      data.nombreInstitucionAcogida +
      "', que tendrá lugar del  " +
      data.fechaInicioEvento +
      "  al  " +
      data.fechaFinEvento +
      " en la ciudad de  " +
      data.ciudadEvento +
      "," +
      data.paisEvento +
      ". ",

      ...transporteInfo,

      "banco": data.nombreBanco,
      "bancoTipoCuenta": data.tipoCuenta,
      "numeroCuenta": data.numeroCuenta,

      "nombresCompletos2": data.nombres.toUpperCase() +
      " " +
      data.apellidos.toUpperCase() +
      "\n" +
      data.cargo.toUpperCase() +
      "\n" +
      data.cedula,

      "nombresCompletosJefeInmediato": data.nombreJefeInmediato.toUpperCase() +
      "\n" +
      data.cargoJefeInmediato.toUpperCase()
    }
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
  const diferencia = JSON.parse(localStorage.getItem("diferenciaDias"))?.diferencia || 0;
  const actividades = {};

  // Genera dinámicamente las propiedades para activN, activFecha, y activDescripcion
  for (let i = 0; i < 22; i++) {
    actividades[`activN${i + 1}`] = (data.actividadesInmutables[i] && diferencia > 15) ? (i + 1).toString() : "";
    actividades[`activFecha${i + 1}`] = diferencia < 16 ? "" : data.actividadesInmutables[i]?.fecha || "";
    actividades[`activDescripcion${i + 1}`] = diferencia < 16 ? "" : data.actividadesInmutables[i]?.descripcion || "";
  }
  let valorInscripcionStr = "";
  let fechaPagoInscripcionStr = "";

  // Iteramos sobre cada inscripción en el array 'inscripciones'
  data.inscripciones.forEach((inscripcion) => {
    // Concatenamos el valor de inscripción con un '$' y un salto de línea
    if (data.inscripcion === "SI" && inscripcion.valorInscripcion) {
      valorInscripcionStr += `$${inscripcion.valorInscripcion}\n`;
    }

    // Construimos la cadena de la fecha de pago dependiendo de cuál campo tiene valor
    if (data.inscripcion === "SI" && inscripcion.pagoLimite && inscripcion.limiteFecha) {
      fechaPagoInscripcionStr += `${inscripcion.pagoLimite} ${inscripcion.limiteFecha}\n`;
    }
  });
  

  const inputs = [
    {
      "fechaPag1": formattedDate,
      "codigoProyecto": data.codigoProyecto,
      "tituloProyecto": data.tituloProyecto,
      "nombresParticipante":  data.apellidos.toUpperCase() + " " + data.nombres.toUpperCase(),
      "rolProyecto": data.rolEnProyecto,
      "departamento": data.departamento,
      "tituloEvento": data.tituloEvento,
      "ciudad": data.ciudadEvento.toUpperCase(),
      "pais": data.paisEvento.toUpperCase(),
      "fechasEvento":  "Desde el " + data.fechaInicioEvento + " hasta el " + data.fechaFinEvento,
      "tipoEvento1": data.tipoEvento === "Conferencia o congreso" ? "X" : "",
      "tipoEvento2": data.tipoEvento === "Taller" ? "X" : "",
      "tipoEvento3": data.tipoEvento === "Otro evento académico" ? "X" : "",
      "tipoEvento3otro": data.otroEventoEspecificar,
      "participacion1":  data.participacionEvento === "Presentación de artículo indexado"? "X": "",
      "participacion2": data.participacionEvento === "Presentación de póster, abstract, charla magistral u otros" ? "X": "",
      "participacion3": data.participacionEvento === "Asistencia" ? "X" : "",
      "ponencia": data.tituloPonencia,
      "pasajesS": data.pasajesAereos === "SI" ? "X" : "",
      "viaticosS": data.viaticosSubsistencias === "SI" ? "X" : "",
      "inscripcionS": data.inscripcion === "SI" ? "X" : "",
      "pasajesN": data.pasajesAereos === "NO" ? "X" : "",
      "viaticosN": data.viaticosSubsistencias === "NO" ? "X" : "",
      "inscripciónN": data.inscripcion === "NO" ? "X" : "",

      "fechaPag2": formattedDate,
      "objetivoEvento": data.objetivoProyecto,
      "relevanciaEvento": data.relevanciaEvento,

      "valorInscripcion": valorInscripcionStr.trim(), // Removemos el último salto de línea
      "fechaPagoInscripcion": fechaPagoInscripcionStr.trim(), // Removemos el último salto de línea


      "transferencia": data.metodoPago === "Transferencia" ? "X" : "",
      "otroPago": data.metodoPago === "Otra" ? "X" : "",
      "hospedajeS": data.hospedaje === "SI" ? "X" : "",
      "hospedajeN": data.hospedaje === "NO" ? "X" : "",
      "movS": data.movilizacion === "SI" ? "X" : "",
      "movN": data.movilizacion === "NO" ? "X" : "",
      "alimentacionS": data.alimentacion === "SI" ? "X" : "",
      "alimentacionN": data.alimentacion === "NO" ? "X" : "",
      "declaraciónN": data.seleccionDeclaracion === "noCubre" ? "X" : "",
      "declaracioneS": data.seleccionDeclaracion === "siCubre" ? "X" : "",

      "fechaPag3": formattedDate,

      ...actividades,

      "justificacionMas15":diferencia < 16 ? "No aplica" :data.justificacionComision,
      "fechaSolicitud": formattedDate,
      "nombreDirector":  data.nombres.toUpperCase()+ " "+data.apellidos.toUpperCase(),
      "codigoProyecto2": data.codigoProyecto,

      "fechaPag4": formattedDate,
      "calculo": "Calculo dias de comision entre las fechas de salida y de regreso: " + diferencia
    }
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

export async function generateAnexoAOutsideProject(data){
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
    transporte.length > 0
      ? transporte[transporte.length - 1]?.horaLlegada
      : "";

  var ponentciaText = "";
  if (
    data.tituloPonencia &&
    data.tituloPonencia.trim() !== "" &&
    data.tituloPonencia.trim() !== "No aplica"
  ) {
    ponentciaText =
      "Para la participacion de la ponencia '" + data.tituloPonencia +"' del tipo "+ data.tipoPonencia;
  } else {
    ponentciaText = "";
  }
  const plugins = { text, image, qrcode: barcodes.qrcode };
  const transporteInfo = {};
  // Genera dinámicamente las propiedades para transporteTipo, transporteNombre, transporteRuta, transporteFechaS, transporteFechaSH, transporteFechaL, y transporteFechaLH
    
  // Genera dinámicamente las propiedades para transporteTipo, transporteNombre, transporteRuta, transporteFechaS, transporteFechaSH, transporteFechaL, y transporteFechaLH
  for (let i = 0; i < 8; i++) {
    transporteInfo[`transporteTipo${i + 1}`] = transporte[i]?.tipoTransporte || "";
    transporteInfo[`transporteNombre${i + 1}`] = transporte[i]?.nombreTransporte || "";
    transporteInfo[`transporteRuta${i + 1}`] = transporte[i]?.ruta || "";
    transporteInfo[`transporteFechaS${i + 1}`] = formatDate(transporte[i]?.fechaSalida) || "";
    transporteInfo[`transporteFechaSH${i + 1}`] = transporte[i]?.horaSalida || "";
    transporteInfo[`transporteFechaL${i + 1}`] = formatDate(transporte[i]?.fechaLlegada) || "";
    transporteInfo[`transporteFechaLH${i + 1}`] = transporte[i]?.horaLlegada || "";
  }

  const inputs = [
    {
      "fechaSolicitud":     formattedDate,
      "viaticos":           data.viaticosSubsistencias === "SI" ? "X" : "",
      "movilizacion":       data.viaticosSubsistencias === "SI" ? "X" : "" ,
      "subsistencias":      data.viaticosSubsistencias === "SI" ? "X" : "",
      "alimentacion":       data.viaticosSubsistencias === "SI" ? "X" : "",
      "nombresCompletos":   data.apellidos.toUpperCase() + " " + data.nombres.toUpperCase(),
      "lugar":              data.ciudadEvento + ", " + data.paisEvento,
      "puesto":             data.puesto,
      "unidadPerteneciente":data.departamento,
      
      "fechaSalida":        formatDate(data.transporte[0]?.fechaSalida),
      "horaSalida":         data.transporte[0]?.horaSalida,

      "fechaLlegada":       formatDate(ultimaFechaLlegada),
      "horaLlegada":        ultimaHoraLlegada,

      "servidores":         data.apellidos.toUpperCase() + " " + data.nombres.toUpperCase() + ". " +data.servidores.toUpperCase(),

      "actividades": "Participación en el evento  '" +
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

      "banco": data.nombreBanco,
      "bancoTipoCuenta": data.tipoCuenta,
      "numeroCuenta": data.numeroCuenta,

      "nombresCompletos2": data.nombres.toUpperCase() +
      " "+
      data.apellidos.toUpperCase() +
      "\n" +
      data.puesto.toUpperCase() +
      "\n" +
      data.cedula,

      "nombresCompletosJefeInmediato": data.nombreJefeInmediato.toUpperCase() +
      "\n" +
      data.cargoJefeInmediato.toUpperCase()
    }
  ];
  
  
  
  
  const pdf = await generate({ template, plugins, inputs });

  const blob = new Blob([pdf.buffer], { type: "application/pdf" });
  saveAs(
    blob,
    "Anexo 1 - Solicitud de viáticos EPN " + data.codigoProyecto + ".pdf"
  );
}

export async function generateAnexo8OutsideProject(data){

const template= {
schemas: schemaAnexo8,
basePdf: basepdfAnexo8,
};
const plugins = { text, image, qrcode: barcodes.qrcode };
const inscripcion = data.inscripciones;

const Inscripciones = {};
  // Genera dinámicamente las propiedades para transporteTipo, transporteNombre, transporteRuta, transporteFechaS, transporteFechaSH, transporteFechaL, y transporteFechaLH
    
  // Genera dinámicamente las propiedades para transporteTipo, transporteNombre, transporteRuta, transporteFechaS, transporteFechaSH, transporteFechaL, y transporteFechaLH
  for (let i = 0; i < 8; i++) {
    Inscripciones[`valorInscripcion${i + 1}`] = inscripcion[i]?.valorInscripcion || "";
    Inscripciones[`limiteFecha${i + 1}`] = inscripcion[i]?.pagoLimite || "";
   
  }

const inputs = [
  {
    "nombres":                data.nombres.toUpperCase() +" "+ data.apellidos.toUpperCase(),
    "departamento":           data.departamento,
    "tituloEvento":           data.tituloEvento,
    "lugarEvento":            data.ciudadEvento+", "+data.paisEvento,
    "fechaInicioEvento":      data.fechaInicioEvento,
    "fechaFinEvento":         data.fechaFinEvento,
    "RelevanciaAcademica":    data.RelevanciaAcademica,
    "tituloPonencia":         data.tituloPonencia,
    "tipoPonencia":           data.tipoPonencia,
    "detalleArticuloSI":      data.detalleArticuloSI,
    "articuloPublicadoSi":    data.articuloPublicado==="SI" ? "X":"",
    "articuloPublicadoNo":    data.articuloPublicado==="NO"? "X":"",
    "pasajesAereosSi":        data.pasajesAereos==="SI" ? "X":"",
    "pasajesAereosNo":        data.pasajesAereos==="NO" ? "X":"",
    "viaticosSubsistenciasSi": data.viaticosSubsistencias==="SI"? "X": "",
    "viaticosSubsistenciasNo": data.viaticosSubsistencias==="NO"? "X": "",
    "inscripsionSi":           data.inscripcion==="SI"?"X":"",
    "inscripcionNo":           data.inscripcion==="NO"?"X":"",
    "metodoPagoTransferencia": data.metodoPago==="Transferencia"? "X":"",
    "metodoPagoOtra":          data.metodoPago==="Otra"? "X":"",
    "hospedajeSi":            data.hospedaje==="SI"?"X":"",
    "HospedajeNo":            data.hospedaje==="NO"?"X":"",
    "alimentacionSi":         data.alimentacion==="SI"?"X":"",
    "alimentacionNo":         data.alimentacion==="NO"?"X":"",
    "movilizacionInternaSi":  data.movilizacion==="SI"?"X":"",
    "movilizacionInternaNo":  data.movilizacion==="NO"?"X":"",
    "seleccionDeclaracionNo": data.seleccionDeclaracion==="NO"?"X":"",
    "seleccionDeclaracionSi": data.seleccionDeclaracion==="SI"?"X":"",
    "nombre":                 data.nombres.toUpperCase()+" "+data.apellidos.toUpperCase(),
    "puesto":                 data.puesto.toUpperCase()
  }
  
];

const pdf = await generate({ template, plugins, inputs });

  const blob = new Blob([pdf.buffer], { type: "application/pdf" });
  saveAs(
    blob,
    "Anexo 1 - Solicitud de viáticos EPN " + data.codigoProyecto + ".pdf"
  );

}



//formatear la fecha en formato dd/mm/yyyy
function formatDate(dateString) {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return `${day}-${month}-${year}`;
}

function capitalizeWords(str) {
  return str.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
}