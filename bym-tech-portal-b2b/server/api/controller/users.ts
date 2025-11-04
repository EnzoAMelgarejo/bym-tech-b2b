import { dbGet, dbPutOrPost, dbDelete } from 'assets/utils/db';
import throwError from 'assets/utils/throwError';
import { codeError } from 'assets/utils/codeError'
import { validateObject } from 'assets/utils/validator.js';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
const lang = "es";
const model = "user"
const includeModel = { company: true }

const validations = {
    one: {
        mandatory: true,
        regex: /^(true|false)$/i
    },
};

async function hashPassword(password: string) {
    try {
        // Generar un hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10); // El segundo parámetro es el costo del hash

        // Retornar el hash
        return hashedPassword;
    } catch (error) {
        console.error('Error al generar hash:', error);
        throw new Error('Error al generar hash de la contraseña');
    }
}

async function comparePasswords(password: string, hashedPassword: string) {
    try {
        // Comparar la contraseña ingresada con el hash almacenado
        const match = await bcrypt.compare(password, hashedPassword);

        // Retornar si coinciden o no
        return match;
    } catch (error) {
        console.error('Error al comparar contraseñas:', error);
        throw new Error('Error al comparar contraseñas');
    }
}

// Endpoint que maneja las solicitudes HTTP
export default defineEventHandler(async (event) => {
    assertMethod(event, ['GET', 'PUT', 'DELETE', 'POST']);
    const { userId } = event.context.auth

    switch (event.method) {
        case 'GET':
            let obj = getQuery(event);
            if (obj.one == 'true') {
                const headers = await getHeaders(event)
                const token = headers['token']
                obj.id = userId
            }
            try {
                validateObject(obj, validations);
                try {
                    const data = await dbGet(obj, model, includeModel);
                    return data
                } catch (erroDb) {
                    return erroDb;
                }
            } catch (error) {
                return throwError(event.path, codeError.BYMTECH003.code, 400, lang, error.message);
            }

        case 'PUT':
        case 'DELETE':
            try {
                const body = await readBody(event);
                const eventDelete = {
                    condition: {
                        id: body.id
                    }
                }
                return dbDelete(eventDelete, model);
            } catch (error) {
                return throwError(event.path, codeError.BYMTECH003.code, 400, lang, error.message);
            }
        case 'POST':
            try {
                const body = await readBody(event);
                const query = await getQuery(event);
                if (body.password) {
                    body.password = await hashPassword(body.password);
                }
                return dbPutOrPost(body, model, query);
            } catch (error) {
                return throwError(event.path, codeError.BYMTECH003.code, 400, lang, error.message);

            }
        default:
            return throwError(event.path, codeError.BYMTECH002.code, 404, lang, event.method + '-' + event.path);
    }
});