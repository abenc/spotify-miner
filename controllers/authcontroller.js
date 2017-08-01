module.exports = authRouter

function authRouter (opts) {
  var express = require('express')
    , router  = express.Router()
    , authWrapper = require('../lib/authwrapper')()
    , passport      = opts.passport

  /**
  * THESE ROUTES ARE USED FOR THE  LOCAL LOGIN STRATEGY
  **/
  router.get('/', authWrapper.allowAuth, function (req, res) {
    res.render('authviews/index.ejs')
  })

  router.get('/login', authWrapper.allowAuth, function (req, res) {
    res.render('authviews/login.ejs', { message: req.flash('loginMessage') })
  })
  router.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile',
    failureRedirect : '/login',
    failureFlash : true
  }))

  router.get('/signup', authWrapper.allowAuth, function (req, res) {
    res.render('authviews/signup.ejs',{ message : req.flash('signupMessage') })
  })
  router.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile',
        failureRedirect : '/signup',
        failureFlash : true
  }))

  router.get('/profile', authWrapper.isLoggedIn, function (req, res) {
    res.render('authviews/profile.ejs', {
      user: req.user
    })
  })

  router.get('/logout', function (req, res) {
    req.logout()
    res.redirect('/')
  })

  /**
  * THESES ROUTES ARE USED FOR SPOTIFY LOGIN STRATEGY
  **/

  router.get('/auth/spotify', passport.authenticate('spotify',{ scope : ['user-read-email','user-read-private'] } ))

  router.get('/auth/spotify/callback', passport.authenticate('spotify',{
      successRedirect : '/profile',
      failureRedirect : '/'
    })
  )
  return router
}
