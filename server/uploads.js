var multer = require("multer");
var resize = require("./resize");
var path = require("path");

var destination = path.join("build", "assets", "uploads", "files");

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, destination);
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  },
});

var upload = multer({ storage: storage });

module.exports = function(app) {
  app.post("/api/upload", upload.single("attachment"), (req, res, next) => {
    // If the user passed resize params, resize the attached image
    if (req.query.resize && req.query.resize == "true") {
      var uploads = resize.upload(
        path.join(destination, req.file.originalname)
      );
      uploads.then(function() {
        res.status(200).send({
          status: "great",
          file: {
            name: req.file.originalname,
          },
        });
      });

      // User has not requested resizing; send a 200 response
    } else {
      res.status(200).send({
        status: "great",
        file: {
          name: req.file.originalname,
        },
      });
    }
  });
};
