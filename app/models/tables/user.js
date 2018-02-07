var mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate");
var _ = require("lodash");
mongoose.Promise = require("bluebird");

// config
var table = "user";
var db = require("../db");
var config = require("../../../config");
var capitalized = _.startCase(_.toLower(table));
var schema = new mongoose.Schema(db[table]);

// autoincrement a new {{table}}Id field and add pagination
schema.plugin(mongoosePaginate);

module.exports = mongoose.model(capitalized, schema, table + "s");
