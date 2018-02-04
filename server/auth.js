// auth.js
var bcrypt = require('bcryptjs')
var models = require('../app/models/models')
var mailer = require('./mailer')
var _ = require('lodash')

// specify the encryption level
var saltWorkFactor = parseInt(process.env['NHBA_SALT_WORK_FACTOR']) || 10

module.exports = function (app) {

  /**
  * Identify the messages delievered by the auth middleware to client
  **/

  var messages = {
    'emailTaken': 'Sorry, the requested email address is already taken.',
    'checkEmail': 'Success! Please check your email for further instructions.',
    'loginSuccess': 'Success! You are now logged in.',
    'loginFail': 'An incorrect username or password was entered. Please try again.',
    'logoutSuccess': 'Success! You are now logged out.',
    'logoutFail': 'Sorry, we could not log out out. Please try again.',
    'emailMissing': 'Sorry, this email address does not have any account information.',
    'passwordUpdated': 'Success! Your password has been updated.',
    'error': 'Sorry, we could not process your request. \
              Please contact an administrator for help.',
  };

  /**
  * Register new users
  **/

  // request made by client when attempting to add a user to the db
  app.post('/api/register', (req, res, next) => {
    models.user.find({ email: req.body.email }, (err, doc) => {
      initializeUserPassword(err, doc, req, res)
    })
  })

  /**
  * Create and email a token to a user's email for account verification
  *
  * @args:
  *   err: an error object from a mongoose query for a user
  *   doc: the result of a mongoose query for a user
  *   req: a request object from express
  *   res: a response object from express
  **/

  var initializeUserPassword = (err, doc, req, res) => {
    // if the requested email address is used, inform the client
    if (doc.length > 0) {
      return res.status(200).send({
        message: messages.emailTaken
      });
    }

    // else, create a new user with that email address
    var user = new models.user(req.body);

    bcrypt.genSalt(saltWorkFactor, (err, salt) => {
      if (err) return next(err);

      // hash the password and the new salt
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) return next(err);

        // store the salted password, not the cleartext password
        user.password = hash
        user.token = getToken()
        user.validated = false
        user.admin = false
        user.superadmin = false

        // email the user a validation token
        mailer.send(user.email, user.token, null)

        user.save((err, doc) => {
          if (err) return res.status(500).send({ cause: err });
          return res.status(200).send({
            message: messages.checkEmail
          });
        })
      })
    })
  }

  /**
  * Validate the account token emailed to user
  **/

  app.post('/api/validate', (req, res, next) => {
    var query = {
      email: req.body.email,
      token: req.body.token,
    }

    // find and validate the user
    models.user.find(query, (err, doc) => {
      authenticateUser(err, doc, req, res)
    })
  })

  /**
  * Create a new secure token for account validation
  **/

  var getToken = () => {
    var salt = bcrypt.genSaltSync(saltWorkFactor);
    return bcrypt.hashSync('B4c0/\/', salt);
  }

  /**
  * High level authentication check wrapper
  *
  * @args:
  *   err: an error object from a mongoose query for a user
  *   doc: the result of a mongoose query for a user
  *   req: a request object from express
  *   res: a response object from express
  **/

  var authenticateUser = (err, doc, req, res) => {
    if (err || doc.length == 0) {
      return res.status(200).send({
        message: messages.error
      });
    }

    var user = doc[0];

    bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
      if (err) return res.status(500).send({
        message: messages.error
      });

      // validate the user, update their credentials, and log them in
      if (isMatch) {
        validateUser(user, req, res)
      } else {
        return res.status(403).send({
          message: messages.loginFail
        });
      }
    })
  }

  /**
  * Validate a user and update their status if they're included in
  * the admin environment variable
  *
  * @args:
  *   {user}: an instance of the User table
  *   {req}: the current Express request
  *   {res}: the current Express response
  **/

  var validateUser = (user, req, res) => {
    var adminEmails = process.env['NHBA_ADMIN_EMAILS'];
    var superadminEmails = process.env['NHBA_SUPERADMIN_EMAILS'];
    adminEmails = adminEmails ? adminEmails.split(' ') : [];
    superadminEmails = superadminEmails ? superadminEmails.split(' ') : [];

    if (_.includes(adminEmails, user.email)) {
      user.admin = true;
    };

    if (_.includes(superadminEmails, user.email)) {
      user.superadmin = true;
    };

    user.validated = true;

    models.user.update({ _id: user._id }, { $set: user },
      { overwrite: true }, (err, data) => {
        if (err) console.warn(err);

        // update the user's session state
        loginSessionData(user, req);

        // inform the user they're logged in
        return res.status(200).send({
          message: messages.loginSuccess
        });
      })
  }

  /**
  * Store the user's authentication status in the session data
  *
  * @args:
  *   {obj} user: the result of a query for the current user
  *   {obj} req: the current request object
  **/

  var loginSessionData = (user, req) => {
    req.session.authenticated = true;
    if (user.admin) req.session.admin = true;
    if (user.superadmin) req.session.superadmin = true;
    req.session.userId = user._id;

    req.session.save((err) => {
      if (err) console.warn('could not save session', err)
    })
  }

  /**
  *
  * Log in a user
  *
  **/

  app.post('/api/login', (req, res, next) => {
    models.user.find({ email: req.body.email }, (err, doc) => {
      authenticateUser(err, doc, req, res)
    })
  })

  /**
  *
  * Make server-side session data available to client
  *
  **/

  app.get('/api/session', (req, res, next) => {
    return res.status(200).send({
      session: req.session
    });
  })

  /**
  *
  * Log a user out of their current session
  *
  **/

  app.get('/api/logout', (req, res, next) => {
    req.session.authenticated = false
    req.session.admin = false
    req.session.superadmin = false
    req.session.save((err) => {
      if (err) {
        return res.status(500).send({
          message: messages.logoutFail
        });
      } else {
        return res.status(200).send({
          message: messages.logoutSuccess
        });
      }
    })
  })

  /**
  *
  * Allow users to reset their password via an email
  *
  **/

  app.post('/api/forgotPassword', (req, res, next) => {
    models.user.find({ email: req.body.email }, (err, doc) => {
      requestPasswordReset(err, doc, req, res)
    })
  })

  /**
  *
  * Send an email to users so they can reset their password
  *
  * @args:
  *   err: an error object from a mongoose query for a user
  *   doc: the result of a mongoose query for a user
  *   req: a request object from express
  *   res: a response object from express
  *
  **/

  var requestPasswordReset = (err, doc, req, res) => {
    if (err) {
      return res.status(500).send({
        message: messages.error
      });
    }

    var user = doc[0];

    if (!user) {
      return res.status(200).send({
        message: messages.loginFail
      });
    }

    user.token = getToken();
    user.validated = false;

    // email the user a new validation token
    mailer.send(user.email, user.token, '&resetPassword=true')

    var query = {
      email: user.email
    }

    models.user.findOneAndUpdate(query, user, { upsert: true }, (err, doc) => {
      if (err) return res.status(500).send({ cause: err })
      return res.status(200).send({
        message: messages.checkEmail
      });
    })
  }

  /**
  *
  * Save a new password for the user
  *
  **/

  app.post('/api/resetPassword', (req, res, next) => {
    models.user.find({ email: req.body.email }, (err, doc) => {
      resetPassword(err, doc, req, res)
    })
  })

  var resetPassword = (err, doc, req, res) => {
    if (err) {
      return res.status(500).send({
        message: messages.error
      })
    }

    var user = doc[0];

    if (!user) {
      return res.status(403).send({
        message: messages.loginFail
      })
    }

    // authenticate the user in the session store
    loginSessionData(user, req);

    user.password = req.body.password;

    bcrypt.genSalt(saltWorkFactor, (err, salt) => {
      if (err) return next(err);

      // hash the password and the new salt
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) return next(err);

        // store the salted password, not the cleartext password
        user.password = hash;
        user.validated = true;

        var query = {
          email: user.email,
          token: user.token
        };

        models.user.findOneAndUpdate(query, user, { upsert: true }, (err, doc) => {
          if (err) return res.status(500).send({ cause: err })
          return res.status(200).send({
            message: messages.passwordUpdated
          });
        })
      })
    })
  }

  /**
  * Middleware that only allows authenticated users to access /admin;
  * NB: This middleware is only loaded in production environments
  **/

  if (process.env['NHBA_ENVIRONMENT'] === 'production') {
    app.use((req, res, next) => {
      if (req.url.includes('/admin')) {
        req.session && req.session.authenticated && req.session.admin ?
          next()
          : res.redirect('/?authenticated=false')
      } else {
        next()
      }
    })
  }

}
