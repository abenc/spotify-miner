var express       = require('express')
  , request       = require('request')
  , querystring   = require('querystring')

module.exports = spotify

function spotify (opts) {

  const urlAccount = 'https://accounts.spotify.com/'
  const urlApi     = 'https://api.spotify.com/'
  const client_id = '29decb3b6ab84a8aa3c6964a9988f752' // Your client id
  const client_secret = 'a12ca2ab253949318aaf8385add5aa2d' // Your secret
  const redirect_uri = 'http://localhost:8888/callback' // Your redirect uri
  const stateKey = 'spotify_auth_state'

  if(!(this instanceof spotify)) {
    return new spotify(opts || {})
  }

  var generateRandomString = function(length) {
    var text = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
  }

  this.getHistoric = function (callback) {
    callback(null,{'sucess' : 'yop'})
  }

  this.login = function (req, res, callback) {

    var state = generateRandomString(16)
    res.cookie('stateKey', state)
    var scope = 'user-read-private user-read-email user-read-recently-played';
    //app requests auth
    callback(null, (urlAccount + 'authorize?' +
    querystring.stringify({
      response_type:'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    })))
  }

  this.requestAuth = function (req, res, callback) {
    //after auth request, the app will request access and refresh tokens
    var code = req.query.code || null;
    var state = req.query.state || null;
    var storedState = req.cookies ? req.cookies.stateKey : null;

    if (state === null || state !== storedState) {
      callback({err: 'state_mismatch'})
    } else {
      var authOptions = {
            url: urlAccount + 'api/token',
            form: {
              code: code,
              redirect_uri: redirect_uri,
              grant_type: 'authorization_code'
            },
            headers: {
              'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
      }
      request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
          var access_token = body.access_token
            , refresh_token = body.refresh_token

          var options = {
            url: urlApi + 'v1/me',
            headers: { 'Authorization': 'Bearer ' + access_token },
            json: true
          }
        // use the access token to access the Spotify Web API
          request.get(options, function(error, response, body) {
            console.log(body);
          })
          // {..}
          callback(null, {
            access_token: access_token,
            refresh_token: refresh_token
            })
        } else {
          callback({err: 'invalid_token'})
        }
      })
    }
  }

  this.getRecentlyPlayed = function (req, res, callback) {

    var options = {
      url: urlApi + 'v1/me/player/recently-played',
      headers: { 'Authorization': 'Bearer ' + access_token },
      json: true
    }
    request.get(options, function (error, response, body) {
      if (error) callback({err: error})
      else {
        callback(null,body)
      }
    })
  }
}
