module.exports = spotifyRouter

function spotifyRouter (opts) {
  var express   = require('express')
    , router    = express.Router()
    , spotifyWrapper = require('../lib/spotifywrapper')()
/**
* this route execute the function to retrieve historic of listned music
**/
  router.get('/gethistoric', function (req, res) {
    spotifyWrapper.getHistoric(function (err, data) {
      if (err) return res.status(500).json(err)
      else{
        return res.json(data)
      }
    })
  })
  /**
  * this route is used to get access token
  **/
  router.get('/spotify/login', function (req, res) {

    spotifyWrapper.login(req, res, function (err, data) {
      if (err) return res.status(404).json(err)
      else {
        return res.redirect(data)
      }
    })
  })

  router.get('/callback', function (req, res) {

    spotifyWrapper.requestAuth(req, res, function (err , data) {
      if (err) return res.status(500).json(err)
      else {
        // returns {acess_token : ...}
        res.json(data)
      }
    })

  })
  return router
}
