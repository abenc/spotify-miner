var express           = require('express')
  , bodyParser        = require('body-parser')
  , mongoose          = require('mongoose')
  , cookieParser      = require('cookie-parser')
  , app               = express()
  , passport          = require('../config/passport')
  , flash             = require('connect-flash')
  , morgan            = require('morgan')
  , session           = require('express-session')
  , configDB          = require('../config/database.js')
  , passport          = require('passport')
  //, passport          = require('../config/passport.js')(require('passport'))

//add app.use mongo session pal

function start (opts) {

  mongoose.connect(configDB.url)
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(cookieParser())
  app.engine('html', require('ejs').renderFile)
  app.use(morgan('dev'))

  app.use(session({
    secret:'ilovespotify'
  }))
  app.use(passport.initialize())
  app.use(passport.session())
  require('../config/passport.js')(passport)

  app.use(flash())

  //getting controllers into app
  app.use(require('../controllers/spotifycontroller')(opts))
  app.use(require('../controllers/authcontroller')({passport: passport}))

  //server listening port
  app.listen(8888, function (opts){
    console.log('App listening on port 8888')
  })
}
start()

/*app.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: 'shhhh, very secret'
}))*/
//app.set('views', path.join(__dirname, '../views')) // specify the views directory
