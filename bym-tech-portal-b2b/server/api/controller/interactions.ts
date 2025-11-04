import { dbGet, dbPutOrPost } from 'assets/utils/db';
import throwError from 'assets/utils/throwError';
import { codeError } from 'assets/utils/codeError'
import { validateObject } from 'assets/utils/validator.js';
import jwt from 'jsonwebtoken'

const lang = "es";
const model = "interactions"

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
    const { userId } = event.context.auth

    assertMethod(event, ['GET', 'PUT', 'DELETE', 'POST']);
    switch (event.method) {
        case 'GET':
            const obj = getQuery(event);
            obj.where = {
                userId: {
                    not: userId,
                },
                threadId: Number(obj.threadId)
            }
            try {
                validateObject(obj, validations);
                try {
                    const includeModel = { user: true }
                    const resp = await dbGet(obj, model, includeModel)
                    return resp;
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
                const body = await readBody(event)

                body.user = { connect: { id: userId } }
                return await dbPutOrPost(body, model)
            } catch (err) {
                return throwError(event.path, codeError.BYMTECH003.code, 400, lang, err.message);
            }
        default:
            return throwError(event.path, codeError.BYMTECH002.code, 404, lang, event.method + '-' + event.path);
    }
});