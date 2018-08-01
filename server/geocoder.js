const NodeGeocoder = require('node-geocoder');
const request = require('superagent');
const api = require('../config');
const fs = require('fs');

const geocoder = NodeGeocoder({
  provider: 'google',
  httpAdapter: 'https',
  formatter: null
});

const writeFile = (filename, content) => {
  fs.writeFile(filename, JSON.stringify(content), err => {
    if (err) {
      console.warn('could not write', filename);
    }
  });
};

const geocode = (buildingId, address, callback) => {
  const dir = 'server/geocode-responses/';
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  geocoder.geocode(address, (err, res) => {
    const filename = `${dir + buildingId}.json`;
    writeFile(filename, res);
    callback(err, res);
  });
};

const geocodeAll = () => {
  api.get('buildings', (buildingError, buildingResponse) => {
    if (buildingError) console.warn('geocode call failed with', buildingError);
    buildingResponse.body.forEach((building, buildingIndex) => {
      // sleep between requests
      setTimeout(() => {
        request
          .post(`${api.endpoint}geocode`)
          .send(building)
          .set('Accept', 'application/json')
          .end(err => {
            if (err) {
              console.warn('geocoding failed for', building._id, err);
            }
          });
      }, buildingIndex * 4000);
    });
  });
};

module.exports = {
  geocode,
  geocodeAll
};
