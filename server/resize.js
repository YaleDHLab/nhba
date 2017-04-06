var sharp = require('sharp')
var glob = require('glob')
var path = require('path')

var dirs = {
  raw: '../build/assets/uploads/raw',
  resized: '../build/assets/uploads/resized'
}

var sizes = {
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
}

// make calls to resize the image at each size
var getAllSizes = (file) => {
  var basename = path.basename(file)
        
  // get each of the required sizes
  Object.keys(sizes).map((size) => {
    var outputdir = dirs.resized + '/' + size + '/' + basename;
    var width = sizes[size].width;
    var height = sizes[size].height;
    resizeImage(file, width, height, outputdir)
  })
}

// execute the resize
var resizeImage = (file, width, height, outputdir) => {
  sharp(file)
    .resize(width, height)
    .min()
    .toFile(outputdir, (err, info) => {
      if (err) { console.warn(err, file) } else {
        console.log(' * created a', width, 'x', height, 'resize of', file)
      }
    })
}

// return file resize api
module.exports = {
  
  // resize all uploads
  uploads: function() {
    glob(dirs.raw + '/*', (err, files) => {
      if (err) { console.warn(err) } else {
        files.map((file) => {
          getAllSizes(file)
        })
      }
    })
  },

  // resize one upload
  upload: function(filepath) {
    getAllSizes(filepath)
  }
}
