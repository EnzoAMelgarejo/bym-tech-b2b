const { filterToQuery, mapToColumns, paginationToQuery } = require('../utils');
const { Models } = require('../../model/model');

async function getOrder(application, filter, pagination, codClient) {
    var sqlResolve = '';
    const map = Models.get(application).order;

    switch (application) {
        case 'PROTHEUS':
            const ALIAS = 'SC5'
            const NOT_DELETE = ` WHERE ${ALIAS}.D_E_L_E_T_ != '*' `
            const PROTHEUS = `SELECT ${await mapToColumns(map)} FROM ${ALIAS}010 ${ALIAS} `
                + NOT_DELETE
                + ` AND C5_CLIENTE = '${codClient}' `
            sqlResolve = PROTHEUS; //Initial query, debe contener el primer WHERE. El resto de filtros se calculan según la entrada.
            if (filter == undefined || filter == null) {
                sqlResolve += ''
            } else {
                sqlResolve += await filterToQuery(filter, map);
            }

            sqlResolve += await paginationToQuery(pagination, map, ALIAS);

            break;
        default:
            sqlResolve = PROTHEUS;
            sqlResolve += filter
            break;
    }
    return sqlResolve;
}

module.exports = { getOrder };