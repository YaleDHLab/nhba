var multer = require('multer')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'build/assets/uploads/files')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});

var upload = multer({ storage: storage });

module.exports = function(app) {
  app.post('/api/upload', upload.single('image'),  (req, res, next) => {
    res.status(200).send({
      status: 'great',
      file: {
        name: req.file.originalname
      }
    });
  })
}