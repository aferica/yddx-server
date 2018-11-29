const express = require('express')
const app = express()
const News = require('../controller/news_controller')

app.get('/get', function(req, res) {
  News.getNews(req, res)
})

module.exports = app