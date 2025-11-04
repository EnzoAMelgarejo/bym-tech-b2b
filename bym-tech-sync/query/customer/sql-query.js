const { filterToQuery, mapToColumns, paginationToQuery } = require('../utils');
const { Models } = require('../../model/model');

async function getCustomer(application, filter, pagination) {
    var sqlResolve = '';
    const map = Models.get(application).customer;

    switch (application) {
        case 'PROTHEUS':

            const ALIAS = 'SA1'
            const NOT_DELETE = ` WHERE ${ALIAS}.D_E_L_E_T_ != '*' `
            const PROTHEUS = `SELECT ${await mapToColumns(map)} FROM ${ALIAS}010 ${ALIAS} `
                + `JOIN SX5010 B ON B.D_E_L_E_T_<>'*' AND X5_TABELA='12' AND TRIM(X5_CHAVE)=A1_EST
                    LEFT JOIN SYA010 C ON C.D_E_L_E_T_<>'*' AND  TRIM(YA_CODGI)=A1_PAIS
                    LEFT JOIN SA4010 D ON TRIM(D.A4_COD)=TRIM(A1_VEND) AND D.D_E_L_E_T_<>'*'`
                + NOT_DELETE
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

module.exports = { getCustomer };