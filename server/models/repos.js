const DB = require('./db_mysql');

const Repos = DB.Model.extend({tableName: 'starred_repos', hasTimestamps: false});

module.exports = DB.model('Repos', Repos);