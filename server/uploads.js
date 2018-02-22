const multer = require('multer');
const resize = require('./resize');
const path = require('path');

const destination = path.join('build', 'assets', 'uploads', 'files');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, destination);
  },
  filename(req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

module.exports = function uploads(app) {
  app.post('/api/upload', upload.single('attachment'), (req, res) => {
    // If the user passed resize params, resize the attached image
    if (req.query.resize && req.query.resize === 'true') {
      const resizedUpload = resize.upload(
        path.join(destination, req.file.originalname),
      );
      resizedUpload.then(() => {
        res.status(200).send({
          status: 'great',
          file: {
            name: req.file.originalname,
          },
        });
      });

      // User has not requested resizing; send a 200 response
    } else {
      res.status(200).send({
        status: 'great',
        file: {
          name: req.file.originalname,
        },
      });
    }
  });
};
