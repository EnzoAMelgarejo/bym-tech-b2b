import { codeError } from './codeError'; //Listado de codigos de error en diferentes idiomas

const formatLog = (url: string, errorCode: string, statusCode: number, language: string, detail: string, currentTime: string) => {
    const errorMessage = codeError[errorCode]?.[language] || 'Error';
    return `[${currentTime}] [URL: ${url}] [Status Code: ${statusCode}] [Error Code: ${errorCode}] [Message: ${errorMessage}] [Detail: ${detail}]`;
};

export default (url: string, errorCode: string, statusCode: number, language: string, detail: string) => {
    const currentDate = new Date();
    let message: string;

    // Obtener el mensaje de error según el idioma
    if (codeError[errorCode]) {
        switch (language) {
            case 'en':
                message = codeError[errorCode].en;
                break;
            case 'es':
                message = codeError[errorCode].es;
                break;
            case 'pt':
                message = codeError[errorCode].pt;
                break;
            default:
                message = 'Error';
                break;
        }
    } else {
        message = 'Error';
    }

    const errorData = {
        url: url,
        statusCode: statusCode || 404,
        errorCode: codeError[errorCode].code || 'BYMTECH001', // Puedes establecer el valor predeterminado aquí si no se proporciona un código de error
        typeError: codeError[errorCode].type,
        errorMessage: message,
        errorDetail: detail,
        currentTime: currentDate.toLocaleString() // Esto te dará la fecha y hora actual en un formato legible
    };

    const logMessage = formatLog(url, errorCode, statusCode, language, detail, errorData.currentTime);

    console.error(logMessage);

    return errorData;
};
