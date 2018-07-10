const express = require('express')
const Cos = require('../controller/cos_controller')
const multer  = require('multer')
const upload = multer({ dest: '../tmp/' })
const app = express()

app.post('/upload/userPhoto', upload.single('image'), function(req, res) {
  Cos.uploadUserPhoto(req, res)
})

app.get('/get/userPhoto', function(req, res) {
  Cos.getUserPhoto(req, res)
})

module.exports = app