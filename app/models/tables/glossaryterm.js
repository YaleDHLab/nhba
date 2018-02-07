var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var _ = require('lodash');
mongoose.Promise = require('bluebird');

// config
var table = 'glossaryterm';
var db = require('../db');
var capitalized = _.startCase(_.toLower(table));
var schema = new mongoose.Schema(db[table]);

schema.plugin(mongoosePaginate);

module.exports = mongoose.model(capitalized, schema, table + 's');
