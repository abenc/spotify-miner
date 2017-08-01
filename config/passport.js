const LocalStrategy = require('passport-local').Strategy
const SpotifyStrategy = require('passport-spotify').Strategy;
var User = require('../models/user')

module.exports = function (passport) {

  //serialize the user for the session
  passport.serializeUser(function (user, done) {
    done(null,user.id)
  })

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err,user)
    })
  })

  passport.use('local-signup',
  new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  },
  function (req, email, password, done) {
    process.nextTick(function () {
      User.findOne({ 'local.email': email}, function (err, user) {
        if (err)
          return done(err)
        if (user) {
          return done(null,false,req.flash('signupMessage', 'That email is already taken'))
        } else {
          var newUser = new User()
          newUser.local.email = email
          newUser.local.password = newUser.generateHash(password)
          newUser.save(function (err) {
            if (err)
              throw err
            return done(null, newUser)
          })
        }
      })
    })
  }))

  passport.use('local-login',
  new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  },
  function (req, email, password, done){
    User.findOne( { 'local.email' : email }, function (err, user) {
      if (err)
        return done(err)
      if (!user)
        return done(null, false, req.flash('loginMessage', 'No user found'))
      if (!user.validPassword(password))
        return done(null, false, req.flash('loginMessage', 'Wrong password'))
      return done(null, user)
    })
  }))

  passport.use('spotify', new SpotifyStrategy({
    clientID : '29decb3b6ab84a8aa3c6964a9988f752',
    clientSecret : 'a12ca2ab253949318aaf8385add5aa2d',
    callbackURL: 'http://localhost:8888/auth/spotify/callback',
    passReqToCallback : true
  },
  function (req, accessToken, refreshToken, profile, done) {
    process.nextTick(function () {

      if (!req.user) {
        User.findOne({ 'spotify.id' : profile.id }, function (err, user) {
          if (err)
            return done(err)
          if (user) {
            return done(null, user)
          } else {
            var newUser = new User()
            newUser.spotify.id = profile.id
            newUser.spotify.acessToken = accessToken
            newUser.spotify.refreshToken = refreshToken
            newUser.spotify.images = profile.images
            newUser.spotify.display_name = profile.display_name
            newUser.save(function (err) {
              if (err)
                throw err
              return done(null, newUser)
            })
          }
        })
      } else {
        console.log(profile)
        var user = req.user

        user.spotify.id           = profile.id
        user.spotify.accessToken  = accessToken
        user.spotify.refreshToken = refreshToken
        user.spotify.displayName  = profile.displayName
        user.spotify.photos       = profile.photos
        user.spotify.profileUrl   = profile.profileUrl
        user.spotify.href         = profile.href

        user.save(function (err) {
          if (err)
            throw err
          return done(null, user)
        })
      }
    })
  }))
}
