import { dbGetSync } from 'assets/utils/sync';
import throwError from 'assets/utils/throwError';
import { codeError } from 'assets/utils/codeError'
import { validateObject } from 'assets/utils/validator.js';

const lang = "es";
const model = "filter1";

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
            try {
                try {
                    return dbGetSync(event, model);
                } catch (erroDb) {
                    return erroDb;
                }
            } catch (error) {
                return throwError(event.path, codeError.BYMTECH003.code, 400, lang, error.message);
            }

        case 'PUT':
        case 'DELETE':
        case 'POST':
            try {
                try {
                    return dbGetSync(event, model);
                } catch (erroDb) {
                    return erroDb;
                }
            } catch (error) {
                return throwError(event.path, codeError.BYMTECH003.code, 400, lang, error.message);
            }
        default:
            return throwError(event.path, codeError.BYMTECH002.code, 404, lang, event.method + '-' + event.path);
    }
});