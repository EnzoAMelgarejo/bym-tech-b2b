export enum Type {
    TECHNICAL,
    SECURE,
    DATABASE
}

export interface codeError {
    code: string;
    type: Type;
    es: string;
    en: string;
    pt: string;
}

export const codeError: { [key: string]: codeError } = {
    BYMTECH001: { code: "BYMTECH001", type: Type.TECHNICAL, es: "Error no controlado.", en: "Uncontrolled error.", pt: "Erro não controlado." },
    BYMTECH002: { code: "BYMTECH002", type: Type.TECHNICAL, es: "Método HTTP no admitido.", en: "Unsupported HTTP method.", pt: "Método HTTP não suportado." },
    BYMTECH003: { code: "BYMTECH003", type: Type.SECURE, es: "Error en la validación de campos.", en: "Error in field validation.", pt: "Erro na validação dos campos." },
    BYMTECH004: { code: "BYMTECH004", type: Type.DATABASE, es: "No se encontraron registros en la base de datos.", en: "No records found in the database.", pt: "Nenhum registro encontrado no banco de dados." }
};

