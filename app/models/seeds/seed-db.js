/**
 * Run this file to create seed data for the database
 * Usage: node seed-db.js
 * */

const faker = require('faker');
const models = require('../models');
const moment = require('moment');
const mongoose = require('mongoose');
const config = require('../../../config');
const _ = require('lodash');

mongoose.connect(`mongodb://localhost/${config.db}`);

/**
 * Configure seed
 * */

const nBuildings = 50; // the number of buildings to generate
const nSelectOptions = 10; // the number of options per select field
const loc = { lat: 41.3062931, long: -72.9348493 }; // initial location

/**
 * Drop extant tables
 * */

const dropTable = tableName => {
  try {
    models[tableName].drop();
  } catch (err) {
    console.info('failed to drop ', `${+tableName} table`);
  }
};

['buildings', 'selects'].map(table => {
  dropTable(table);
});

/**
 * Seed select fields
 * */

const selects = {}; // map each select field to {'label': str, 'options': []}
const selectOptions = [
  'tour',
  'building_type',
  'current_use',
  'style',
  'era',
  'neighborhood'
];

selectOptions.map(select => {
  const options = [];
  _.times(nSelectOptions, () => {
    options.push(faker.lorem.word());
  });

  selects[select] = {
    label: select,
    options
  };
});

// post each select to the db
Object.keys(selects).map(select => {
  const s = selects[select];
  const Select = new models.select(s);
  Select.save();
});

/**
 * Seed buildings
 * */

const randomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const getSelectOption = selectLabel => {
  const options = selects[selectLabel].options;
  return options[randomNumber(0, nSelectOptions - 1)];
};

for (let i = 0; i < nBuildings; i++) {
  const building = {
    // short text fields
    address: faker.address.streetAddress(),
    name: faker.company.companyName(),
    year_built: moment(faker.date.past()).format('YYYY'),
    historic_use: faker.lorem.words(),
    neighborhood: faker.lorem.words(),

    architect: faker.lorem.words(),
    client: faker.lorem.words(),
    current_tenant: faker.lorem.words(),
    researcher: faker.lorem.words(),

    // paragraph text fields
    description: faker.lorem.paragraph(),
    streetscape: faker.lorem.paragraph(),
    social_history: faker.lorem.paragraph(),
    overview: faker.lorem.paragraph(),
    physical_description: faker.lorem.paragraph(),
    site_history: faker.lorem.paragraph(),

    tour: faker.lorem.words(),
    storymap_url: faker.lorem.words(),
    archive_documents: [
      {
        url: 'https://lorempixel.com/800/500/city/',
        label: faker.lorem.words()
      },
      {
        url: 'https://lorempixel.com/800/500/city/',
        label: faker.lorem.words()
      }
    ],
    resources: [
      {
        url: 'https://lorempixel.com/800/500/city/',
        label: faker.lorem.words()
      },
      {
        url: 'https://lorempixel.com/800/500/city/',
        label: faker.lorem.words()
      }
    ],
    location: {
      latitude: loc.lat + randomNumber(-20, 20) / 1000,
      longitude: loc.long + randomNumber(-20, 20) / 1000
    }
  };

  selectOptions.map(select => {
    building[select] = getSelectOption(select);
  });

  const Building = new models.building(building);
  Building.save();

  console.info(' * saved building', i);
}
