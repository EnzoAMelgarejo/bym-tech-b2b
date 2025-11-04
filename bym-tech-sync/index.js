const express = require('express')

//Import configuration 
const dotenv = require('dotenv')
dotenv.config({ path: '.env' })
const axios = require('axios');
const fs = require('fs');
const archiver = require('archiver');

const { querySQL, queryUpdateSQL } = require('./mssql/connection-utils.js');
const { getCustomer } = require('./query/customer/sql-query.js');
const { getProduct } = require('./query/product/sql-query.js');
const { getFilter } = require('./query/filter/sql-query.js');
const { getInvoice } = require('./query/invoice/sql-query.js');
const { getOrder } = require('./query/order/sql-query.js');
const { getProvider } = require('./query/provider/sql-query.js');

//Util json
const app = express()
const port = Number(process.env.PORT)
app.use(express.json())

app.listen(port, () => {
    console.log(`Sync app listening on port ${port}`)
})

app.get("/model/:code", async (req, res) => {
    try {
        const model = req.params.code;
        const pagination = {
            field: req.query.field,
            order: req.query.order,
            offset: req.query.offset,
            rows: req.query.rows,
        }
        const filter = req.body;
        const codClient = req.query.client || '000003';
        var sqlQuery = '';

        switch (model) {
            case 'customer':
                sqlQuery = await getCustomer(process.env.APPLICATION, filter, pagination);
                break;
            case 'product':
                sqlQuery = await getProduct(process.env.APPLICATION, filter, pagination, codClient);
                break;
            case 'provider': //Marca
                sqlQuery = await getProvider(process.env.APPLICATION, filter, pagination, 1);
                break;
            case 'filter1': //cat
                sqlQuery = await getFilter(process.env.APPLICATION, filter, pagination, 1);
                break;
            case 'filter2': //grupo
                sqlQuery = await getFilter(process.env.APPLICATION, filter, pagination, 2);
                break;
            case 'filter3': //familia
                sqlQuery = await getFilter(process.env.APPLICATION, filter, pagination, 3);
                break;
            case 'filter4': //secciones
                sqlQuery = await getFilter(process.env.APPLICATION, filter, pagination, 4);
                break;
            case 'invoice':
                sqlQuery = await getInvoice(process.env.APPLICATION, filter, pagination, codClient);
                break;
            case 'order':
                sqlQuery = await getOrder(process.env.APPLICATION, filter, pagination, codClient);
                break;

            default:
                break;
        }
        var result = await querySQL(sqlQuery)

        res.send(result);
    } catch (e) {
        console.error(e)
    }
})

app.post("/model/images", async (req, res) => {
    var response = {
        response: 'OK.',
        error: null,
        status: 400,
        result: null
    }
    try {
        const { code, index, image } = req.body.data;

        // Validar que los datos requeridos existen
        if (!code || !index || !image) {
            response.response = "Datos incompletos";
            response.status = 400;
        }

        const queryReview = "SELECT * FROM ADD_SB1 WHERE ADD_B1_COD = '" + code + "'";
        var checkOut = await querySQL(queryReview);

        let queryUpdate = `UPDATE ADD_SB1 SET ADD_IMG${index} = '${image}' WHERE ADD_B1_COD = '${code}'`;

        if (checkOut.length == 0) {
            const queryInsert = `INSERT INTO ADD_SB1 (ADD_B1_COD, ADD_IMG1, ADD_IMG2, ADD_IMG3, ADD_IMG4) VALUES('${code}', '', '', '', '');`;
            await queryUpdateSQL(queryInsert);
            console.log(queryInsert)
        }

        var result = await queryUpdateSQL(queryUpdate);

        console.log(result);
        response.result = result;
    } catch (e) {
        console.error(e);
        response = {
            response: 'Internal server error.',
            error: e,
            status: 500,
            result: null
        }
    }

    res.status(response.status).send(response);
})

