require('dotenv').config()
var Flickr = require('flickr-sdk')
var flickr = new Flickr(process.env.FLICKR_API_KEY)

var express = require('express')
var app = express()

app.use(function(req, res, next) {
  let ranOnce = false

  if (ranOnce === false) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept',
    )
    ranOnce = true
    next()
  }
})

app.get('/fetch', function(req, res) {
  ;(() =>
    flickr.photos
      .getRecent({ per_page: 10 })
      .then(result => {
        res.send(JSON.stringify(result.body.photos.photo))
      })
      .catch(err => {
        console.error('Error: ', err)
      }))()
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
