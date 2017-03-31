var mongoose = require('mongoose')
var models = require('./app/models/models')
var config = require('./config')
var path = require('path')

/***
*
* Connect to the Mongoose db
*
***/

mongoose.connect('mongodb://localhost/' + config.db)
mongoose.connection.on('error', (err) => {
  console.log(err)
})

module.exports = function(app) {

  /***
  *
  * Data routes
  *
  ***/

  app.get('/api/buildings', (req, res) => {
    var query = {}

    if (req.query.buildingId) {
      query.buildingId= parseInt(req.query.buildingId)
    }

    models.building.find(query,
      (err, data) => {
        if (err) return res.status(500).send({cause: err})
        return res.status(200).send(data)
    })
  })

  /***
  *
  * New records
  *
  ***/

  app.post('/api/buildings/new', (req, res) => {
    var building = new models.building(req.body);

    building.save((err, data) => {
      if (err) return res.status(500).send({cause: err})
      return res.status(200).send(data)
    })
  })

  /***
  *
  * View routes
  *
  ***/

  // send requests to index.html so browserHistory in React Router works
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
  })
}