app.post("/model/attachments/:code", async (req, res) => {
    try {
        const code = req.params.code;
        let url = process.env.PROTHEUS_URL + process.env.SERVICE_ATTACHMENTS + code;
        const data = {};
        const headers = {};

        var response = {
            response: 'File not found',
            error: null,
            status: 201,
            items: []
        }

        axios.post(url, data, { headers: headers })
            .then(result => {
                result.items.forEach(item => {
                    if (item.ListOfKnowledge !== undefined && item.ListOfKnowledge.length > 0) {
                        const files = item.ListOfKnowledge;
                        files.forEach(file => {
                            if (file.File64) {
                                response.items.push(file.File64)
                            }
                        });
                    }
                });

                if (response.items.length > 0) {
                    response.response = 'OK - ' + response.items.length + ' files were found.'
                    response.status = 201;
                    // Crear un archivo ZIP en memoria
                    let zip = archiver('zip', { zlib: { level: 9 } });
                    let zipFileName = 'files.zip';
                    let output = fs.createWriteStream(zipFileName);

                    zip.pipe(output);

                    response.items.forEach((file64, index) => {
                        let buffer = Buffer.from(file64, 'base64');
                        zip.append(buffer, { name: `file_${index + 1}.bin` });
                    });

                    zip.finalize()
                        .then(() => {
                            // Leer el archivo ZIP desde el sistema de archivos y agregarlo a la respuesta
                            fs.readFile(zipFileName, (err, data) => {
                                if (err) {
                                    response.response = 'Error al crear el archivo ZIP.';
                                    response.status = 500;
                                    response.error = err;
                                } else {
                                    response.files = data.toString('base64'); // Convertir a Base64 para enviar en JSON
                                }

                                // Eliminar el archivo ZIP después de enviarlo
                                fs.unlink(zipFileName, (err) => {
                                    if (err) console.error('Error al eliminar el archivo ZIP:', err);
                                });
                            });
                        })
                        .catch(err => {
                            response.response = 'Error al finalizar la creación del archivo ZIP.';
                            response.error = err;
                            response.status = 500;
                        });
                } else {
                    response.response = 'File not found'
                    response.status = 200;
                }
            })
            .catch(error => {
                response.response = 'Error al hacer la solicitud al servicio.'
                response.error = error;
                response.status = 400;
            });
    } catch (e) {
        response.response = 'Error interno en el servidor.'
        response.error = e;
        response.status = 500;
    }
    console.log(response)
    res.status(response.status).send(response);
})

app.post("/model/create", async (req, res) => {
    const url = process.env.PROTHEUS_URL + process.env.SERVICE_ORDER_SALES;
    let response = {
        response: 'Error de comunicación con web service.',
        error: null,
        status: 500, // Cambié a 500 para errores internos del servidor
        body: {}
    };

    try {
        const data = req.body.data;

        // Asegurarse de que data sea un objeto JSON válido
        if (typeof data === 'string') {
            try {
                data = JSON.parse(data); // Intentar parsear si es un string
            } catch (e) {
                response.response = 'Formato JSON inválido en data.';
                response.status = 400; // Error del cliente
                throw new Error('Data is not a valid JSON object.');
            }
        }

        // Verificar que data ahora sea un objeto
        if (typeof data !== 'object' || data === null) {
            response.response = 'Data debe ser un objeto JSON.';
            response.status = 400; // Error del cliente
            throw new Error('Data is not a valid JSON object.');
        }

        const headers = {
            'Content-Type': 'application/json'
        };

        // Uso de await para asegurarse de que la llamada axios.post se complete
        const result = await axios.post(url, data, { headers });

        response.response = 'Comunicación OK con el servicio.';
        response.body = result.data; // En lugar de toda la respuesta, usualmente solo se necesita el .data
        response.status = 201; // Cambié a 201 para indicar que se creó algo
        console.log('Respuesta del servidor:', response);

    } catch (error) {
        response.response = 'Error al hacer la solicitud al servicio.';
        response.error = error.message; // Guardar solo el mensaje de error para la respuesta
        response.status = 400; // Código de estado de error del cliente
        console.error('Error en la solicitud:', error);
    }

    // Enviar la respuesta al cliente después de que todo se haya procesado
    res.status(response.status).send(response);
});
