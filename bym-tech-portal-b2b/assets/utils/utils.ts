import { useI18n } from 'vue-i18n';
import { jsPDF } from 'jspdf'
import axios from 'axios';
import nodemailer from 'nodemailer'
import Buffer from 'buffer'
import type orderInterface from './interfaces/orderInterface';

const isValidJsonString = (str: string) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
const pageCount = (data: any, itemsPerPage) => {
    return Math.ceil(data.length / itemsPerPage);

}



function formatBlogDate(fecha:any){
    const date = new Date(fecha);

    const formattedDate = new Intl.DateTimeFormat('es-AR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
    return formattedDate
}

function formatDate(date: any) {
    if (typeof date === 'string') {
        date = new Date(date);
        if (isNaN(date.getTime())) {
            throw new Error("Input string is not a valid date");
        }
    } else if (!(date instanceof Date)) {
        throw new Error("Input must be a Date object or a valid date string");
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses de 0-11
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

const timeSince = (date: Date): string => {
    const { t } = useI18n();
    const now = new Date();
    const seconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);

    const intervals = [
        { key: 'years', seconds: 31536000 },
        { key: 'months', seconds: 2592000 },
        { key: 'days', seconds: 86400 },
        { key: 'hours', seconds: 3600 },
        { key: 'minutes', seconds: 60 },
        { key: 'seconds', seconds: 1 }
    ];

    for (const interval of intervals) {
        const { key, seconds: intervalSeconds } = interval;
        const value = Math.floor(seconds / intervalSeconds);
        if (value > 1) {
            return `${value} ${t(`time.${key}_plural`)}`;
        } else if (value === 1) {
            return `${value} ${t(`time.${key}`)}`;
        }
    }

    return t('time.just_now');
};
const getEndpoint = async (url: string, query: any = undefined, token: string) => {
    try {
        const { data } = await useFetch(url, {
            query: query ? query : { one: 'false' },
            headers: {
                'token': token
            }
        });
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
};


const handleNotification = async (body: any = undefined, user: number = 0, viewed: boolean = false,
    type: any = undefined, headers: any, code: any = undefined, method: any = "POST") => {
    try {
        const data = await $fetch('/api/controller/notifications', {
            method: method,
            body,
            query: {
                viewed: "N",
                userId: user,
                type: type,
                code: code,
                update: viewed
            },
            headers: headers
        })
        return data;
    } catch (err) {
        console.error(err);
    }
}

const addFavorite = async (item: any, headers: any, token: any) => {
    try {
        const method = item.isFavorite ? 'DELETE' : 'POST'
        const data = await useFetch('/api/controller/favorite', {
            method: method,
            body: {
                productCode: item.code,
                productName: item.name,
                productBio: item.bio,
                productImg: item.img1,
                userId: 1
            },
            headers: headers,
            //id de producto+ id de usuario (mockeado)
            query:
                item.isFavorite ?
                    {
                        productCode: item.code,
                        userId: 1
                    } : {
                        id: {
                            productCode: item.code,
                            userId: 1
                        }
                    }


        })
        if (method == 'POST') {
            await handleNotification(
                { type: 'FAVORITE', operation_type: 'Se añadio a favoritos', code: item.code },
                0, false, 'FAVORITE', headers)
        } else {
            await handleNotification(
                { type: 'FAVORITE', operation_type: 'Se añadio a favoritos', code: item.code },
                0, true, 'FAVORITE', headers
            )
        }
        if (data) {
            item.isFavorite = !item.isFavorite;
        }
        return data;
    } catch (err) {
        throw new Error(err)
    }
}

function restarFechas(fecha1: any, fecha2: any) {
    // Convertir las fechas de string a objetos Date
    const date1 = new Date(fecha1);
    const date2 = new Date(fecha2);

    // Obtener la diferencia en milisegundos
    const diferencia = date1 - date2;

    // Convertir la diferencia de milisegundos a días
    const diferenciaEnDias = Math.floor(diferencia / (1000 * 60 * 60 * 24));

    return diferenciaEnDias;
}
const sendMail = async (body: any) => {
    try {
        // Crear un objeto FormData
        const formData = new FormData();

        // Agregar el body completo como un campo separado
        formData.append('body', JSON.stringify(body));

        // Extraer el archivo adjunto del body
        if (body.attachments && body.attachments[0].content) {
            const attachment = body.attachments[0].content;

            // Convertir el contenido del adjunto en un Blob si es necesario
            const fileBlob = new Blob([attachment], { type: 'application/pdf' }); // Asegúrate de ajustar el tipo de contenido si es diferente

            // Agregar el archivo adjunto al FormData
            formData.append('file', fileBlob, body.attachments[0].filename || 'attachment.pdf');
        }

        // Enviar el FormData al servidor
        const data = await $fetch('/api/mailsender/sendMail', {
            method: 'POST',
            body: formData
        });
    } catch (err) {
        throw new Error(err);
    }

}
//import orderInterface from '../assets/utils/utils.ts'
const createPDF = async (presupuesto: orderInterface, items: any, customer: any, buffer: boolean = false) => {
    const footerImg = new Image()
    const { $i18n } = useNuxtApp();
    const t = $i18n.t;
    const doc = new jsPDF();
    let lastItem = 0
    // Obtener el ancho y alto de la página
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const footerY = pageHeight - 50

    let headerX = 10
    let headerY = 20
    let dividerHeight = 20
    let actualPage = 1
    //la cantidad de paginas calculada por los items + la ultima pagina con leyendas
    const totalPages = Math.ceil(items.length / 10) + 1
    // Calcular la posición central
    const centerX = pageWidth / 2;
    const centerY = pageHeight / 2;
    const createdDate = formatDate(presupuesto.createdAt)
    let posDate = pageWidth - 50
    //cantidad de items maximos por pagina = 10
    const headers: any = {
        "ITEM": { posX: 10, posY: headerY, column: "id" },
        "PRODUCTO": { posX: 30, posY: headerY, column: "name" },
        "CANT": { posX: 135, posY: headerY, column: "quant" },
        "PRECIO UNIT.": { posX: 150, posY: headerY, column: "price" },
        "TOTAL $": { posX: posDate + 25, posY: headerY, column: "total" }
    }

    const keysHeaders = Object.keys(headers);
    const createHeader = () => {
        const closeIcon = new Image()
        const businessLogo = new Image()
        const headDivider = new Image()
        closeIcon.src = '/close-icon.png'
        headDivider.src = '/header-divider.png'
        businessLogo.src = '/img/logo/0.png'
        footerImg.src = "/footer-img.png"

        // Configura el título del documento
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(236, 92, 108);
        if (presupuesto.type == "QUOTE") {
            doc.text(t('budget.number') + presupuesto.id, headerX, headerY);
        }
        else {
            doc.text(t('order.number') + presupuesto.number, headerX, headerY);
        }
        // Configura el subtítulo
        doc.setFont("helvetica", "normal");
        doc.setTextColor(37, 93, 117);

        doc.setFontSize(10);

        doc.addImage(closeIcon, 'png', centerX, headerY - 5, 8, 8)
        doc.addImage(businessLogo, 'png', centerX + 40, headerY - 5, 50, 13)
        headerY += 10
        doc.text(t('contact.name')+customer.vend, headerX, headerY);
        doc.text(t('budget.legend1'), centerX - 5, headerY);
        headerY += 5
        doc.text(customer.vendMail, headerX, headerY);
        headerY += 5
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.addImage(headDivider, 'png', headerX, headerY, pageWidth - 20, dividerHeight)
    }
    // Agrega una tabla o contenido de muestra
    const drawFirstPage = () => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        headerY += dividerHeight + 5
        doc.text(t('budget.client.code') + customer?.code, headerX, headerY);
        doc.text(t('budget.date'), posDate, headerY);
        doc.text(createdDate, posDate + 20, headerY);
        doc.setDrawColor(37, 93, 117);
        doc.setLineWidth(1.02);
        headerY += 10
        doc.setTextColor(37, 93, 117);
        doc.line(headerX, headerY, pageWidth - 10, headerY);
        // customer.bio.length>=35?"\n":" " Si tiene mas de 35 caracteres salto la linea e imprimo la provincia abajo
        doc.text(customer?.bio + (customer?.bio.length >= 35 ? "\n" : " ") + " - PROV. DE " + customer?.state, headerX, headerY + 5);
        doc.setTextColor(0, 0, 0);
        doc.text("ATN: ", posDate - 40, headerY + 10);
        doc.text(presupuesto.user.name, posDate - 30, headerY + 10)
        doc.text(t('budget.offer.text'), posDate - 40, headerY + 20);
        doc.text(t('budget.offer.type'), posDate - 5, headerY + 20);

        headerY += 35
        doc.line(headerX, headerY, pageWidth - 10, headerY);
        headerY += 5
        for (let i = 0; i < keysHeaders.length; i++) {
            headers[keysHeaders[i]].posY = headerY
            doc.text(keysHeaders[i], headers[keysHeaders[i]].posX, headers[keysHeaders[i]].posY);
        }
        headerY += 2
        doc.setLineWidth(0.5);
        doc.line(headerX, headerY, pageWidth - 10, headerY);
        headerY += 5
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        for (lastItem; lastItem < items.length; lastItem++) {
            if (headerY >= footerY - 30) {
                break;
            }
            for (let i = 0; i < keysHeaders.length; i++) {
                let texto = items[lastItem][headers[keysHeaders[i]].column]
                if (typeof texto === 'number' && !isNaN(texto) && isFinite(texto) ||
                    typeof texto === 'string' && !isNaN(parseFloat(texto))) {
                    if (typeof texto === 'string' && !isNaN(parseFloat(texto))) {
                        texto = parseFloat(texto)
                    }
                    texto = texto.toLocaleString('es-AR', {
                        minimumFractionDigits: 2,  // Mínimo de decimales
                        maximumFractionDigits: 2   // Máximo de decimales
                    });
                }
                doc.text(texto, headers[keysHeaders[i]].posX, headerY);
            }
            headerY += 10

        };
        headerY += 2
        doc.line(headerX, headerY, pageWidth - 10, headerY);
        headerY += 5
        doc.text(t('budget.totalIVA'), headers['CANT'].posX, headerY);
        const total=presupuesto.total.toLocaleString('es-AR', {
            minimumFractionDigits: 2,  // Mínimo de decimales
            maximumFractionDigits: 2   // Máximo de decimales
        });
        doc.text(total, headers['TOTAL $'].posX, headerY);
        headerY += 2;
        doc.line(headerX, headerY, pageWidth - 10, headerY);
        headerY += 5;
        doc.setFont("helvetica", "bold");
        doc.text(t('budget.totalText'), headers['ITEM'].posX, headerY);
        doc.setFont("helvetica", "normal");
        doc.text(numberToText(presupuesto.total), headers['PRODUCTO'].posX, headerY);
        doc.setFont("helvetica", "bold");
        doc.text('TOTAL $:', headers['PRECIO UNIT.'].posX + 10, headerY);
        doc.text(total, headers['TOTAL $'].posX, headerY);
        headerY += 110
        return
    }
    const drawFoot = () => {
        doc.setTextColor(37, 93, 117);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);

        doc.text(t('name'), headers['PRECIO UNIT.'].posX, footerY);
        doc.addImage(footerImg, 'png', headerX, footerY + 10, pageWidth - 20, 30)
        doc.text('ORIGINAL', headerX + 10, footerY + 45);
        doc.text('DD', headerX + 30, footerY + 45);
        doc.text('Página ' + actualPage + ' de ' + totalPages, pageWidth - 40, footerY + 45);
    }
    //Recorro para cada pagina de items menos la ultima que son de leyendas
    for (let i = 0; i < totalPages - 1; i++) {
        createHeader();
        drawFirstPage()
        drawFoot()
        actualPage++
        doc.addPage();
        headerX = 10
        headerY = 20
        let dividerHeight = 20
    }
    createHeader();
    doc.setLineWidth(0.5);
    headerY += dividerHeight + 5
    doc.line(headerX, headerY, pageWidth - 10, headerY);
    headerY += 5
    doc.setFontSize(12);

    doc.text(t('budget.conditions.general') + presupuesto.id, headerX, headerY)
    ////
    headerY += 5
    doc.setFont("helvetica", "normal");
    doc.setTextColor(236, 92, 108);
    doc.setFontSize(11);

    doc.text(t('budget.validity.header'), headerX, headerY)
    doc.setTextColor(0, 0, 0);
    const validity = restarFechas(presupuesto.createdAt, presupuesto.dueDate)
    doc.text(validity.toString() + ' (' + numberToText(validity) + ') días corridos', headerX + 60, headerY)
    headerY += 2
    doc.line(headerX, headerY, pageWidth - 10, headerY);
    headerY += 5
    doc.setTextColor(236, 92, 108);
    doc.text(t('budget.pay.condition.header'), headerX, headerY)
    doc.setTextColor(0, 0, 0);

    doc.text(t('budget.pay.condition.value'), headerX + 60, headerY)
    headerY += 2
    doc.line(headerX, headerY, pageWidth - 10, headerY);
    headerY += 5
    doc.setTextColor(236, 92, 108);
    doc.text(t('budget.delivery.header'), headerX, headerY)
    doc.setTextColor(0, 0, 0);

    doc.text(t('budget.delivery.value'), headerX + 60, headerY)
    headerY += 2
    doc.line(headerX, headerY, pageWidth - 10, headerY);
    headerY += 5
    doc.setTextColor(236, 92, 108);

    doc.text(t('budget.warranty.header'), headerX, headerY)
    doc.setTextColor(0, 0, 0);

    doc.text(t('budget.warranty.value'), headerX + 60, headerY)
    headerY += 2
    doc.line(headerX, headerY, pageWidth - 10, headerY);
    headerY += 5
    doc.setTextColor(236, 92, 108);

    doc.text(t('budget.expiration.header'), headerX, headerY)
    doc.setTextColor(0, 0, 0);

    doc.text(t('budget.expiration.value'), headerX + 60, headerY)
    headerY += 2
    doc.setLineWidth(0.8);
    doc.line(headerX, headerY, pageWidth - 10, headerY);
    headerY += 5
    doc.setTextColor(37, 93, 117);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);

    doc.text(t('budget.conditions.particular'), headerX, headerY)
    headerY += 10
    doc.setFontSize(11);

    doc.line(headerX, headerY, pageWidth - 10, headerY);
    doc.setTextColor(0, 0, 0);
    headerY += 1
    doc.text(t('budget.conditions.legend1'), headerX, headerY)




    drawFoot()
    // Guarda el PDF
    if (buffer) {
        const pdfBuffer = doc.output("arraybuffer");
        try {
            await sendMail({
                to: presupuesto.user.email,
                type: presupuesto.type,
                ticketNumber: presupuesto.id,
                attachments: [
                    {
                        filename: "PRESUPUESTO N° " + presupuesto.id,
                        content: pdfBuffer,
                        contentType: "application/pdf"
                    }
                ]
            })
        } catch (e) {
            console.log(e);
        }
    } else {
        doc.save("documento.pdf");
    }
}

