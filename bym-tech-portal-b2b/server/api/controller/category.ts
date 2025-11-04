import { dbGet, dbPutOrPost } from 'assets/utils/db';
import throwError from 'assets/utils/throwError';
import { codeError } from 'assets/utils/codeError'
import { validateObject } from 'assets/utils/validator.js';

const lang = "es";
const model = "category"

const validations = {
    id: {
        mandatory: false,
        regex: /^[0-9]+$/,
        min: 0,
        max: null,
        validation: [
            (value) => Number(value) > 0
        ]
    },
    one: {
        mandatory: true,
        regex: /^(true|false)$/i
    },
};

// Endpoint que maneja las solicitudes HTTP
export default defineEventHandler(async (event) => {
    assertMethod(event, ['GET', 'PUT', 'DELETE', 'POST']);

    switch (event.method) {
        case 'GET':
            const obj = getQuery(event);

            try {
                validateObject(obj, validations);
                try {
                    return dbGet(event, model);
                } catch (erroDb) {
                    return erroDb;
                }
            } catch (error) {
                return throwError(event.path, codeError.BYMTECH003.code, 400, lang, error.message);
            }

        case 'PUT':
        case 'DELETE':
        case 'POST':
            return dbPutOrPost(event, model);
        default:
            return throwError(event.path, codeError.BYMTECH002.code, 404, lang, event.method + '-' + event.path);
    }
});