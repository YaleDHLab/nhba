var sharp = require('sharp');
var glob = require('glob');
var path = require('path');

var dirs = {
  raw: 'build/assets/uploads/raw',
  resized: 'build/assets/uploads/resized',
};

var sizes = {
  small: {
    width: 500,
    height: 330,
  },
  medium: {
    width: 1000,
    height: 660,
  },
  large: {
    width: 1500,
    height: 990,
  },
};

// make calls to resize the image at each size
var getAllSizes = file => {
  return new Promise(resolve => {
    var basename = path.basename(file);

    // get each of the required sizes
    Object.keys(sizes).map((size, idx) => {
      var outputdir = dirs.resized + '/' + size + '/' + basename;
      var width = sizes[size].width;
      var height = sizes[size].height;
      var resizedImage = resizeImage(file, width, height, outputdir);
      resizedImage.then(() => {
        if (idx == Object.keys(sizes).length - 1) {
          resolve();
        }
      });
    });
  });
};

// execute the resize
var resizeImage = (file, width, height, outputdir) => {
  return new Promise((resolve, reject) => {
    sharp(file)
      .resize(width, height)
      .min()
      .toFile(outputdir, err => {
        if (err) {
          reject();
        } else {
          console.info(' * created a', width, 'x', height, 'resize of', file);
          resolve();
        }
      });
  });
};

// resize all uploads
var uploads = () => {
  glob(dirs.raw + '/*', (err, files) => {
    if (err) {
      console.warn(err);
    } else {
      files.map(file => {
        getAllSizes(file);
      });
    }
  });
};

// resize one upload
var upload = filepath => {
  return new Promise(resolve => {
    var allResizes = getAllSizes(filepath);
    allResizes.then(() => {
      resolve();
    });
  });
};

// return file resize api
module.exports = {
  uploads: uploads,
  upload: upload,
};
