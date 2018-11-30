const express = require('express')
const app = express()
const Videos = require('../controller/videos_controller')

app.get('/get', function(req, res) {
  Videos.getVideos(req, res)
})

module.exports = app