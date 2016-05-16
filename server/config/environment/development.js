// Development specific configuration
// ==================================
module.exports = {

  DOMAIN: process.env.DOMAIN,
  // Sequelize connection opions
  quarc: {
    username: process.env.QUARC_MYSQL_USER,
    password: process.env.QUARC_MYSQL_PASS,
    database: process.env.QUARC_MYSQL_DB,
    host: process.env.QUARC_MYSQL_HOST,
    dialect: 'mysql',
    logging: true,
    timezone: '+05:30',
  },
  quantum: {
    username: process.env.QUANTUM_MYSQL_USER,
    password: process.env.QUANTUM_MYSQL_PASS,
    database: process.env.QUANTUM_MYSQL_DB,
    host: process.env.QUANTUM_MYSQL_HOST,
    dialect: 'mysql',
    logging: true,
    timezone: '+05:30',
  },
  solr: {
    host: process.env.SOLR_HOST,
    port: process.env.SOLR_PORT,
    core: process.env.SOLR_CORE,
    path: process.env.SOLR_PATH,
  },
  QDMS_PATH: process.env.QDMS_PATH,
  QUARC_PATH: process.env.QUARC_PATH,

  USER: JSON.parse(process.env.USER),

  URLS: {
    QUARC_UI_PARTNER: process.env.URLS_QUARC_UI_PARTNER,
    SLACK: process.env.URLS_SLACK,
  },

  AUTH: process.env.AUTH,
};
