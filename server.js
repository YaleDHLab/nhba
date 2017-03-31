// server.js
var express = require('express')
var request = require('superagent')
var methodOverride = require('method-override')
var cookieParser = require('cookie-parser')
var compression = require('compression')
var bodyParser = require('body-parser')
var session = require('express-session')
var morgan = require('morgan')
var path = require('path')
var favicon = require('serve-favicon')
var mailer = require('./mailer')
var config = require('./config')
var routes = require('./routes')
var models = require('./app/models/models')

/***
*
* Configure Express production server
*
***/

// initialize the server
var app = express()

// send compressed assets
app.use(compression())

// provide a session secret
app.use(session({
  secret: process.env['NHBA_SECRET'] || 'ut-oh',
  name: 'react-boilerplate',
  proxy: true,
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 3600000 * 24 } // 24 hours
}))

// serve files from the build directory
app.use(express.static(path.join(__dirname, 'build')))

// enable the cookie parser
app.use(cookieParser())

// enable the body parser
app.use(bodyParser.urlencoded({ extended: true }))

// enable json body parsing
app.use(bodyParser.json())

// enable method overrides
app.use(methodOverride())

// specify favicon
app.use(favicon(__dirname + '/build/favicon.ico'));

// enable logging
morgan('combined', {
  skip: (req, res, next) => { return res.statusCode < 400 }
})

// send CORS headers to enable dev work on 8081
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

/***
*
* Auth
*
***/

var bcrypt = require('bcryptjs')
var saltWorkFactor = parseInt(process.env['NHBA_SALT_WORK_FACTOR']) || 10

/***
*
* Identify the messages delievered by the auth middleware to client
*
***/

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
}

/***
*
* Regist new users
*
***/

// request made by client when attempting to add a user to the db
app.post('/api/register', (req, res, next) => {
  models.user.find({email: req.body.email}, (err, doc) => {
    initializeUserPassword(err, doc, req, res)
  })
})

/***
*
* Create and email a token to a user's email for account verification
*
* @args:
*   err: an error object from a mongoose query for a user
*   doc: the result of a mongoose query for a user
*   req: a request object from express
*   res: a response object from express
*
***/

var initializeUserPassword = (err, doc, req, res) => {
  // if the requested email address is used, inform the client
  if (doc.length > 0) {
    return res.status(200).send({
      message: messages.emailTaken
    })
  }

  // else, create a new user with that email address
  var user = new models.user(req.body)

  bcrypt.genSalt(saltWorkFactor, (err, salt) => {
    if (err) return next(err)

    // hash the password and the new salt
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err)

      // store the salted password, not the cleartext password
      user.password = hash
      user.token = getToken()
      user.validated = false

      // email the user a validation token
      mailer.send(user.email, user.token, null)

      user.save((err, doc) => {
        if (err) return res.status(500).send({cause: err})
        return res.status(200).send({
          message: messages.checkEmail
        })
      })
    })
  })
}

/***
*
* Validate the account token emailed to user
*
***/

app.post('/api/validate', (req, res, next) => {
  var query = {
    email: req.body.email,
    token: req.body.token,
  }

  models.user.find(query, (err, doc) => {
    authenticateUser(err, doc, req, res)
  })
})

/***
*
* Create a new secure token for account validation
*
***/

var getToken = () => {
  var salt = bcrypt.genSaltSync(saltWorkFactor)
  return bcrypt.hashSync("B4c0/\/", salt)
}

/***
*
* High level authentication check wrapper
*
* @args:
*   err: an error object from a mongoose query for a user
*   doc: the result of a mongoose query for a user
*   req: a request object from express
*   res: a response object from express
*
***/

var authenticateUser = (err, doc, req, res) => {
  if (err || doc.length == 0) {
    return res.status(200).send({
      message: messages.error
    })
  }

  var user = doc[0]

  bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
    if (err) {
      return res.status(200).send({
        message: messages.error
      })
    }

    // save the user's auth status to the session data
    if (isMatch) {
      req.session.authenticated = true;
      req.session.save((err) => {
        if (err) console.warn('could not save session', err)
      })

      return res.status(200).send({
        message: messages.loginSuccess
      })
    }

    return res.status(200).send({
      message: messages.loginFail
    })
  })
}

/***
*
* Log in a user
*
***/

app.post('/api/login', (req, res, next) => {
  models.user.find({email: req.body.email}, (err, doc) => {
    authenticateUser(err, doc, req, res)
  })
})

/***
*
* Make server-side session data available to client
*
***/

app.get('/api/session', (req, res, next) => {
  return res.status(200).send({
    session: req.session
  })
})

/***
*
* Log a user out of their current session
*
***/

app.get('/api/logout', (req, res, next) => {
  req.session.authenticated = false
  req.session.save((err) => {
    if (err) {
      return res.status(200).send({
        message: messages.logoutFail
      })
    } else {
      return res.status(200).send({
        message: messages.logoutSuccess
      })
    }
  })
})

/***
*
* Allow users to reset their password via an email
*
***/

app.post('/api/forgotPassword', (req, res, next) => {
  models.user.find({email: req.body.email}, (err, doc) => {
    requestPasswordReset(err, doc, req, res)
  })
})

/***
*
* Send an email to users so they can reset their password
*
* @args:
*   err: an error object from a mongoose query for a user
*   doc: the result of a mongoose query for a user
*   req: a request object from express
*   res: a response object from express
*
***/

var requestPasswordReset = (err, doc, req, res) => {
  if (err) {
    return res.status(200).send({
      message: messages.error
    })
  }

  var user = doc[0]

  if (!user) {
    return res.status(200).send({
      message: messages.loginFail
    })
  }

  user.token = getToken()
  user.validated = false

  // email the user a new validation token
  mailer.send(user.email, user.token, '&resetPassword=true')

  var query = {
    email: user.email
  }

  models.user.findOneAndUpdate(query, user, {upsert: true}, (err, doc) => {
    if (err) return res.status(500).send({cause: err})
    return res.status(200).send({
      message: messages.checkEmail
    })
  })
}

/***
*
* Save a new password for the user
*
***/

app.post('/api/resetPassword', (req, res, next) => {
  models.user.find({email: req.body.email}, (err, doc) => {
    resetPassword(err, doc, req, res)
  })
})

var resetPassword = (err, doc, req, res) => {
  if (err) {
    return res.status(200).send({
      message: messages.error
    })
  }

  var user = doc[0]

  if (!user) {
    return res.status(200).send({
      message: messages.loginFail
    })
  }

  // authenticate the user in the session store
  req.session.authenticated = true;
  req.session.save((err) => {
    if (err) console.warn('could not save session', err)
  })

  user.password = req.body.password

  bcrypt.genSalt(saltWorkFactor, (err, salt) => {
    if (err) return next(err)

    // hash the password and the new salt
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err)

      // store the salted password, not the cleartext password
      user.password = hash
      user.validated = true

      var query = {
        email: user.email,
        token: user.token
      }

      models.user.findOneAndUpdate(query, user, {upsert: true}, (err, doc) => {
        if (err) return res.status(500).send({cause: err})
        return res.status(200).send({
          message: messages.passwordUpdated
        })
      })
    })
  })
}

/***
*
* Routes
*
***/

// add routes
routes(app)

// ask server to listen on desired port
const PORT = process.env.PORT || config.api.port
app.listen(PORT, () => {
  console.log('Production Express server running at localhost:' + PORT)
})