import { dbGet, dbPutOrPost } from 'assets/utils/db';
import throwError from 'assets/utils/throwError';
import { codeError } from 'assets/utils/codeError'
import { validateObject } from 'assets/utils/validator.js';
import jwt from 'jsonwebtoken'
import { getQuery, setQuery } from 'h3'


const lang = "es";
const model = "threads"

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
            if (!obj.id) {
                obj.id = userId

                obj.one = "true"
                //obtengo el rol del usuario
                const userData = await dbGet(obj, 'user')
                if (userData.role == 'Admin') {
                    obj.where = {}
                    obj.id = undefined
                    obj.one = 'false'
                } else {
                    obj.one = 'false'
                    obj.where = {
                        interactions: {
                            some: {
                                userId: userId
                            }
                        }
                    }
                }
                if (obj.status && obj.status !== 'Cualquiera') {
                    obj.where.status = obj.status
                }
                if (obj.search) {
                    obj.where.subject = obj.search
                }
            }

            try {
                validateObject(obj, validations);
                try {
                    let includeModel = { interactions: { include: { user: true } } }
                    const response = await dbGet(obj, model, includeModel);
                    return response
                } catch (erroDb) {
                    return erroDb;
                }
            } catch (error) {
                return throwError(event.path, codeError.BYMTECH003.code, 400, lang, error.message);
            }

        case 'PUT':
            try {
                return dbPutOrPost(event, model)
            } catch (err) {
                return throwError(event.path, codeError.BYMTECH003.code, 400, lang, err.message);
            }
        case 'DELETE':
        case 'POST':
            try {

                const body = await readBody(event)

                const subject = { subject: body.subject, type: body.type };
                const thread = await dbPutOrPost(subject, model);
                const message = { message: body.message, thread: { connect: { id: thread.id } }, user: { connect: { id: userId } } };
                return dbPutOrPost(message, 'Interactions')
            } catch (err) {
                return throwError(event.path, codeError.BYMTECH003.code, 400, lang, err.message);
            }
        default:
            return throwError(event.path, codeError.BYMTECH002.code, 404, lang, event.method + '-' + event.path);
    }
});

function findLastDifferentUserInteraction(thread, selectedUserId) {
    // Invertimos el array para buscar desde el final hacia el principio
    const reversedInteractions = [...thread.interactions].reverse();

    // Buscamos la primera interacción (que será la última en el orden original)
    // cuyo userId sea diferente al seleccionado
    const lastDifferentInteraction = reversedInteractions.find(
        interaction => interaction.userId !== selectedUserId
    );

    return lastDifferentInteraction || null;
}