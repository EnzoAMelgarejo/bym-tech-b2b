import axios from 'axios';
import throwError from 'assets/utils/throwError';
import { isValidJsonString } from './utils';
import { codeError } from 'assets/utils/codeError'

const NOT_FOUND = "Not Found";
const ID_NOT_FOUND = "El campo id es obligatorio en busquedas unicas."

const lang = "es";
const detail = "null";

const apiUrl = process.env.API_SYNC;
export async function dbGetSync(event, model) {
    const { field, order, rows, offset } = await evalEvent(event, 'Query');
    const body = await evalEvent(event, 'Body');
    let response;
    response = await syncGetList(event, model, field, order, rows, offset, body);
    return response;
}

const evalEvent = async (event: any, type: any) => {
    try {
        switch (type) {
            case 'Body':
                return await readBody(event);
            case 'Query':
                const response = await getQuery(event);

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
};


// Helper function to build the query string
const buildQueryString = (params: { [key: string]: any }) => {
    return Object.keys(params)
        .filter(key => params[key] !== undefined && params[key] !== null)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');
};

// Define syncGetList to fetch data from an external API
const syncGetList = async (event: any, model: any, field: any, order: any, rows: any, offset: any, body: any): Promise<any> => {
    try {
        const queryParams = {
            field,
            order,
            rows,
            offset
        };
        const queryString = buildQueryString(queryParams);
        const url = `${apiUrl}${model}?${queryString}`;

        const response = await axios.get(url, {
            data: body // Aunque `data` normalmente no se usa con GET, Axios lo permite
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching data from API:', error);
        return throwError(event.path, codeError.BYMTECH004.code, 500, lang, NOT_FOUND);
    }
};


export async function syncCreate(event: any, body: any) {
    try {
        const url = `${apiUrl}create`;

        const response = await axios.post(url, {
            data: body // Aunque `data` normalmente no se usa con GET, Axios lo permite
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching data from API:', error);
        return throwError(event.path, codeError.BYMTECH004.code, 500, lang, NOT_FOUND);
    }
};

export async function syncImagePut(event: any, body: any) {
    try {
        const url = `${apiUrl}images`;

        const response = await axios.post(url, {
            data: body // Aunque `data` normalmente no se usa con GET, Axios lo permite
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching data from API:', error);
        return throwError(event.path, codeError.BYMTECH004.code, 500, lang, NOT_FOUND);
    }
};

export async function syncGetFiles(event: any, body: any) {
    try {
        const { code } = await evalEvent(event, 'Query');
        const url = `${apiUrl}attachments/` + code;
        const response = await axios.post(url, {
            data: body // Aunque `data` normalmente no se usa con GET, Axios lo permite
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching data from API:', error);
        return throwError(event.path, codeError.BYMTECH004.code, 500, lang, NOT_FOUND);
    }
};
