import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import { generate } from "@pdfme/generator";
import { text, image, barcodes } from "@pdfme/schemas";

import {basePdfAnexo10} from "./basePdfAnexo10";
import {schemasAnexo10} from "./schemasAnexo10";

import { basePdfAnexoANational } from "./basePdfAnexoANational";
import { schemasAnexoANational } from "./schemasAnexoANational";

import { basePdfAnexo2 } from "./basePdfAnexo2";
import { schemasAnexo2 } from "./schemasAnexo2";



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
      "metodoPagoTransferencia":        data.metodoPago==="Transferencia"? "X":"",
      "metodoPagoOtra":                 data.metodoPago==="Otra"? "X":"",
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
      "Para la presentación de la ponencia '" + data.tituloPonencia +"' del tipo "+ data.tipoPonencia;
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

export function generateMemoWithinProject(data) {
  const nombresApellidos = capitalizeWords((data.nombres + " " + data.apellidos).toLowerCase());
  let solicitudOracion = "Para lo cual solicito ";

  // Array para almacenar las solicitudes
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

  // Construir la oración final
  if (solicitudes.length > 0) {
    solicitudOracion += solicitudes.join(", ") + ".";
  } else {
    solicitudOracion = "";
  }

  // Determinar el texto según el rol en el proyecto
  let cuerpoMemorando;
  if (data.rolEnProyecto === "Director") {
    cuerpoMemorando = `En mi calidad de Director del Proyecto ${data.codigoProyecto}, autorizo el gasto y solicito a usted se realicen las gestiones correspondientes para participar en el evento titulado "${data.tituloEvento}" a realizarse en ${data.ciudadEvento}, ${data.paisEvento}, desde ${data.fechaInicioEvento} hasta ${data.fechaFinEvento}. ${solicitudOracion}`;
  } else {
    cuerpoMemorando = `En mi calidad de Director del Proyecto ${data.codigoProyecto}, autorizo el gasto y solicito a usted se realicen las gestiones correspondientes para que el Sr./Sra. "${nombresApellidos}", ${data.rolEnProyecto} del proyecto, pueda participar en el evento titulado "${data.tituloEvento}" a realizarse en ${data.ciudadEvento}, ${data.paisEvento}, desde ${data.fechaInicioEvento} hasta ${data.fechaFinEvento}. ${solicitudOracion}`;
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: "Formato de memorando PARTICIPACION EN EVENTO NACIONAL DENTRO DE PROYECTO",
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
                    ? data.nombres.toUpperCase() + " " + data.apellidos.toUpperCase()
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

export async function generateAnexoAWithinProject(data) {
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
    data.tituloPonencia.trim() !== "No Aplica"
  ) {
    ponentciaText =
      "Para la participacion de la ponencia '" + data.tituloPonencia + "'";
  } else {
    ponentciaText = "";
  }

  var servidoresText = "";
  if (data.servidores && data.servidores.trim() !== "") {
   servidoresText = ", " + data.servidores;
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

      "servidores":         data.apellidos.toUpperCase() + " " + data.nombres.toUpperCase() + servidoresText.toUpperCase(),

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

export async function generateAnexo2WithinProject(data) {

  const template = {
    schemas: schemasAnexo2,
    basePdf: basePdfAnexo2, 
  };
  const plugins = { text, image, qrcode: barcodes.qrcode };
  let valorInscripcionStr = "";
  let fechaPagoInscripcionStr = "";
  // Iteramos sobre cada inscripción en el array 'inscripciones'
  data.inscripciones.forEach((inscripcion) => {
    // Concatenamos el valor de inscripción con un '$' y un salto de línea
    if (data.inscripcion === "SI" && inscripcion.valorInscripcion) {
      valorInscripcionStr += `${inscripcion.monedaPago}${inscripcion.valorInscripcion}\n`;
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
      "rolProyecto": data.rolEnProyecto,
      "departamento": data.departamento,
      "nombresParticipante": data.apellidos.toUpperCase() + " " + data.nombres.toUpperCase(),
      "tituloEvento": data.tituloEvento,
      "fechasEvento": "Desde el " + data.fechaInicioEvento + " hasta el " + data.fechaFinEvento,
      "ciudad": data.ciudadEvento.toUpperCase(),
      "pais": "ECUADOR",
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

      "objetivoEvento": data.objetivoProyecto,
      "relevanciaEvento": data.relevanciaEvento,
      
      "valorInscripcion": valorInscripcionStr.trim(), // Removemos el último salto de línea
      "fechaPagoInscripcion": fechaPagoInscripcionStr.trim(), // Removemos el último salto de línea


      "transferencia": (data.metodoPago === "Transferencia" && data.inscripcion === "SI") ? "X" : "",
      "otroPago": (data.metodoPago === "Otra" && data.inscripcion === "SI") ? "X" : "",

      "nombreDirector":   data.rolEnProyecto === "Director" ? data.nombres.toUpperCase() + " " + data.apellidos.toUpperCase() : data.nombreDirector.toUpperCase(),
      "codigoProyecto2": data.codigoProyecto,
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