const express = require('express')
const Cos = require('../controller/cos_controller')
const multer  = require('multer')
const upload = multer({ dest: '../tmp/' })

const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
const uploader = require('../util/uploader-node.js')('tmp');

const app = express()

app.post('/upload/userPhoto', upload.single('image'), function(req, res) {
  Cos.uploadUserPhoto(req, res)
})

app.get('/get/userPhoto', function(req, res) {
  Cos.getUserPhoto(req, res)
})

app.post('/upload/dangke', upload.array('file'), function(req, res) {
  Cos.uploadDangkeVideo(req, res)
})

app.post('/upload/big/upload', upload.single('file'), function (req, res) {
  Cos.bigUploadUpload(req, res)
})

app.post('/upload/big/init', function (req, res) {
  Cos.bigUploadInit(req, res)
})

app.post('/upload/big/part', upload.single('file'), function (req, res) {
  Cos.bigUploadPart(req, res)
})


module.exports = app