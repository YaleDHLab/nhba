var NodeGeocoder = require('node-geocoder');
var request = require('superagent');
var api = require('../config');
var fs = require('fs');

var geocoder = NodeGeocoder({
  provider: 'google',
  httpAdapter: 'https',
  formatter: null,
});

var writeFile = (filename, content) => {
  fs.writeFile(filename, JSON.stringify(content), err => {
    if (err) {
      console.warn('could not write', filename);
    }
    console.info(' * wrote', filename);
  });
};

var geocode = (buildingId, address, callback) => {
  var dir = 'server/geocode-responses/';
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  geocoder.geocode(address, (err, res) => {
    var filename = dir + buildingId + '.json';
    writeFile(filename, res);
    callback(err, res);
  });
};

var geocodeAll = () => {
  api.get('buildings', (buildingError, buildingResponse) => {
    if (buildingError) console.warn('geocode call failed with', buildingError);
    buildingResponse.body.map((building, buildingIndex) => {
      // sleep between requests
      setTimeout(() => {
        request
          .post(api.endpoint + 'geocode')
          .send(building)
          .set('Accept', 'application/json')
          .end(err => {
            if (err) {
              console.warn('geocoding failed for', building._id, err);
            } else {
              console.info('geocoding succeeded for', building._id);
            }
          });
      }, buildingIndex * 4000);
    });
  });
};

module.exports = {
  geocode: geocode,
  geocodeAll: geocodeAll,
};
