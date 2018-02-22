/* Initialize the About and Contact pages in the db */

const mongoose = require('mongoose');
const models = require('../models');
const config = require('../../../config');

mongoose.connect(`mongodb://localhost/${config.db}`);

const routes = ['About', 'Contact'];
let completed = 0;

routes.map(route => {
  const page = {
    route,
    text:
      'Lorem ipsum dolor sit amet, venenatis sodales placerat, in voluptates \
      hac, dui a sed nullam purus.',
  };

  const simplePage = new models.simplepage(page);
  simplePage.save(err => {
    if (err) console.info(err);
    completed++;
    if (completed == routes.length) {
      console.info(' * initialized simplepages');
      process.exit();
    }
  });
});
