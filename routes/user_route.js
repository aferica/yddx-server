const express = require('express')
const app = express()
const User = require('../controller/user_controller')

app.post('/register', function(req, res) {
  User.register(req, res)
})

app.get('/get/report/:id', function(req, res) {
  User.userReport(req, res)
})

app.post('/login', function(req, res) {
  User.userLogin(req, res)
})


module.exports = app