import { PrismaClient } from '@prisma/client';
import throwError from 'assets/utils/throwError';
import { isValidJsonString } from './utils';
import { codeError } from 'assets/utils/codeError'

const NOT_FOUND = "Not Found";
const ID_NOT_FOUND = "El campo id es obligatorio en busquedas unicas."

const prisma = new PrismaClient();
const lang = "es";
const detail = "null";

const stringToBoolean = (value: string): boolean => {
    return value.toLowerCase() === 'true';
};

function isNumeric(value: any) {
    return /^-?\d+(\.\d+)?$/.test(value);
}

// Función para manejar el método GET
export async function dbGet(event: any, model: any, includeModel: any = undefined) {
    const { one, id } = await evalEvent(event, 'Query');
    let response;
    const searchOne = stringToBoolean(one);
    if (one !== undefined) {
        if (!searchOne) {
            response = await dbGetList(event, model, includeModel);
        }

        if (searchOne) {
            if ((id === undefined || id === null || id === "")) {
                return throwError(event.path, codeError.BYMTECH003.code, 500, lang, ID_NOT_FOUND);
            } else {
                response = await dbGetOne(event, id, model, includeModel);
            }
        }
    }
    return response;
}

async function dbGetOne(event: any, id: any, model: any, includeModel: any) {
    var filterInclude: any = {}

    if (includeModel) {
        filterInclude = includeModel;
    }
    if (id) {
        let select = undefined
        //si viene de la ruta de login entonces traigo la contraseña
        if (model == 'userLogin') {
            model = 'user'
        } else if (model == 'user') {
            select = {
                id: true,
                name: true,
                photo: true,
                role: true,
                email: true,
                profile: true,
                favorite: true,
                company: true,
                createdAt: true,
                updatedAt: true,
                ...includeModel
            }
            filterInclude = undefined;
        }
        const obj = await prisma[model].findFirst({
            where: {
                id: isNumeric(id) ? Number(id) : id,
            },
            select,
            include: filterInclude,
        });

        if (!obj) {
            throw createError(throwError(event.path, codeError.BYMTECH004.code, 404, lang, NOT_FOUND));
        }
        return obj;
    }
}

async function dbGetList(event: any, model: any, includeModel: any) {
    const obj = await evalEvent(event, 'Query');
    const take = obj.limit
    const groupBy = obj.groupBy
    var filterOrderBy = {}

    //formateo de orderBy
    if (obj.orderField && obj.orderDir) {
        filterOrderBy[obj.orderField] = obj.orderDir;
    } else {
        filterOrderBy = {
            "id": "asc"
        }
    }


    var filterWhere = {}

    if (obj.categorys) {
        var lstCategory = obj.categorys.split(',');
        filterWhere["category"] = { in: lstCategory };
    }

    if (obj.type) {
        filterWhere["type"] = { equals: obj.type };
    }
    if (obj.email) {
        filterWhere["email"] = { equals: obj.email }
    }
    if (obj.userId) {
        filterWhere["email"] = { equals: obj.email }
    }
    if (obj.role) {
        filterWhere["role"] = { equals: obj.role }
    }
    if (obj.where) {
        filterWhere = {
            ...filterWhere,
            ...obj.where
        }
    }
    var filterInclude: any = {}
    if (includeModel) {
        filterInclude = includeModel;
    }
    let select = undefined
    if (model == 'userLogin') {
        model = 'user'
    } else if (model == 'user') {
        select = {
            id: true,
            name: true,
            photo: true,
            role: true,
            email: true,
            profile: true,
            favorite: true,
            company: true,
            createdAt: true,
            updatedAt: true,
            ...includeModel
        }
        filterInclude = undefined;
    }
    if (groupBy) {
        var list = await prisma[model].groupBy({
            by: [groupBy], // Agrupamos por el código del producto
            ...obj.groupByCondition,
            where: filterWhere
        });
    } else {
        var list = await prisma[model].findMany({
            take: take,
            select,
            where: filterWhere,
            orderBy: filterOrderBy,
            include: filterInclude,
        });
    }
    if (!list) {
        throw createError(throwError(event.path, codeError.BYMTECH004.code, 404, lang, NOT_FOUND));
    }

    return list;
}

// Función para manejar los métodos PUT, POST
export async function dbPutOrPost(event, model, query?: any, incrementField?: any) {
    const { id, update, condition} = query ?? await evalEvent(event, 'Query');
    //verifica si es una request valida y sino retorna el evento tal cual fue pasado, esto se hace para permitir modificar los eventos en el controller en caso de que sea necesario
    let body = await evalEvent(event, 'Body');
    if ((update === undefined || update == 'false')) {
        return prisma[model].upsert({
            where:
                condition || { id: id ? (isValidJsonString(id) ? JSON.parse(id) : Number(id)) : 0 },
            update: body,
            create: incrementField ? {
                ...body,
                //Si hay algun dato a incrementar modifico el body para que en el create no haga increment sino un valor default
                [incrementField]: 1
            } : body
        });
    } else{
        return prisma[model].updateMany({
            where:
                condition || { id: id ? (isValidJsonString(id) ? JSON.parse(id) : Number(id)) : 0 },
            data: body,
        });
    } 
}

// Función para manejar metodo DELETE
export async function dbDelete(event, model, many = false) {
    if (many) {
        const { condition } = await evalEvent(event, 'Query');
        const convertedCondition = Object.fromEntries(
            Object.entries(condition).map(([key, value]) => {
                return [key, parseValue(value)];
            })
        );

        return prisma[model].deleteMany({
            where: {
                ...(convertedCondition ? convertedCondition : { id: 0 }),
            }
        });
    } else {

        const { id } = await evalEvent(event, 'Query')
        return prisma[model].delete({
            where: {
                id: Number(id),
            }
        });
    }
}

const parseValue = (value) => {
    // Intenta parsear como JSON
    try {
        return JSON.parse(value);
    } catch (e) {
        // Si no se puede parsear como JSON, retornar el valor original
        return value;
    }
};
//funcion que evalua si el objeto recibido es una request
const evalEvent = async (event: any, type: any) => {
    try {
        switch (type) {
            case 'Body':
                if (isEvent(event)) {
                    return await readBody(event);
                }else{
                    return event;
                }
            case 'Query':
                const response = await getQuery(event)
                return Object.entries(response).length === 0 ? event : response;
        }
    } catch {
        switch (type) {
            case 'Body':
                return event;
            case 'Query':
                return event.query;
        }
    }
}

function isEvent(event: any) {
    return event && typeof event === 'object' && 'req' in event && 'res' in event;
}