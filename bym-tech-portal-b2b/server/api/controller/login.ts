import { dbGet, dbPutOrPost } from 'assets/utils/db';
import throwError from 'assets/utils/throwError';
import { codeError } from 'assets/utils/codeError'
import { validateObject } from 'assets/utils/validator.js';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const lang = "es";
const model = "userLogin"

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
    
    switch (event.method) {
        case 'GET':
            const obj = getQuery(event);

            try {
                validateObject(obj, validations);
                try {
                    return dbGet(event, model, { company: true });
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
                const obj = getQuery(event);
                await validateObject(obj, validations);
                const user = await dbGet(event, model, { company: true });
                const body = await readBody(event)

                const auth = await comparePasswords(body.password, user[0].password);
                if (auth) {
                    // Credenciales correctas, crear el token
                    const token = jwt.sign({ userId: user[0].id }, process.env.JWT_SECRET, { expiresIn: '8h' });

                    // Enviar el token al cliente
                    return { token, id: user[0].id, codeClient: user[0].company[0]?.code || '000001' };
                }
                else {
                    
                    return throwError(event.path, codeError.BYMTECH002.code, 404, lang, event.method + '-' + event.path);
                }
            } catch (error) {
                return throwError(event.path, codeError.BYMTECH003.code, 400, lang, error.message);
            }
        default:
            return throwError(event.path, codeError.BYMTECH002.code, 404, lang, event.method + '-' + event.path);
    }
});