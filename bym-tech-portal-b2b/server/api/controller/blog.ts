import { dbGet, dbPutOrPost, dbDelete } from 'assets/utils/db';
import throwError from 'assets/utils/throwError';
import { codeError } from 'assets/utils/codeError'
import { validateObject } from 'assets/utils/validator.js';
import jwt from 'jsonwebtoken'

const lang = "es";
const model = "blog"

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
                    const includeModel = {
                        user: true, comments: true, category: true, // Incluye información de la categoría (opcional)
                    }
                    const query = await getQuery(event);
                    if (query.categories) {
                        //@ts-ignore

                        const categories = typeof query.categories == 'string' ? [Number(query.categories)] : query.categories.map((elem: any) => Number(elem))
                        query.where = {
                            categoryId: {
                                in: categories, // Filtra blogs cuya categoryId esté en el array de categoryIds
                            },
                        }
                    }
                    const response = await dbGet(query, model, includeModel);
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
            const { userId } = event.context.auth
            const body = await readBody(event)
            body.userId = userId
            return dbPutOrPost(body, model);
        default:
            return throwError(event.path, codeError.BYMTECH002.code, 404, lang, event.method + '-' + event.path);
    }
});