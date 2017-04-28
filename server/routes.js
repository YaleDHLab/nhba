var mongoose = require('mongoose')
var models = require('../app/models/models')
var config = require('../config')
var path = require('path')
var _ = require('lodash')

/**
*
* Connect to the Mongoose db
*
**/

mongoose.connect('mongodb://localhost/' + config.db)
mongoose.connection.on('error', (err) => {
  console.log(err)
})

module.exports = function(app) {

  /**
  *
  * User routes
  *
  **/

  app.get('/api/users', (req, res) => {

    // remove the hashed password and access token from responses
    var select = {password: 0, token: 0};

    models.user.find({}, select, (err, data) => {
      if (err) return res.status(500).send({cause: err})
        return res.status(200).send(data)
    })
  })

  /**
  *
  * Tour routes
  *
  **/

  app.get('/api/wptours', (req, res) => {
    models.wptour.find({}, (err, data) => {
      if (err) return res.status(500).send({cause: err})
        return res.status(200).send(data)
    })
  })

  /**
  *
  * Data routes
  *
  **/

  app.get('/api/buildings', (req, res) => {
    var query = {}

    if (req.query.buildingId) {
      query._id= req.query.buildingId
    }

    if (req.query.images && req.query.images == 'true') {
      var imageQuery = {$where: 'this.images.length > 0'}
      query = {
        $and: [
          query,
          imageQuery
        ]
      }
    }

    if (req.query.filter && req.query.filter == 'true') {
      var queryTerms = [];

      // remove filter from the list of query terms
      var keys = _.pull(Object.keys(req.query), 'filter');

      keys.map((key) => {
        var queryTerm = {}

        // values with ' ' use _ as whitespace separator in query
        var values = []
        req.query[key].split(' ').map((value) => {
          values.push(value.split('_').join(' '))
        })

        // ensure returned records have all of the selected levels
        queryTerm[key] = { $all: values }
        queryTerms.push(queryTerm)
      })

      // ensure we only return buildings with 1 or more images
      queryTerms.push({$where: 'this.images.length > 0'})
      var query = {$and: queryTerms}
    }

    models.building.find(query,
      (err, data) => {
        if (err) return res.status(500).send({cause: err})
          return res.status(200).send(data)
    })
  })

  /**
  *
  * New records
  *
  **/

  app.post('/api/building/new', (req, res) => {
    var building = new models.building(req.body);

    building.save((err, data) => {
      if (err) return res.status(500).send({cause: err})
        return res.status(200).send(data)
    })
  })

  /**
  *
  * Save building
  *
  **/

  app.post('/api/building/save', (req, res) => {

    // grab the building from the post body
    var building = req.body;

    if (building._id) {

      // specify the query we'll use to find the document to modify
      var query = {_id: building._id}

      // specify the update params
      var update = {overwrite: true};

      models.building.findOneAndUpdate(query, building, update, (err, data) => {
        if (err) return res.status(500).send({cause: err})
          return res.status(200).send(data)
      })

    } else {
      var newBuilding = new models.building(building);
      newBuilding.save((err, data) => {
        if (err) return res.status(500).send({cause: err})
          return res.status(200).send(data)
      })
    }
  })

  /**
  *
  * View routes
  *
  **/

  // send requests to index.html so browserHistory in React Router works
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'build', 'index.html'))
  })
}