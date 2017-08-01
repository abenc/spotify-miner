var express       = require('express')
  , request       = require('request')
  , passport      = require('passport')
module.exports = auth

function auth (opts) {

  if (!(this instanceof auth)) {
    return new auth(opts || {})
  }

  this.isLoggedIn = function (req, res, next) {

    if (req.isAuthenticated()) {
      return next()
    }

    res.redirect('/')
  }

  this.allowAuth = function (req, res, next){

    if (!req.isAuthenticated()) {
      return next()
    }

    res.redirect('/profile')
  }
  
}
