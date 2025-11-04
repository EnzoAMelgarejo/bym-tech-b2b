// validator.js
export function validateObject(obj, validations) {
    for (const key in validations) {
        if (Object.hasOwnProperty.call(validations, key)) {
            const value = obj[key];
            const mandatory = validations[key].mandatory;
            const regex = validations[key].regex;
            const min = validations[key].min;
            const max = validations[key].max;
            const validation = validations[key].validation;

            // Verificar si el campo está presente en el objeto
            if (mandatory) {
                if (value === undefined || value === null || value === "") {
                    throw new Error(`El campo '${key}' es obligatorio.`);
                }
            }

            if (regex && value) {
                if (!regex.test(value)) {
                    throw new Error(`El valor '${value}' del campo '${key}' no cumple con la expresión regular. ['${regex}']`);
                }
            }

            if (min && value) {
                const isNumber = typeof value !== 'number';
                var numberEval = 0;
                if (isNumber) {
                    numberEval = value;
                } else {
                    numberEval = value.length;
                }

                if (value < min) {
                    throw new Error(`El valor '${value}' del campo '${key}' es menor al valor mínimo definido. ['${min}']`);
                }
            }

            if (max && value) {
                const isNumber = typeof value !== 'number';
                var numberEval = 0;
                if (isNumber) {
                    numberEval = value;
                } else {
                    numberEval = value.length;
                }

                if (value > max) {
                    throw new Error(`El valor '${value}' del campo '${key}' es mayor al valor máximo definido. ['${max}']`);
                }
            }

            // Aplicar validaciones al campo
            if (value && validation) {
                for (const validate of validation) {
                    if (!validate(value)) {
                        throw new Error(`El valor '${value}' del campo '${key}' no cumple con la validación. ['${validate}']`);
                    }
                }
            }
        }
    }
}