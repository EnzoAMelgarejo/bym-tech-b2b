import { dbGetSync } from 'assets/utils/sync';
import { dbGet } from '~/assets/utils/db';
import throwError from 'assets/utils/throwError';
import { codeError } from 'assets/utils/codeError'
import { validateObject } from 'assets/utils/validator.js';
import jwt from 'jsonwebtoken'

const lang = "es";
const model = "customer";

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
    const query = await getQuery(event)
    let object = await readBody(event)
    if (query.one == 'true') {
        const { userId } = event.context.auth

        const userData = await dbGet({ id: userId, one: 'true' }, 'user', { company: true })
        object = {
            "model": "CUSTOMER",
            "filters": [
                {
                    "code": "code",
                    "type": "EQUALS",
                    "value": userData.company[0]?.code,
                    "list": []
                }
            ]
        }
    }
    object = {
        ...query,
        ...object
    }
    switch (event.method) {
        case 'GET':
            try {
                try {
                    return dbGetSync(object, model);
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
                    return dbGetSync(object, model);
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