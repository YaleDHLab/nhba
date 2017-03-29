var mongoose = require('mongoose')
var autoIncrement = require('mongoose-auto-increment')
var mongoosePaginate = require('mongoose-paginate');
var db = require('../db')
var config = require('../../../config')
var table = 'building'

mongoose.Promise = require('bluebird')

// initialize the autoincrement plugin
var connection = mongoose.createConnection("mongodb://localhost/" + config.db)

// define the model schema
var schema = new mongoose.Schema(db[table])

// create a model using the schema
var capitalized = table[0].toUpperCase() + table.substring(1, table.length)

// autoincrement a new {{table}}Id field
autoIncrement.initialize(connection)
schema.plugin(autoIncrement.plugin, {model: capitalized, field: table + "Id"})

// add pagination support
schema.plugin(mongoosePaginate)

var model = mongoose.model(capitalized, schema, table + "s")

// make the model available to application
module.exports = model
