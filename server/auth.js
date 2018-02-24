// auth.js
const bcrypt = require('bcryptjs');
const models = require('../app/models/models');
const mailer = require('./mailer');
const _ = require('lodash');

// specify the encryption level
const saltWorkFactor = parseInt(process.env.NHBA_SALT_WORK_FACTOR, 10) || 10;

module.exports = function auth(app) {
  /**
   * Identify the messages delievered by the auth middleware to client
   * */

  const messages = {
    emailTaken: 'Sorry, the requested email address is already taken.',
    checkEmail: 'Success! Please check your email for further instructions.',
    loginSuccess: 'Success! You are now logged in.',
    loginFail:
      'An incorrect username or password was entered. Please try again.',
    logoutSuccess: 'Success! You are now logged out.',
    logoutFail: 'Sorry, we could not log out out. Please try again.',
    emailMissing:
      'Sorry, this email address does not have any account information.',
    passwordUpdated: 'Success! Your password has been updated.',
    error:
      'Sorry, we could not process your request. Please contact an administrator for help.'
  };

  /**
   * Create a new secure token for account validation
   * */

  const getToken = () => {
    const salt = bcrypt.genSaltSync(saltWorkFactor);
    return bcrypt.hashSync('B4c0//', salt);
  };

  /**
   * Create and email a token to a user's email for account verification
   *
   * @args:
   *   err: an error object from a mongoose query for a user
   *   doc: the result of a mongoose query for a user
   *   req: a request object from express
   *   res: a response object from express
   * */

  const initializeUserPassword = (err, doc, req, res, next) => {
    // if the requested email address is used, inform the client
    if (doc.length > 0) {
      return res.status(200).send({
        message: messages.emailTaken
      });
    }

    // else, create a new user with that email address
    const user = new models.user(req.body);

    bcrypt.genSalt(saltWorkFactor, (err2, salt) => {
      if (err2) return next(err2);

      // hash the password and the new salt
      bcrypt.hash(user.password, salt, (err3, hash) => {
        if (err3) return next(err3);

        // store the salted password, not the cleartext password
        user.password = hash;
        user.token = getToken();
        user.validated = false;
        user.admin = false;
        user.superadmin = false;

        // email the user a validation token
        mailer.send(user.email, user.token, null);

        user.save(err4 => {
          if (err4) {
            return res.status(500).send({ cause: err4 });
          }
          return res.status(200).send({
            message: messages.checkEmail
          });
        });
      });
    });
  };

  /**
   * Store the user's authentication status in the session data
   *
   * @args:
   *   {obj} user: the result of a query for the current user
   *   {obj} req: the current request object
   * */

  const loginSessionData = (user, req) => {
    req.session.authenticated = true;
    if (user.admin) req.session.admin = true;
    if (user.superadmin) req.session.superadmin = true;
    req.session.userId = user._id;

    req.session.save(err => {
      if (err) console.warn('could not save session', err);
    });
  };

  /**
   * Validate a user and update their status if they're included in
   * the admin environment variable
   *
   * @args:
   *   {user}: an instance of the User table
   *   {req}: the current Express request
   *   {res}: the current Express response
   * */

  const validateUser = (user, req, res) => {
    let adminEmails = process.env.NHBA_ADMIN_EMAILS;
    let superadminEmails = process.env.NHBA_SUPERADMIN_EMAILS;
    const userCopy = user;
    adminEmails = adminEmails ? adminEmails.split(' ') : [];
    superadminEmails = superadminEmails ? superadminEmails.split(' ') : [];

    if (_.includes(adminEmails, user.email)) {
      userCopy.admin = true;
    }

    if (_.includes(superadminEmails, user.email)) {
      userCopy.superadmin = true;
    }

    userCopy.validated = true;

    models.user.update(
      { _id: user._id },
      { $set: user },
      { overwrite: true },
      err => {
        if (err) console.warn(err);

        // update the user's session state
        loginSessionData(userCopy, req);

        // inform the user they're logged in
        return res.status(200).send({
          message: messages.loginSuccess
        });
      }
    );
  };

  /**
   * High level authentication check wrapper
   *
   * @args:
   *   err: an error object from a mongoose query for a user
   *   doc: the result of a mongoose query for a user
   *   req: a request object from express
   *   res: a response object from express
   * */

  const authenticateUser = (err, doc, req, res) => {
    if (err)
      return res.status(500).send({
        message: messages.error
      });

    if (doc.length === 0) {
      return res.status(403).send({
        message: messages.loginFail
      });
    }

    const user = doc[0];

    bcrypt.compare(req.body.password, user.password, (err2, isMatch) => {
      if (err2)
        return res.status(500).send({
          message: messages.error
        });

      // validate the user, update their credentials, and log them in
      if (isMatch) {
        validateUser(user, req, res);
      } else {
        return res.status(403).send({
          message: messages.loginFail
        });
      }
    });
  };

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
   * */

  const requestPasswordReset = (err, doc, req, res) => {
    if (err) {
      return res.status(500).send({
        message: messages.error
      });
    }

    const user = doc[0];

    if (!user) {
      return res.status(200).send({
        message: messages.loginFail
      });
    }

    user.token = getToken();
    user.validated = false;

    // email the user a new validation token
    mailer.send(user.email, user.token, '&resetPassword=true');

    const query = {
      email: user.email
    };

    models.user.findOneAndUpdate(query, user, { upsert: true }, err2 => {
      if (err2) return res.status(500).send({ cause: err2 });
      return res.status(200).send({
        message: messages.checkEmail
      });
    });
  };

  const resetPassword = (err, doc, req, res, next) => {
    if (err) {
      return res.status(500).send({
        message: messages.error
      });
    }

    const user = doc[0];

    if (!user) {
      return res.status(403).send({
        message: messages.loginFail
      });
    }

    // authenticate the user in the session store
    loginSessionData(user, req);

    user.password = req.body.password;

    bcrypt.genSalt(saltWorkFactor, (err2, salt) => {
      if (err2) return next(err2);

      // hash the password and the new salt
      bcrypt.hash(user.password, salt, (err3, hash) => {
        if (err3) return next(err3);

        // store the salted password, not the cleartext password
        user.password = hash;
        user.validated = true;

        const query = {
          email: user.email,
          token: user.token
        };

        models.user.findOneAndUpdate(query, user, { upsert: true }, err4 => {
          if (err4) return res.status(500).send({ cause: err4 });
          return res.status(200).send({
            message: messages.passwordUpdated
          });
        });
      });
    });
  };

  /**
   * Register new users
   * */

  // request made by client when attempting to add a user to the db
  app.post('/api/register', (req, res, next) => {
    models.user.find({ email: req.body.email }, (err, doc) => {
      initializeUserPassword(err, doc, req, res, next);
    });
  });

  /**
   * Validate the account token emailed to user
   * */

  app.post('/api/validate', (req, res) => {
    const query = {
      email: req.body.email,
      token: req.body.token
    };

    // find and validate the user
    models.user.find(query, (err, doc) => {
      authenticateUser(err, doc, req, res);
    });
  });

  /**
   *
   * Log in a user
   *
   * */

  app.post('/api/login', (req, res) => {
    models.user.find({ email: req.body.email }, (err, doc) => {
      authenticateUser(err, doc, req, res);
    });
  });

  /**
   *
   * Make server-side session data available to client
   *
   * */

  app.get('/api/session', (req, res) =>
    res.status(200).send({
      session: req.session
    })
  );

  /**
   *
   * Log a user out of their current session
   *
   * */

  app.get('/api/logout', (req, res) => {
    req.session.authenticated = false;
    req.session.admin = false;
    req.session.superadmin = false;
    req.session.save(err => {
      if (err) {
        return res.status(500).send({
          message: messages.logoutFail
        });
      }
      return res.status(200).send({
        message: messages.logoutSuccess
      });
    });
  });

  /**
   *
   * Allow users to reset their password via an email
   *
   * */

  app.post('/api/forgotPassword', (req, res) => {
    models.user.find({ email: req.body.email }, (err, doc) => {
      requestPasswordReset(err, doc, req, res);
    });
  });

  /**
   *
   * Save a new password for the user
   *
   * */

  app.post('/api/resetPassword', (req, res, next) => {
    models.user.find({ email: req.body.email }, (err, doc) => {
      resetPassword(err, doc, req, res, next);
    });
  });

  /**
   * Middleware that only allows authenticated users to access /admin;
   * NB: This middleware is only loaded in production environments
   * */

  if (process.env.NHBA_ENVIRONMENT === 'production') {
    app.use((req, res, next) => {
      if (req.url.includes('/admin')) {
        if (req.session && req.session.authenticated) {
          next();
        } else {
          res.redirect('/?authenticated=false');
        }
      } else {
        next();
      }
    });
  }
};
