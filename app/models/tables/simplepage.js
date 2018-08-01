const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const _ = require('lodash');
mongoose.Promise = require('bluebird');

// config
const table = 'simplepage';
const db = require('../db');

const capitalized = _.startCase(_.toLower(table));
const schema = new mongoose.Schema(db[table]);

// autoincrement a new {{table}}Id field and add pagination
schema.plugin(mongoosePaginate);

module.exports = mongoose.model(capitalized, schema, `${table}s`);
