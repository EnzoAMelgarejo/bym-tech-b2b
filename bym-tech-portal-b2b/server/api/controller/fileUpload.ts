import { uploadFile } from '~/assets/utils/uploadFile';

import throwError from 'assets/utils/throwError';
import { readMultipartFormData } from 'h3';
import { codeError } from 'assets/utils/codeError'
const NOT_FOUND = "Not Found";
const ID_NOT_FOUND = "El campo id es obligatorio en busquedas unicas."

const lang = "es";
const detail = "null";
// Endpoint que maneja las solicitudes HTTP
export default defineEventHandler(async (event) => {
    assertMethod(event, ['GET', 'PUT', 'DELETE', 'POST']);

    switch (event.method) {
        case 'GET':
            try {

            } catch (error) {
                return throwError(event.path, codeError.BYMTECH003.code, 400, lang, error.message);
            }

        case 'PUT':
        case 'DELETE':
        case 'POST':
            try {
                const form = await readMultipartFormData(event);
                if (!form) {
                    throw new Error('No se recibió ningún archivo');
                }

                const files = form.filter(part => part.name === 'file');
                //console.log(files)
                if (!files) {
                    throw new Error('No se encontró el archivo en la solicitud');
                }
                return await uploadFile(files);
            } catch (error) {
                return throwError(event.path, codeError.BYMTECH003.code, 400, lang, error.message);
            }
        default:
            return throwError(event.path, codeError.BYMTECH002.code, 404, lang, event.method + '-' + event.path);
    }
});