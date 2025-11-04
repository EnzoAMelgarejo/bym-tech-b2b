const { filterToQuery, mapToColumns, paginationToQuery } = require('../utils');
const { Models } = require('../../model/model');

async function getProduct(application, filter, pagination, codClient) {
    var sqlResolve = '';
    const map = Models.get(application).product;

    switch (application) {
        case 'PROTHEUS':
            const ALIAS = 'SB1'
            const NOT_DELETE = ` WHERE ${ALIAS}.D_E_L_E_T_ != '*' `
            const PROTHEUS = `SELECT ${await mapToColumns(map)} FROM ${ALIAS}010 ${ALIAS} `
                + ` LEFT JOIN DA1010 A ON A.D_E_L_E_T_<>'*' AND SB1.B1_COD = A.DA1_CODPRO ` //
                + ` AND A.DA1_DATVIG>= cast(FORMAT(GETDATE(),'yyyyMMdd') as varchar(8)) ` 
                + ` LEFT JOIN DA0010 B ON B.D_E_L_E_T_<>'*' AND A.DA1_CODTAB=B.DA0_CODTAB AND B.DA0_ATIVO = '1' `
                + ` LEFT JOIN SA1010 C ON C.D_E_L_E_T_<>'*' AND C.A1_TABELA=B.DA0_CODTAB AND A1_COD = '${codClient}' `
                + ` LEFT JOIN ADD_SB1 D ON D.ADD_B1_COD = SB1.B1_COD `
                + ` LEFT JOIN SBM010 E ON E.BM_GRUPO = B1_GRUPO AND E.D_E_L_E_T_ = '' `
                + NOT_DELETE + ` AND B1_XFILWEB != ' ' `
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

module.exports = { getProduct };