/* Initialize the Glossary within the site db */
const mongoose = require('mongoose')
const models = require('../models')
const config = require('../../../config')
const _ = require('lodash')

mongoose.connect('mongodb://localhost/' + config.db)

const terms = [
  {
    'label': 'Art Deco',
    'text': 'A very popular style of the 1920s and 30s in other cities, Art Deco is more rare in New Haven and often comes in its later, more streamlined phase.  Not very much of the vertical, zig-zag style of the 20s.  But a few lovely moderne gems to be found here.'
  },
  {
    'label': 'Beaux Arts Classical',
    'text': 'Balanced, sober, and drawing on classical architectural vocabularies: colonnades, pilasters, pediments, etc - the beaux arts classical became popular in the early twentieth century during the City Beautiful era of urban planning.  Key examples in New Haven include early twentieth century public buildings that face the Green, including the New Haven Free Public Library Ives Branch and the great temples of the Circuit Court and the Post Office building, now used as a county courthouse.'
  }
]

let completed = 0;

terms.map((term) => {
  const glossaryTerm = new models.glossaryterm(term);
  glossaryTerm.save((err, res) => {
    if (err) console.log(err)
    completed++;
    if (completed == terms.length) {
      console.log(' * initialized glossaryterms')
      process.exit()
    }
  });
})
