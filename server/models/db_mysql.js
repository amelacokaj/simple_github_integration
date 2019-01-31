const knex = require('knex')(require('../knex.mysql'));
const Bookshelf = require('bookshelf')(knex);

Bookshelf.plugin('registry');// Resolve circular dependencies with relations
Bookshelf.plugin(require('bookshelf-modelbase').pluggable);

module.exports = Bookshelf; 