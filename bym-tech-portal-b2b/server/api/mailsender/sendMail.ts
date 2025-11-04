import { dbGet, dbPutOrPost } from 'assets/utils/db';
import throwError from 'assets/utils/throwError';
import { codeError } from 'assets/utils/codeError'
import nodemailer from 'nodemailer'
import { validateObject } from 'assets/utils/validator.js';

const lang = "es";
const model = "feature"

const validations = {
    message: {
        mandatory: false,
        regex: /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü0-9\s]+$/,
        min: 10,
        max: null,
    },
    type: {
        mandatory: true,
        regex: /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s_\-\*\.\,\!\@\#\$\%\^\&\(\)\[\]\{\}\?\+\=]+$/,
        min: 10,
        max: null,
        validation: [
            (value: string) => ['THREAD', 'ORDER', 'QUOTE', 'INTERACTION','SALE_ORDER'].includes(value)
        ]
    },
    ticketNumber: {
        mandatory: false,
        regex: /^[0-9]+$/,
        min: 0,
        max: null,
        validation: [
            (value: number) => Number(value) > 0
        ]
    },
    username: {
        mandatory: false,
        regex: /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü0-9\s]+$/,
        min: 0,
        max: null,
    },
};

// Endpoint que maneja las solicitudes HTTP
export default defineEventHandler(async (event) => {
    assertMethod(event, ['GET', 'PUT', 'DELETE', 'POST']);
    const body = await readBody(event)
    switch (event.method) {
        case 'GET':
        case 'PUT':
        case 'DELETE':
        case 'POST':
            const form = await readMultipartFormData(event)
            const body = JSON.parse(form[0].data)
            await validateObject(body, validations);
            let attachment = form.find(part => part.name === 'file');
            if (attachment) {
                attachment = [{
                    content: attachment.data,
                    filename: attachment.filename,
                    contentType: attachment.type
                }]
            }

            let subject = ""
            let text = ""
            switch (body.type) {
                case 'THREAD': 
                    subject = body.subject.trim()+" - CONSULTA N° " + body.ticketNumber
                    text = "Se abrio una consulta nueva:\n\n" + body.message.trim() + "\n\nConsulta creada por: " + body.username.trim();
                    break;
                case 'ORDER':
                    subject = "PEDIDO N°" + body.ticketNumber
                    text = "Se adjunta el pedido con N° " + body.ticketNumber + " para su constancia"
                    break;
                case 'QUOTE':
                    subject = "PRESUPUESTO N°" + body.ticketNumber
                    text = "Se adjunta el presupuesto con N° " + body.ticketNumber + " para su constancia"
                    break;
                case 'INTERACTION':
                    subject = "RE:"+body.subject.trim()+" - CONSULTA N° " + body.ticketNumber
                    text = "Tiene una nueva respuesta en consulta "+body.subject.trim()+":\n\n" + body.message.trim() + "\n\nRespuesta enviada por: " + body.username.trim();
                    break;
            }
            const mailOptions = {
                from: process.env.SMTP_FROM,
                to: body.to,
                subject: subject,
                text: text,
                attachments: attachment
                //html: '<p>Contenido del correo en <b>HTML</b></p>', 
            };
            try {
                const info = await sendEmail(mailOptions);
                console.log('Correo enviado:', info);
                return info; // Retorna la respuesta
            } catch (error) {
                console.log('Error:', error);
                return error; // Retorna el error
            }
        default:
            return throwError(event.path, codeError.BYMTECH002.code, 404, lang, event.method + '-' + event.path);
    }
});


function sendEmail(mailOptions:any) {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT, // puerto SMTP estándar
        secure: process.env.SSL == 'true' ? true : false, //  SSL
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        },
    });
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error al enviar correo:', error);
                return reject(error); // Rechaza la promesa si hay un error
            }
            resolve(info); // Resuelve la promesa con la información del correo enviado
        });
    });
}