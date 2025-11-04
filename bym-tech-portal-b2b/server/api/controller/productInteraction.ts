import { dbGet, dbPutOrPost, dbDelete } from 'assets/utils/db';
import throwError from 'assets/utils/throwError';
import { codeError } from 'assets/utils/codeError'
import { validateObject } from 'assets/utils/validator.js';
import jwt from 'jsonwebtoken'

const lang = "es";
const model = "ProductInteractions"

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
    limit: {
        mandatory: false,
        regex: /^[0-9]+$/,
        min: 10,
        max: null,
        validation: [
            (value) => Number(value) > 10
        ]
    },
    categories: {
        mandatory: false,
        min: 1,
        max: null,
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
                    const response = await dbGet(event, model);
                    return response
                } catch (erroDb) {
                    return erroDb;
                }
            } catch (error) {
                return throwError(event.path, codeError.BYMTECH003.code, 400, lang, error.message);
            }

        case 'PUT':
        case 'DELETE':
            return dbDelete(event, model);
        case 'POST':
            const { userId } = event.context.auth

            const body = await readBody(event)
            body.userId = userId
            const query = await getQuery(event)
            query.condition = {
                code_userId: {
                    userId: userId,
                    code: body.code
                }
            }
            return dbPutOrPost(body, model, query, 'clicks');
        default:
            return throwError(event.path, codeError.BYMTECH002.code, 404, lang, event.method + '-' + event.path);
    }
});