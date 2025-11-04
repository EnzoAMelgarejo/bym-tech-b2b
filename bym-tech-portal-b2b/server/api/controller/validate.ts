import { dbGet, dbPutOrPost } from 'assets/utils/db';
import throwError from 'assets/utils/throwError';
import { codeError } from 'assets/utils/codeError';
import { validateObject } from 'assets/utils/validator.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const lang = "es";

const validations = {
    // Aquí defines tus validaciones
};

export const validate = async (token) => {
    const secret = process.env.JWT_SECRET;
    try {
        return await jwt.verify(token, secret);
    } catch (error) {
        throw throwError('Token validation failed', codeError.BYMTECH003.code, 401, lang, 'Invalid or expired token');
    }
};

// Endpoint que maneja las solicitudes HTTP
export default defineEventHandler(async (event) => {
    assertMethod(event, ['GET', 'PUT', 'DELETE', 'POST']);

    switch (event.method) {
        case 'GET': {
            const obj = getQuery(event);

            // Extrae el token desde el encabezado Authorization
            const authorizationHeader = getHeader(event, 'Authorization');
            if (!authorizationHeader) {
                return throwError(event.path, codeError.BYMTECH003.code, 401, lang, 'Authorization header missing');
            }

            // Remueve el prefijo "Bearer " del token
            const token = authorizationHeader.replace('Bearer ', '');
            if (!token) {
                return throwError(event.path, codeError.BYMTECH003.code, 401, lang, 'Token missing');
            }

            try {
                validateObject(obj, validations);
                try {
                    // Valida el token
                    return await validate(token);
                } catch (error) {
                    return throwError(event.path, codeError.BYMTECH003.code, 401, lang, error.message);
                }
            } catch (error) {
                return throwError(event.path, codeError.BYMTECH003.code, 400, lang, error.message);
            }
        }

        case 'PUT':
        case 'DELETE':
        case 'POST':
        default:
            return throwError(event.path, codeError.BYMTECH002.code, 404, lang, `${event.method} - ${event.path}`);
    }
});
