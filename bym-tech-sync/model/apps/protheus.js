
const { PRODUCT, CUSTOMER, FILTER, FILTER_CHILDREN, INVOICE, ORDER, PROVIDER } = require('../utils/const');

//Create application code
const application = 'PROTHEUS';
//Create map
const productMap = new Map();
const customerMap = new Map();
const filterMap1 = new Map();
const filterMap2 = new Map();
const filterMap3 = new Map();
const filterMap4 = new Map();
const orderMap = new Map();
const invoiceMap = new Map();
const providerMap = new Map();

//define convert values
productMap.set(PRODUCT.code, 'B1_COD');
productMap.set(PRODUCT.name, 'B1_DESC');
productMap.set(PRODUCT.bio, "B1_DESC")
productMap.set(PRODUCT.img1, "ISNULL(D.ADD_IMG1,'')")
productMap.set(PRODUCT.img2, "ISNULL(D.ADD_IMG2,'')")
productMap.set(PRODUCT.img3, "ISNULL(D.ADD_IMG3,'')")
productMap.set(PRODUCT.img4, "ISNULL(D.ADD_IMG4,'')")
productMap.set(PRODUCT.img5, "''")
productMap.set(PRODUCT.doc1, "''")
productMap.set(PRODUCT.doc2, "''")
productMap.set(PRODUCT.doc3, "''")
productMap.set(PRODUCT.quant, " ISNULL((SELECT SUM(B2_QATU) FROM SB2010 (NOLOCK) WHERE B2_COD = SB1.B1_COD and SB2010.D_E_L_E_T_ = ' '),0) ")
productMap.set(PRODUCT.coin, "CASE ISNULL(DA1_MOEDA,1) WHEN 1 THEN 'ARS' WHEN 2 THEN 'USD' WHEN 3 THEN 'EUR' END ")
productMap.set(PRODUCT.price, "ISNULL(DA1_PRCVEN,0)")
productMap.set(PRODUCT.filter1, 'SUBSTRING(B1_XFILWEB,1,3)');
productMap.set(PRODUCT.filter2, 'SUBSTRING(B1_XFILWEB,4,3)');
productMap.set(PRODUCT.filter3, 'SUBSTRING(B1_XFILWEB,7,3)');
productMap.set(PRODUCT.filter4, 'SUBSTRING(B1_XFILWEB,10,3)');
productMap.set(PRODUCT.brand, 'B1_GRUPO');
productMap.set(PRODUCT.brandName, "ISNULL(BM_DESC, '')");
productMap.set(PRODUCT.client, "ISNULL(A1_COD,'000000')");
productMap.set(PRODUCT.search, "CONCAT(B1_COD,'|',B1_DESC)");
productMap.set(PRODUCT.feature, "CONCAT('<ul>','<li>','<b>Nombre en Inglés: </b>', B1_XNOMENG, '</li><li><b>ANMAT: </b>',B1_XANMAT,'</li><li><b>Peligroso: </b>', B1_XPELIGR, '</li><li><b>Meses de Garantía: </b>', B1_XMESGAR,'</li></ul>')");

customerMap.set(CUSTOMER.code, 'A1_COD');
customerMap.set(CUSTOMER.bio, 'A1_NOME');
customerMap.set(CUSTOMER.email, 'A1_EMAIL');
customerMap.set(CUSTOMER.img, "''");
customerMap.set(CUSTOMER.state, 'TRIM(X5_DESCSPA)')
customerMap.set(CUSTOMER.vend, "ISNULL(TRIM(A4_NOME),'')")
customerMap.set(CUSTOMER.vendMail, "ISNULL(TRIM(A4_EMAIL),'')")

filterMap1.set(FILTER.code, 'ZW1_COD');
filterMap1.set(FILTER.description, 'ZW1_DESCRI');

filterMap2.set(FILTER_CHILDREN.code, 'ZW2_COD');
filterMap2.set(FILTER_CHILDREN.description, 'ZW2_DESCRI');
filterMap2.set(FILTER_CHILDREN.father, 'ZW2_PADRE');

filterMap3.set(FILTER_CHILDREN.code, 'ZW3_COD');
filterMap3.set(FILTER_CHILDREN.description, 'ZW3_DESCRI');
filterMap3.set(FILTER_CHILDREN.father, 'ZW3_PADRE');

filterMap4.set(FILTER_CHILDREN.code, 'ZW4_COD');
filterMap4.set(FILTER_CHILDREN.description, 'ZW4_DESCRI');
filterMap4.set(FILTER_CHILDREN.father, 'ZW4_PADRE');

invoiceMap.set(INVOICE.number, 'F2_DOC');
invoiceMap.set(INVOICE.serie, 'F2_SERIE');
invoiceMap.set(INVOICE.obs, "''");
invoiceMap.set(INVOICE.coin, 'F2_MOEDA');
invoiceMap.set(INVOICE.date, 'F2_EMISSAO');
invoiceMap.set(INVOICE.subtotal, 'F2_VALMERC');
invoiceMap.set(INVOICE.tax, 'F2_VALIMP1');
invoiceMap.set(INVOICE.total, 'F2_VALBRUT');


orderMap.set(ORDER.number, 'C5_NUM');
orderMap.set(ORDER.serie, "'PV'");
orderMap.set(ORDER.obs, "C5_MENNOTA");
orderMap.set(ORDER.coin, 'C5_MOEDA');
orderMap.set(ORDER.date, 'C5_EMISSAO');
orderMap.set(ORDER.subtotal, '0');
orderMap.set(ORDER.tax, '0');
orderMap.set(ORDER.total, '0');

providerMap.set(PROVIDER.code, 'BM_GRUPO');
providerMap.set(PROVIDER.description, 'BM_DESC');


const protheus = {
    application: application,
    product: productMap,
    customer: customerMap,
    filter1: filterMap1,
    filter2: filterMap2,
    filter3: filterMap3,
    filter4: filterMap4,
    order: orderMap,
    invoice: invoiceMap,
    provider: providerMap,
}

module.exports = { protheus };