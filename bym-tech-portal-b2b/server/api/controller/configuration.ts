import { dbGet, dbPutOrPost } from 'assets/utils/db';
import throwError from 'assets/utils/throwError';
import { codeError } from 'assets/utils/codeError'
import { validateObject } from 'assets/utils/validator.js';

const lang = "es";
const model = "enterprise"

const validations = {
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

                    obj.where = {
                        active: 1,
                        OR: []
                    }
                    if (Array.isArray(obj.keys)) {
                        obj.keys.forEach(clave => {
                            obj.where['OR'].push({
                                key: {
                                    equals: clave
                                }
                            })
                        })
                    } else if (obj.keys) {
                        obj.where['OR'].push({
                            key: {
                                equals: obj.keys
                            }
                        })
                    }
                    const records = await dbGet(event, model)
                    const result = {
                        logo: {
                            value1: ''
                        },
                        social_media: [],
                        login_image: {
                            value1: '',
                            value2: '',
                            value3: '',
                        },
                        login_background: {
                            value1: '',
                            value2: '',
                            value3: '',
                        },
                        keys: [],
                    }
                    records.forEach(elem => {
                        if (result.hasOwnProperty(elem.key)) {
                            if (Array.isArray(result[elem.key])) {
                                // Si es un array, agregamos el nuevo objeto
                                result[elem.key].push({
                                    id: elem.id,
                                    value1: elem.value1,
                                    value2: elem.value2,
                                    value3: elem.value3
                                });
                            } else if (typeof result[elem.key] === 'object') {
                                // Si es un objeto, actualizamos sus propiedades
                                result[elem.key] = {
                                    id: elem.id,
                                    value1: elem.value1,
                                    value2: elem.value2,
                                    value3: elem.value3
                                };
                            } else {
                                // Si es un valor primitivo, lo actualizamos
                                result[elem.key] = elem.value1;
                            }
                        } else {
                            result.keys.push(elem);
                        }
                    })
                    return result;
                } catch (erroDb) {
                    console.log(erroDb)
                    return erroDb;
                }
            } catch (error) {
                console.log(error)
                return throwError(event.path, codeError.BYMTECH003.code, 400, lang, error.message);
            }
        case 'PUT':
        case 'DELETE':
        case 'POST':
            return dbPutOrPost(event, model);
        default:
            return throwError(event.path, codeError.BYMTECH002.code, 404, lang, event.method + '-' + event.path);
    }
});