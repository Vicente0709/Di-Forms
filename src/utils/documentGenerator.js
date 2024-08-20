import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import { generate } from "@pdfme/generator";
import { text, image, barcodes } from "@pdfme/schemas";

//basepdf and schemas AnexoA
import { basePdfAnexoA } from './basePdfAnexoA';
import { schemasAnexoA } from './schemasAnexoA';

//Constantes 
const today = new Date();
const day = String(today.getDate()).padStart(2, '0');
const month = String(today.getMonth() + 1).padStart(2, '0'); // Los meses son 0-indexados, por lo que se suma 1
const year = today.getFullYear();
const formattedDate = `${day}/${month}/${year}`;

export function generateMemorandum(data) {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: "Formato de memorando",
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
                text: `En mi calidad de Director del Proyecto ${data.codigoProyecto}, AUTORIZO EL GASTO y solicito a usted se realicen las gestiones correspondientes para participar en el Evento titulado "${data.tituloEvento}" a realizarse en ${data.ciudadEvento}, ${data.paisEvento}, desde ${data.fechaInicioEvento} hasta ${data.fechaFinEvento}. Para lo cual, adjunto los correspondientes documentos.`,
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
                text: data.nombreCompleto.toUpperCase,
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
    saveAs(blob, "Memorando "+data.codigoProyecto+".docx");
  });
}

// Nueva función para generar el Anexo A en PDF
export async function generateAnexoA(data) {
  const template = {
    schemas: schemasAnexoA,
    basePdf:basePdfAnexoA,
  };

  const plugins = { text, image, qrcode: barcodes.qrcode };
  const inputs = [
  {
    "numSolicitud": data.codigoProyecto,
    "fechaSolicitud": formattedDate,
    "nombresCompletos": data.nombreCompleto.toUpperCase(),
    "lugar": data.ciudadEvento + ", " + data.paisEvento,
    "puesto": data.cargo,
    "unidadPerteneciente": data.departamento,
    "transporteTipo1": "",
    "horaSalida": "",
    "fechaLlegada": "",
    "horaLlegada": "",
    "servidores": "\n",
    "actividades": "\n",
    "transporteTipo2": "",
    "transporteTipo3": "",
    "transporteTipo4": "",
    "transporteRuta1": "",
    "transporteRuta2": "",
    "transporteRuta3": "",
    "transporteRuta4": "",
    "transporteFechaLH1": "",
    "transporteFechaLH2": "",
    "transporteFechaLH3": "",
    "transporteFechaLH4": "",
    "transporteNombre1": "",
    "transporteNombre2": "",
    "transporteNombre3": "",
    "transporteNombre4": "",
    "transporteFechaS1": "",
    "transporteFechaL1": "",
    "transporteFechaS2": "",
    "transporteFechaL2": "",
    "transporteFechaS3": "",
    "transporteFechaL": "",
    "transporteFechaS4": "",
    "transporteFechaL3": "",
    "transporteFechaSH1": "",
    "transporteFechaSH2": "",
    "transporteFechaSH3": "",
    "transporteFechaSH4": "",
    "fechaSalida": "",
    "banco": "",
    "viaticos": data.viaticosSubsistencias === "SI" ? "X" : "",
    "movilizacion": data.movilizacion === "SI" ? "X" : "",
    "subsistencias": data.viaticosSubsistencias === "SI" ? "X" : "",
    "alimentacion": data.alimentacion === "SI" ? "X" : "",
    "bancoTipoCuenta": data.tipoCuenta,
    "numeroCuenta": data.numeroCuenta,
    "nombresCompletos2": data.nombreCompleto.toUpperCase()+ "\n" + data.cargo.toUpperCase() +"\n"+ data.cedula,
    "nombresCompletosJefeInmediato": data.nombreJefeInmediato.toUpperCase() + "\n" + data.cargoJefeInmediato.toUpperCase(),
  }
];
  const pdf = await generate({ template, plugins, inputs });

  const blob = new Blob([pdf.buffer], { type: "application/pdf" });
  saveAs(blob, "Anexo 1 - Solicitud de viáticos EPN "+data.codigoProyecto + ".pdf");
}
