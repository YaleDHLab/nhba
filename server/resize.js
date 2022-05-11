const sharp = require('sharp');
const glob = require('glob');
const path = require('path');

const dirs = {
  raw: 'build/assets/uploads/raw',
  resized: 'build/assets/uploads/resized'
};

const sizes = {
  small: {
    width: 500,
    height: 330
  },
  medium: {
    width: 1000,
    height: 660
  },
  large: {
    width: 1500,
    height: 990
  }
};

// execute the resize
const resizeImage = (file, width, height, outputdir) =>
  new Promise((resolve, reject) => {
    sharp(file)
      .resize(
        {
          width: 200,
          height: 200,
          fit: sharp.fit.inside,
          position: sharp.strategy.entropy
        })
      .toFile(outputdir, err => {
        if (err) {
          reject();
        } else {
          resolve();
        }
      });
  });

// make calls to resize the image at each size
const getAllSizes = file =>
  new Promise(resolve => {
    const basename = path.basename(file);

    // get each of the required sizes
    Object.keys(sizes).forEach((size, idx) => {
      const outputdir = `${dirs.resized}/${size}/${basename}`;
      const { width } = sizes[size];
      const { height } = sizes[size];
      const resizedImage = resizeImage(file, width, height, outputdir);
      resizedImage.then(() => {
        if (idx === Object.keys(sizes).length - 1) {
          resolve();
        }
      });
    });
  });

// resize all uploads
const uploads = () => {
  glob(`${dirs.raw}/*`, (err, files) => {
    if (err) {
      console.warn(err);
    } else {
      files.forEach(file => {
        getAllSizes(file);
      });
    }
  });
};

// resize one upload
const upload = filepath =>
  new Promise(resolve => {
    const allResizes = getAllSizes(filepath);
    allResizes.then(() => {
      resolve();
    });
  });

// return file resize api
module.exports = {
  uploads,
  upload
};
