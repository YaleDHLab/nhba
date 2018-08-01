const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const _ = require('lodash');
mongoose.Promise = require('bluebird');

// config
const table = 'building';
const db = require('../db');

const capitalized = _.startCase(_.toLower(table));
const schema = new mongoose.Schema(db[table]);

schema.plugin(mongoosePaginate);

schema.index({ location: '2dsphere' });
schema.set('autoIndex', false);

module.exports = mongoose.model(capitalized, schema, `${table}s`);
