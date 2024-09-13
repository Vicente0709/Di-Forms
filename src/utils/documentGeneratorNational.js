import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import { generate } from "@pdfme/generator";
import { text, image, barcodes } from "@pdfme/schemas";

import {basePdfAnexo10} from "../utilsNational/basePdfAnexo10";
import {schemasAnexo10} from "../utilsNational/schemasAnexo10";

import { basePdfAnexoANational } from "../utilsNational/basePdfAnexoANational";
import { schemasAnexoANational } from "../utilsNational/schemasAnexoANational";
//Constantes
const today = new Date();
const day = String(today.getDate()).padStart(2, "0");
const month = String(today.getMonth() + 1).padStart(2, "0"); // Los meses son 0-indexados, por lo que se suma 1
const year = today.getFullYear();
const formattedDate = `${day}/${month}/${year}`;

export async function generateMemoNationalOutsideProject1(data){
  const departament = capitalizeWords((data.departamento).toLowerCase());
  // Array para almacenar las solicitudes
  let solicitudes = [];
  
  // Verificar si se debe incluir "viáticos y subsistencias"
  if (data.viaticosSubsistencias === "SI") {
    solicitudes.push(" la asignación de viáticos y subsistencias");
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
                text: "Solicitud de auspicio institucional y solicitud de autorización para viaje nacional",
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
                text: `Por medio del presente comunico a usted que, en mi calidad de ${data.cargoJefeInmediato}, se ha otorgado el aval y permiso al profesor(a) ${data.nombres} ${data.apellidos}, profesor titular adscrito al ${departament}, para que participe en el evento " ${data.tituloEvento} " a realizarse en ${data.ciudadEvento}, Ecuador, del ${data.fechaInicioEvento} al ${data.fechaFinEvento}, para la presentación de la ponencia: " ${data.tituloPonencia} ". `,
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

export async function generateMemoNationalOutsideProject2(data){
  let solicitudes = [];
  
  // Verificar si se debe incluir "viáticos y subsistencias"
  if (data.viaticosSubsistencias === "SI") {
    solicitudes.push(" la asignación de viáticos y subsistencias");
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
                text: "Solicitud de auspicio institucional y solicitud de autorización para viaje nacional",
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
                text: `Por medio del presente solicito el aval y permiso para participar en el evento " ${data.tituloEvento} " a realizarse en ${data.ciudadEvento}, Ecuador, del ${data.fechaInicioEvento} al ${data.fechaFinEvento}, para la presentación de la ponencia: " ${data.tituloPonencia} ". `,
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

export async function generateAnexo10NationalOutsideProject(data){

    const template={
        schemas: schemasAnexo10,
        basePdf: basePdfAnexo10,
    };

    const plugins = { text, image, qrcode: barcodes.qrcode };
    
    let valorInscripcionStr = "";
   let fechaPagoInscripcionStr = "";
     
   if (data && data.inscripciones && Array.isArray(data.inscripciones)) {
     data.inscripciones.forEach((inscripcion) => {
       if (data.inscripcion === "SI") {
         if (inscripcion.valorInscripcion) {
           valorInscripcionStr += `$${inscripcion.valorInscripcion}\n`;
         }
   
         if (inscripcion.pagoLimite && inscripcion.limiteFecha) {
           fechaPagoInscripcionStr += `${inscripcion.pagoLimite} ${formatDate(inscripcion.limiteFecha)}\n`;
         }
       } else if (data.inscripcion === "NO") {
         // Manejo del caso en que data.inscripcion es "NO"
         valorInscripcionStr += '\n';
         fechaPagoInscripcionStr += '\n';
       }
     });
   }    
    
    const inputs = [
    {
      "nombresApellidos":               data.nombres.toUpperCase()+" "+data.apellidos.toUpperCase(),
      "fechaPedido":                    formattedDate,
      "departamento":                   data.departamento,
      "tituloEvento":                   data.tituloEvento,
      "ciudadPaisEvento":               data.ciudadEvento+ ", Ecuador",
      "fechaInicioEvento":              formatDate(data.fechaInicioEvento),
      "fechaFinEvento":                 formatDate(data.fechaFinEvento),
      "RelevanciaAcademica":            data.RelevanciaAcademica,
      "tituloPonencia":                 data.tituloPonencia,
      "tipoPonencia":                   data.tipoPonencia,
      "detalleArticuloSI":              data.detalleArticuloSI,
      "articuloPublicadoSi":            data.articuloPublicado==="SI" ? "X":"",
      "articuloPublicadoNo":            data.articuloPublicado==="NO" ? "X":"",
      "pasajesAereosSi":                data.pasajesAereos==="SI" ? "X":"",
      "pasajesAereosNo":                data.pasajesAereos==="NO" ? "X":"",
      "viaticosSubsistenciasSi":        data.viaticosSubsistencias==="SI"? "X": "",
      "viaticosSubsistenciasNo":        data.viaticosSubsistencias==="NO"? "X": "",
      "inscripcionSi":                  data.inscripcion==="SI"?"X":"",
      "inscripcionNo":                  data.inscripcion==="NO"?"X":"",
      "valorInscripcion":               valorInscripcionStr.trim(),
      "pagoLimiteFecha":                fechaPagoInscripcionStr.trim(),
      "metodoPagoTransferencia":        (data.metodoPago === "Transferencia" && data.inscripcion === "SI") ? "X" : "",
      "metodoPagoOtra":                 (data.metodoPago === "Otra" && data.inscripcion === "SI") ? "X" : "",
      "nombresAp":                      data.nombres.toUpperCase()+" "+data.apellidos.toUpperCase(),
      "departament":                    data.puesto.toUpperCase()
    }
  ];
  
    const pdf = await generate({ template, plugins, inputs });
    const blob = new Blob([pdf.buffer], { type: "application/pdf" });
    saveAs(
        blob,
        "Anexo 10 - Formulario salidas nacionales fuera de proyecto EPN.pdf"
      );

}

export async function generateAnexoANationalOutsideProject(data){
  const template = {
    schemas: schemasAnexoANational,
    basePdf: basePdfAnexoANational,
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
      " Para la presentación de la ponencia '" + data.tituloPonencia +"' del tipo "+ data.tipoPonencia;
  } else {
    ponentciaText = "";
  }
  const plugins = { text, image, qrcode: barcodes.qrcode };
  const transporteInfo = {};
    
  // Genera dinámicamente las propiedades para transporteTipo, transporteNombre, transporteRuta, transporteFechaS, transporteFechaSH, transporteFechaL, y transporteFechaLH
  for (let i = 0; i < 6; i++) {
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
      "lugar":              data.ciudadEvento + ", Ecuador",
      "puesto":             data.puesto,
      "unidadPerteneciente":data.departamento,
      
      "fechaSalida":        formatDate(data.transporteIda[0]?.fechaSalida),
      "horaSalida":         data.transporteIda[0]?.horaSalida,

      "fechaLlegada":       formatDate(ultimaFechaLlegada),
      "horaLlegada":        ultimaHoraLlegada,

      "servidores":         data.apellidos.toUpperCase() + " " + data.nombres.toUpperCase() + ". " +data.servidores.toUpperCase(),

      "actividades": "Asistencia al evento '" +
      data.tituloEvento +
      "', que tendrá lugar del " +
      data.fechaInicioEvento +
      " al " +
      data.fechaFinEvento +
      " en la ciudad de " +
      data.ciudadEvento +
      ", Ecuador."+
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
    "Anexo 1 - Solicitud de viáticos EPN.pdf"
  );
}



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