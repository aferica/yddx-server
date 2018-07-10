const express = require('express')
const app = express()
const rp = require('request-promise');
const config = require('../config/config');
const md5 = require('js-md5');

app.get('/check/:code', function(req, res) {
  let code = req.params.code
  if(code == null || code == '') {
    res.jsonp({ code: -1, msg: 'code不能为空'})
  }

  // 获取openid
  const options = {
    method: 'GET',
    url: 'https://api.weixin.qq.com/sns/jscode2session',
    qs: {
      grant_type: 'authorization_code',
      js_code: code,
      secret: config.weixin.secret,
      appid: config.weixin.appid
    }
  };

  rp(options).then(function(sessionData) {
    sessionData = JSON.parse(sessionData);
    console.log(sessionData)
    if (!sessionData.openid) {
      res.jsonp({ code: -1, msg: '登录失败'})
    }
    req.getConnection(function(error, conn) {
      conn.query(
        "SELECT u.user_id, u.user_name, u.sex, u.learn_time, u.join_year, b.branch_name, b.branch_id, u.photo_filename " +
        "FROM " +
        "user u " +
        "LEFT JOIN branch b ON u.belong_branch_id = b.branch_id " +
        "WHERE u.open_id = '" + md5(sessionData.openid) + "'", 
        function(err, result) {
        if(err) {
          console.log(err)
          res.jsonp({ code: -1, msg: '发生错误'})
        }
        else { 
          // console.log(result)
          if(result.length == 0) {
            res.jsonp({ code: 101, msg: '尚未注册', data: md5(sessionData.openid)})
          } else {
            res.jsonp({ code: 0, msg: '查询成功', data: result[0]})
          }
        }			 
      })
    })
  })
  
	 
})

module.exports = app;