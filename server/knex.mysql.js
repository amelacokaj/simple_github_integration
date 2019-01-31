module.exports = {
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'github_integration',
    charset: 'UTF8_GENERAL_CI',
	timezone: "UTC"
  },
  pool: {
    min: 2,
    max: 10
  }
};