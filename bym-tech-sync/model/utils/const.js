const PRODUCT = {
    prefix: "PRODUCT",
    code: 'code',
    name: 'name',
    filter1: 'filter1',
    filter2: 'filter2',
    filter3: 'filter3',
    filter4: 'filter4',
    bio: 'bio',
    img1: 'img1',
    img2: 'img2',
    img3: 'img3',
    img4: 'img4',
    img5: 'img5',
    doc1: 'doc1',
    doc2: 'doc2',
    doc3: 'doc3',
    quant: 'quant',
    price: 'price',
    coin: 'coin',
    client: 'client',
    feature: 'feature',
    search: 'search',
    brand: 'brand',
    brandName: 'brandName'
}

const CUSTOMER = {
    prefix: "CUSTOMER",
    code: 'code',
    bio: 'bio',
    email: 'email',
    img: 'img',
    state: 'state',
    vend:'vend',
    vendMail:'vendMail',
    filter1: 'filter1',
    filter2: 'filter2',
    filter3: 'filter3',
    filter4: 'filter4',
}

const FILTER = {
    prefix: "FILTER",
    code: 'code',
    description: 'description',
}

const FILTER_CHILDREN = {
    prefix: "FILTER_CHILDREN",
    code: 'code',
    description: 'description',
    father: 'father'
}

const INVOICE = {
    prefix: "INVOICE",
    number: 'number',
    serie: 'serie',
    subtotal: 'subtotal',
    tax: 'tax',
    total: 'total',
    coin: 'coin',
    date: 'date',
    obs: 'obs'
}

const ORDER = {
    prefix: "ORDER",
    number: 'number',
    serie: 'serie',
    subtotal: 'subtotal',
    tax: 'tax',
    total: 'total',
    coin: 'coin',
    date: 'date',
    obs: 'obs'
}

const PROVIDER = {
    prefix: "PROVIDER",
    code: 'code',
    description: 'description',
}

module.exports = { PRODUCT, CUSTOMER, FILTER, FILTER_CHILDREN, INVOICE, ORDER, PROVIDER };