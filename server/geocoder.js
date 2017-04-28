var NodeGeocoder = require('node-geocoder')
var api = require('../config')
var fs = require('fs')

var geocoder = NodeGeocoder({
  provider: 'google',
  httpAdapter: 'https',
  formatter: null
});

var writeFile = (filename, content) => {
  fs.writeFile(filename, JSON.stringify(content), (err) => {
    if (err) {console.log('could not write', filename)}
      console.log(' * wrote', filename)
  })
}

var geocode = (buildingId, address, callback) => {
  geocoder.geocode(address, (err, res) => {
    var filename = 'server/geocode-responses/' + buildingId + '.json';
    writeFile(filename, res)

    callback(err, res)
  })
}

var geocodeAll = () => {
  api.get('buildings', (buildingError, buildingResponse) => {
    if (buildingError) {console.log('geocode call failed with', buildingError)}
      buildingResponse.body.map((building, buildingIndex) => {

        // sleep between requests
        setTimeout(() => {
          var buildingId = building._id;
          var geocodeUrl = 'geocode?buildingId=' + buildingId;

          api.get(geocodeUrl, (geocodeError, geocodeResponse) => {
            if (geocodeError) {console.log('geocoding failed for', buildingId, geocodeError)}
              console.log(' * geocoded building id', buildingId)
          })
        }, buildingIndex * 3000)
      })
  })
}

module.exports = {
  geocode: geocode,
  geocodeAll: geocodeAll
}