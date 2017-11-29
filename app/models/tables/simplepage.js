var mongoose = require('mongoose')
var autoIncrement = require('mongoose-auto-increment')
var mongoosePaginate = require('mongoose-paginate')
var _ = require('lodash')
mongoose.Promise = require('bluebird')

// config
var table = 'simplepage'
var db = require('../db')
var config = require('../../../config')
var capitalized = _.startCase(_.toLower(table))
var schema = new mongoose.Schema(db[table])

// autoincrement a new {{table}}Id field and add pagination
autoIncrement.initialize(mongoose.createConnection('mongodb://localhost/' + config.db))
schema.plugin(autoIncrement.plugin, {model: capitalized, field: table + 'Id'})
schema.plugin(mongoosePaginate)

module.exports = mongoose.model(capitalized, schema, table + 's')