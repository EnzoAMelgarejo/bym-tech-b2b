const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  server: process.env.DB_ADDRESS,
  port: Number(process.env.DB_PORT),
  dialect: "mssql",
  options: {
    encrypt: false,
    trustServerCertificate: true,
    trustedConnection: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  debug: true,
  options: {
    encrypt: false,
    instanceName: process.env.DB_INSTANCE
  }
};

async function getConfig(env) {
  var dbConfigDb = {
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    server: env.DB_ADDRESS,
    port: Number(env.DB_PORT),
    dialect: "mssql",
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    },
    debug: true,
    options: {
      encrypt: false,
      trustServerCertificate: true,
      trustedConnection: true,
    },
  }
  return dbConfigDb;
}

module.exports = { dbConfig, getConfig };