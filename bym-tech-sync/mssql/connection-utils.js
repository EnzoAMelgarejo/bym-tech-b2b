const sql = require('mssql')
const { config, getConfig } = require('./db-config.js');

async function start() {
    try {
        var config = await getConfig(process.env);
        await sql.connect(config)
        console.log("Start - Connection successfully established.", config)
        return true;
    } catch (err) {
        console.log("Error - Error establishing connection.", err)
        return false;
    }
}

async function finish() {
    try {
        await sql.close();
        console.log("Close - Connection closed successfully.", config)
        return true;
    } catch (err) {
        console.log("Error", err)
        return false;
    }
}

async function querySQL(query) {
    try {
        await start();
        console.log(query)
        const result = await sql.query(query);
        return result.recordset;
    } catch (error) {
        console.error('Error executing the parameterized query:', error);
    }
    await finish();
}

async function queryUpdateSQL(queryUpdate) {
    try {
        await start();

        //Start transaction
        const transaction = new sql.Transaction();
        await transaction.begin();

        const result = await transaction.request().query(queryUpdate);

        await transaction.commit();
        //End transaction
        console.log('Transaction completed.');
    } catch (error) {
        console.error('Error executing the transaction:', error);
        await transaction.rollback();
    }

    await finish();
}

module.exports = { querySQL, queryUpdateSQL };