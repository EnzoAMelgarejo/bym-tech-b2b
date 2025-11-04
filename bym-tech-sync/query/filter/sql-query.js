const { filterToQuery, mapToColumns, paginationToQuery} = require('../utils');
const { Models } = require('../../model/model');

async function getFilter(application, filter, pagination, level) {
    var sqlResolve = '';
    const propertyName = `filter${level}`
    const mapObj = Models.get(application)
    const map = mapObj[propertyName]

    switch (application) {
        case 'PROTHEUS':
            const ALIAS = 'ZW' + level 
            const NOT_DELETE = ` WHERE ${ALIAS}.D_E_L_E_T_ != '*' `
            const PROTHEUS = `SELECT ${await mapToColumns(map)} FROM ${ALIAS}010 ${ALIAS} ` + NOT_DELETE
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

module.exports = { getFilter };