import { dbGet, dbPutOrPost } from 'assets/utils/db';
import throwError from 'assets/utils/throwError';
import { codeError } from 'assets/utils/codeError'
import { validateObject } from 'assets/utils/validator.js';
import jwt from 'jsonwebtoken'

const lang = "es";
const model = "order"

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

const includeModel = { itemsOrder: true, user: true };

// Endpoint que maneja las solicitudes HTTP
export default defineEventHandler(async (event) => {
    assertMethod(event, ['GET', 'PUT', 'DELETE', 'POST']);
    const { userId } = event.context.auth

    switch (event.method) {
        case 'GET':
            const obj = getQuery(event);
            const body = {
                one: obj.one,
                where: {
                    userId: userId,
                    type: obj.type,
                }
            }
            try {
                validateObject(obj, validations);
                try {
                    return dbGet(body, model, includeModel);
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
                body.userId = userId
                return dbPutOrPost(event, model);
            }
            catch (err) {
                return throwError(event.path, codeError.BYMTECH002.code, 404, lang, '' + err);
            }
        default:
            return throwError(event.path, codeError.BYMTECH002.code, 404, lang, event.method + '-' + event.path);
    }
});