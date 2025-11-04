const { protheus } = require('./apps/protheus');

const Models = new Map();

Models.set(protheus.application, protheus);

module.exports = { Models };