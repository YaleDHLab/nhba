const sharp = require('sharp');
const glob = require('glob');
const path = require('path');

const dirs = {
  raw: 'build/assets/uploads/raw',
  resized: 'build/assets/uploads/resized',
};

const sizes = {
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
const getAllSizes = file =>
  new Promise(resolve => {
    const basename = path.basename(file);

    // get each of the required sizes
    Object.keys(sizes).map((size, idx) => {
      const outputdir = `${dirs.resized}/${size}/${basename}`;
      const width = sizes[size].width;
      const height = sizes[size].height;
      const resizedImage = resizeImage(file, width, height, outputdir);
      resizedImage.then(() => {
        if (idx == Object.keys(sizes).length - 1) {
          resolve();
        }
      });
    });
  });

// execute the resize
var resizeImage = (file, width, height, outputdir) =>
  new Promise((resolve, reject) => {
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

// resize all uploads
const uploads = () => {
  glob(`${dirs.raw}/*`, (err, files) => {
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
  upload,
};
