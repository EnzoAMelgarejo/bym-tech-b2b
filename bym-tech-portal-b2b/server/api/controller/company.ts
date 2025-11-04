import { dbGet, dbPutOrPost } from 'assets/utils/db';
import throwError from 'assets/utils/throwError';
import { codeError } from 'assets/utils/codeError'
import { validateObject } from 'assets/utils/validator.js';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
const lang = "es";
const model = "company"

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
    const { userId } = event.context.auth
    switch (event.method) {
        case 'GET':
            const obj = getQuery(event);
            obj.where = { userId: userId }
            try {
                validateObject(obj, validations);
                try {
                    return dbGet(obj, model);
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
                const body = await readBody(event);
                const query = await getQuery(event);
                return dbPutOrPost(body, model, query);
            } catch (error) {
                return throwError(event.path, codeError.BYMTECH003.code, 400, lang, error.message);

            }
        default:
            return throwError(event.path, codeError.BYMTECH002.code, 404, lang, event.method + '-' + event.path);
    }
});