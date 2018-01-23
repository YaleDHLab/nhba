var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate')
var _ = require('lodash')
mongoose.Promise = require('bluebird')

// config
var table = 'building'
var db = require('../db')
var config = require('../../../config')
var capitalized = _.startCase(_.toLower(table))
var schema = new mongoose.Schema(db[table])

schema.plugin(mongoosePaginate)

schema.index({location: '2dsphere'})
schema.set('autoIndex', false);

module.exports = mongoose.model(capitalized, schema, table + 's')