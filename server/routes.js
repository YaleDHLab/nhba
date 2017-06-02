var mongoose = require('mongoose')
var models = require('../app/models/models')
var config = require('../config')
var geocoder = require('./geocoder')
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

/**
* Helper that adds a building location in geojson to building
**/

const getLocation = (lng, lat) => {
  return lng && lat ?
      {
        'type': 'Point',
        'coordinates': [lng, lat]
      }
    : undefined;
}

const updateBuildingFields = (building) => {
  building.updated_at = new Date();
  building.location = getLocation(
    building.longitude,
    building.latitude
  );
  return building;
}

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
      query = { $and: [ query, imageQuery ] }
    }

    // all queries sent from filter component pass this flag
    if (req.query.filter && req.query.filter == 'true') {
      var queryTerms = [];

      // remove filter and fulltext from the list of query terms
      var keys = _.filter(_.keys(req.query), (k) => {
        return !_.includes(['filter', 'fulltext'], k)
      })

      if (req.query.fulltext) {
        var textQuery = {
          '$or': [
            {
              'overview_description': {
                $regex: req.query.fulltext,
                $options: 'i'
              }
            },
            {
              'address': {
                $regex: req.query.fulltext,
                $options: 'i'
              }
            }
          ]
        };

        queryTerms.push(textQuery)
      }

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

  app.get('/api/building/new', (req, res) => {
    if (process.env['NHBA_ENVIRONMENT'] === 'production') {
      if (!req.session.admin) {
        res.status(403).send('This action could not be completed')
      }
    }

    var building = new models.building({});
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
    if (process.env['NHBA_ENVIRONMENT'] === 'production') {
      if (!req.session.admin) {
        res.status(403).send('This action could not be completed')
      }
    }

    // update buildings that have ids
    var building = req.body;
    if (building._id) {
      building = updateBuildingFields(building);
      models.building.update({_id: building._id}, {$set: building},
          {overwrite: true}, (err, data) => {
        if (err) return res.status(500).send({cause: err})
          return res.status(200).send(data)
      })

    } else {
      var newBuilding = new models.building(building);
      newBuilding.created_at = new Date();
      newBuilding.save((err, data) => {
        if (err) return res.status(500).send({cause: err})
          return res.status(200).send(data)
      })
    }
  })

  /**
  *
  * Delete building
  *
  **/

  app.post('/api/building/delete', (req, res) => {
    if (process.env['NHBA_ENVIRONMENT'] === 'production') {
      if (!req.session.admin) {
        res.status(403).send('This action could not be completed')
      }
    }

    var building = req.body;
    if (building._id) {
      models.building.remove({_id: building._id}, (err, data) => {
        if (err) return res.status(500).send({cause: err})
          res.status(200).send(data)
      })
    }
  })

  /**
  *
  * Geocode building
  *
  **/

  app.post('/api/geocode', (req, res) => {
    if (process.env['NHBA_ENVIRONMENT'] === 'production') {
      if (!req.session.admin) {
        res.status(403).send('This action could not be completed')
      }
    }

    var building = req.body;
    geocoder.geocode(building._id, building.address, (geoErr, geoRes) => {
      if (geoErr) res.status(500).send({cause: geoErr})
      var match = geoRes ? geoRes[0] : null;
      if (match) {
        var lat = parseFloat(match.latitude),
            lng = parseFloat(match.longitude);
        building.latitude = lat;
        building.longitude = lng;
        building.location = getLocation(lng, lat);

        // configure the update
        var query = {_id: building._id};
        var update = {$set: building};

        models.building.update(query, update, (saveErr, saveData) => {
          if (saveErr) return res.status(500).send({cause: saveErr})
            return res.status(200).send({
              latitude: lat,
              longitude: lng
            })
        })
      } else {
        return res.status(200).send('address not found')
      }
    })
  })

  /**
  *
  * About routes
  *
  **/

  app.get('/api/about', (req, res) => {
    models.simplepage.find({'route': 'About'}, (err, data) => {
      if (err) return res.status(500).send({cause: err})
        return res.status(200).send(data)
    })
  })

  app.post('/api/about/save', (req, res) => {
    var query = {'route': 'About'};
    var options = {upsert: true};

    models.simplepage.findOneAndUpdate(query, req.body, options, (err, data) => {
      if (err) return res.status(500).send({cause: err})
        return res.status(200).send(data)
    })
  })

  /**
  *
  * Contact routes
  *
  **/

  app.get('/api/contact', (req, res) => {
    models.simplepage.find({'route': 'Contact'}, (err, data) => {
      if (err) return res.status(500).send({cause: err})
        return res.status(200).send(data)
    })
  })

  app.post('/api/contact/save', (req, res) => {
    var query = {'route': 'Contact'};
    var options = {upsert: true};

    models.simplepage.findOneAndUpdate(query, req.body, options, (err, data) => {
      if (err) return res.status(500).send({cause: err})
        return res.status(200).send(data)
    })
  })

  /**
  *
  * Glossary routes
  *
  **/

  app.get('/api/glossary', (req, res) => {
    models.glossaryterm.find({}, (err, data) => {
      if (err) return res.status(500).send({cause: err})
        return res.status(200).send(data)
    })
  })

  app.post('/api/glossary/save', (req, res) => {
    var options = {upsert: true};
    var results = [];

    // remove all glossary terms then save each new glossary term
    models.glossaryterm.remove({}, () => {
      req.body.map((doc) => {

        var term = new models.glossaryterm(doc);
        term.save((err, term) => {
          results.push(err ? err : term)

          if (results.length == req.body.length) {
            return res.status(200).send(results)
          }
        })
      })
    })
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