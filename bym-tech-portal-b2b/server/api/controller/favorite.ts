import { dbGet, dbPutOrPost, dbDelete } from 'assets/utils/db';
import throwError from 'assets/utils/throwError';
import { codeError } from 'assets/utils/codeError'
import { validateObject } from 'assets/utils/validator.js';
import jwt from 'jsonwebtoken'
const lang = "es";
const model = "favorite"

const validations = {
    id: {
        mandatory: false,
    },
    viewed: {
        mandatory: false,
        validation: [
            (value) => value == "N" || value == "S"
        ]
    },
    productCode: {
        mandatory: false,
        validation: [
            (value) => String(value) !== ''
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
            obj.where = {
                userId: userId
            }
            if (obj.productCode) {
                obj.where.productCode = obj.productCode
            }

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
            const query = await getQuery(event)
            query.condition = {
                productCode: query.productCode,
                userId: userId
            }

            return dbDelete(query, model);
        case 'POST':
            const body = await readBody(event)
            body.userId = userId
            return dbPutOrPost(event, model);
        default:
            return throwError(event.path, codeError.BYMTECH002.code, 404, lang, event.method + '-' + event.path);
    }
});