// Llama a la función para crear el PDF


const getNotifications = async (token, type, viewed: any = undefined) => {
    //@ts-ignore
    try {//
        const data = await $fetch('/api/controller/notifications', {
            method: 'GET', params: {
                one: 'false',
                type: type,
                viewed: viewed
            },
            headers: { 'token': token }
        })
        return data
    } catch (err) {
        console.log(err);
    }
}




function numberToText(number) {
    const units = ["CERO", "UNO", "DOS", "TRES", "CUATRO", "CINCO", "SEIS", "SIETE", "OCHO", "NUEVE"];
    const teens = ["DIEZ", "ONCE", "DOCE", "TRECE", "CATORCE", "QUINCE", "DIECISÉIS", "DIECISIETE", "DIECIOCHO", "DIECINUEVE"];
    const tens = ["", "", "VEINTE", "TREINTA", "CUARENTA", "CINCUENTA", "SESENTA", "SETENTA", "OCHENTA", "NOVENTA"];
    const hundreds = ["", "CIEN", "DOSCIENTOS", "TRESCIENTOS", "CUATROCIENTOS", "QUINIENTOS", "SEISCIENTOS", "SETECIENTOS", "OCHOCIENTOS", "NOVECIENTOS"];

    function toWords(num) {
        if (num < 10) return units[num];
        if (num < 20) return teens[num - 10];
        if (num < 100) {
            let unit = num % 10;
            let ten = Math.floor(num / 10);
            return tens[ten] + (unit !== 0 ? " Y " + units[unit] : "");
        }
        if (num < 1000) {
            let ten = num % 100;
            let hundred = Math.floor(num / 100);
            return hundreds[hundred] + (ten !== 0 ? " " + toWords(ten) : "");
        }

        const scales = ["", "MIL", "MILLÓN", "MIL MILLONES", "BILLÓN"];
        let result = '';
        let scale = 0;

        while (num > 0) {
            let chunk = num % 1000;
            if (chunk > 0) {
                result = (chunk < 100 ? toWords(chunk) : toWords(Math.floor(chunk / 100) * 100) + (chunk % 100 !== 0 ? " " + toWords(chunk % 100) : "")) + " " + scales[scale] + (result ? " " + result : "");
            }
            num = Math.floor(num / 1000);
            scale++;
        }

        return result.trim();
    }

    function decimalToFraction(decimal) {
        const precision = 100; // Convert to fraction with denominator 100
        let numerator = Math.round(decimal * precision);
        return `${numerator}/${precision}`;
    }

    if (Number.isInteger(number)) {
        return toWords(number).trim();
    } else {
        let integerPart = Math.floor(number);
        let decimalPart = number - integerPart;

        let integerText = toWords(integerPart);
        let decimalText = decimalToFraction(decimalPart);

        return `${integerText} CON ${decimalText}`;
    }
}



export { addFavorite, isValidJsonString, getEndpoint, handleNotification, getNotifications, pageCount, timeSince, formatDate, createPDF, sendMail,formatBlogDate };