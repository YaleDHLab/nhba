const faker = require('faker')
const models = require('../models')
const moment = require('moment')
const mongoose = require('mongoose')
const config = require('../../../config')

mongoose.connect('mongodb://localhost/' + config.db)

// config
const nBuildings = 50;
const table = models.building;

// initial location
const loc = {lat: 41.3062931, long: -72.9348493};

const randomNumber = (min, max) => Math.floor(Math.random()*(max-min+1)+min);

const dropTable = () => {
  try {
    table.drop()
  } catch(err) {
    console.log('couldn\'t remove', table)
  }
}

for (let i=0; i<nBuildings; i++) {
  const building = {
    
    // short text fields
    address: faker.address.streetAddress(),
    name: faker.company.companyName(),
    yearBuilt: moment(faker.date.past()).format('YYYY'),

    style: faker.lorem.words(),
    currentUse: faker.lorem.words(),
    historicUse: faker.lorem.words(),
    neighborhood: faker.lorem.words(),
    
    architect: faker.lorem.words(),
    client: faker.lorem.words(),
    currentTenant: faker.lorem.words(),
    researcher: faker.lorem.words(),

    // paragraph text fields
    description: faker.lorem.paragraph(),
    streetscape: faker.lorem.paragraph(),
    socialHistory: faker.lorem.paragraph(),
    overview: faker.lorem.paragraph(),


    tour: faker.lorem.words(),
    storyMapURL: faker.lorem.words(),
    archiveDocuments: [
      {
        url: 'http://lorempixel.com/800/500/city/',
        label: faker.lorem.words()
      },
      {
        url: 'http://lorempixel.com/800/500/city/',
        label: faker.lorem.words()
      }
    ],
    resources: [
      {
        url: 'http://lorempixel.com/800/500/city/',
        label: faker.lorem.words()
      },
      {
        url: 'http://lorempixel.com/800/500/city/',
        label: faker.lorem.words()
      }
    ],
    location: {
      latitude: loc.lat + randomNumber(-20, 20)/1000,
      longitude: loc.long + randomNumber(-20, 20)/1000
    },
  }

  const Building = new table(building);
  Building.save()

  console.log(' * saved building', i)
}