import { dbGet, dbPutOrPost, dbDelete } from 'assets/utils/db';
import throwError from 'assets/utils/throwError';
import { codeError } from 'assets/utils/codeError'
import { validateObject } from 'assets/utils/validator.js';
import jwt from 'jsonwebtoken'

const lang = "es";
const model = "ProductRating"

const validations = {
    code: {
        mandatory: false,
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
    const {userId}=event.context.auth

    switch (event.method) {
        case 'GET':
            const obj = getQuery(event);
            try {
                validateObject(obj, validations);
                try {
                    const query = await getQuery(event)
                    query.groupBy = 'code';
                    query.groupByCondition = {
                        _avg: {
                            rating: true, // Calculamos el promedio del rating
                        },
                        _count: {
                            rating: true, // Contamos la cantidad de registros por código
                        },
                    }
                    query.where={
                        code:query.code
                    }
                    const response = await dbGet(query, model);
                    return response
                } catch (erroDb) {
                    console.log(erroDb)
                    return erroDb;
                }
            } catch (error) {
                return throwError(event.path, codeError.BYMTECH003.code, 400, lang, error.message);
            }

        case 'PUT':
        case 'DELETE':
            return dbDelete(event, model);
        case 'POST':
            const body = await readBody(event)
            const query = await getQuery(event)
            query.condition = {
                code_userId: {
                    userId: userId,
                    code: body.code
                }
            }
            return dbPutOrPost(body, model, query);
        default:
            return throwError(event.path, codeError.BYMTECH002.code, 404, lang, event.method + '-' + event.path);
    }
});