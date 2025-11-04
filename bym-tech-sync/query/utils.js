/* Example json filter
{
    model: 'PRODUCT',
    filters: [
        {code: 'PRODUCT-DESC', type: 'EQUALS', value: 'VALOR1', list: []},
        {code: 'PRODUCT-FILTER-1', type: 'LIST', value: 'VALOR1', list: ['0001','0002']},
        {code: 'PRODUCT-DESC', type: 'CONTAINTS', value: 'VALOR1', list: []}
    ]
}*/

const EQUALS = 'EQUALS';
const NOT_EQUALS = 'NOT_EQUALS';
const LIKE = 'LIKE';
const NOT_LIKE = 'NOT_LIKE';
const LIST = 'LIST';
const NOT_LIST = 'NOT_LIST';
const BETWEEN = 'BETWEEN';
const NOT_BETWEEN = 'NOT_BETWEEN';

async function filterToQuery(value, map) {
    var query = ""

    if (value.filters != undefined && value.filters.length > 0) {
        value.filters.forEach(filter => {
            switch (filter.type) {
                case EQUALS:
                    query += ` AND  ${map.get(filter.code)} = '${filter.value}' `;
                    break;
                case NOT_EQUALS:
                    query += ` AND  ${map.get(filter.code)} != '${filter.value}' `;
                    break;
                case LIKE:
                    query += ` AND  ${map.get(filter.code)} LIKE '%${filter.value}%' `;
                    break;
                case NOT_LIKE:
                    query += ` AND  ${map.get(filter.code)} NOT LIKE '%${filter.value}%' `;
                    break;
                case BETWEEN:
                    query += ` AND  ${map.get(filter.code)} BETWEEN ${filter.list[0]} AND ${filter.list[1]}`;
                    break;
                case NOT_BETWEEN:
                    query += ` AND  ${map.get(filter.code)} NOT BETWEEN ${filter.list[0]} AND ${filter.list[1]}`;
                    break;
                case LIST:
                    query += ` AND  ${map.get(filter.code)} IN (${formatIn(filter.list)}) `;
                    break;
                case NOT_LIST:
                    query += ` AND  ${map.get(filter.code)} IN (${formatIn(filter.list)}) `;
                    break;
            }
        });
    }

    return query;
}

async function paginationToQuery(pagination, map, alias) {
    var sqlResolve = ''
    if (pagination.field == null || pagination.order == null) {
        sqlResolve += ' ORDER BY ' + alias + '.R_E_C_N_O_ ASC '
    } else {
        sqlResolve += ` ORDER BY ${map.get(pagination.field)} ${pagination.order}`

        if (pagination.rows !== undefined && pagination.offset !== undefined) {
            sqlResolve += ` OFFSET ${pagination.offset} ROWS FETCH NEXT ${pagination.rows} ROWS ONLY `;
        }
    }
    return sqlResolve;
}

async function mapToColumns(map) {
    var columns = ""

    for (const [key, value] of map.entries()) {
        columns += `${value} as '${key}',`
    }

    return columns.substring(0, columns.length - 1);;
}

function formatIn(list) {
    var formatIn = '';
    list.forEach(value => {
        formatIn += `'${value}',`
    });

    return formatIn.substring(0, formatIn.length - 1);
}

module.exports = { filterToQuery, mapToColumns, paginationToQuery };