const { filterToQuery, mapToColumns, paginationToQuery } = require('../utils');
const { Models } = require('../../model/model');

async function getProvider(application, filter, pagination, codClient) {
    var sqlResolve = '';
    const map = Models.get(application).provider;

    switch (application) {
        case 'PROTHEUS':
            const ALIAS = 'SBM'
            const NOT_DELETE = ` WHERE ${ALIAS}.D_E_L_E_T_ != '*' `
            const PROTHEUS = `SELECT ${await mapToColumns(map)} FROM ${ALIAS}010 ${ALIAS} `
                + NOT_DELETE
                + ` AND BM_GRUPO IN (SELECT BM_GRUPO FROM SB1010 SB1 WHERE SB1.D_E_L_E_T_ = '' AND B1_XFILWEB != '' ) `
            sqlResolve = PROTHEUS; //Initial query, debe contener el primer WHERE. El resto de filtros se calculan según la entrada.
            sqlResolve += await paginationToQuery(pagination, map, ALIAS);
            break;
        default:
            sqlResolve = PROTHEUS;
            sqlResolve += filter
            break;
    }
    return sqlResolve;
}

module.exports = { getProvider };