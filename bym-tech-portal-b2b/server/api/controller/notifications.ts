import { dbGet, dbPutOrPost, dbDelete } from 'assets/utils/db';
import throwError from 'assets/utils/throwError';
import { codeError } from 'assets/utils/codeError'
import { validateObject } from 'assets/utils/validator.js';
import jwt from 'jsonwebtoken'


const lang = "es";
const model = "notifications"

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

            try {
                validateObject(obj, validations);
                try {
                    obj.where = {
                        userId: userId,
                        type: obj.type,
                        viewed: obj.viewed
                    }
                    const notifications = await dbGet(obj, model);
                    return notifications
                } catch (erroDb) {
                    return erroDb;
                }
            } catch (error) {
                return throwError(event.path, codeError.BYMTECH003.code, 400, lang, error.message);
            }

        case 'PUT':
        case 'DELETE':
            const object = getQuery(event);
            object.condition = {
                userId: userId,
                type: object.type,
                viewed: 'N',
                code: object.code
            }
            return dbDelete(object, model);
        case 'POST':
            let body = await readBody(event)
            let condition = undefined
            const query = await getQuery(event)
            body.userId = body?.userId ?? userId
            if (query.update) {
                query.condition = {
                    userId: userId,
                    type: query.type
                }
            }

            return dbPutOrPost(body, model, query);
        default:
            return throwError(event.path, codeError.BYMTECH002.code, 404, lang, event.method + '-' + event.path);
    }
});