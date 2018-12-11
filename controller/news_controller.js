exports.getNews = function(req, res) {
  const page = req.query.page ? parseInt(req.query.page) - 1 : 0
  const limit = req.query.limit ? parseInt(req.query.limit) : 10
  let sql = 'Select a.id, a.title, a.source_name, a.create_time from news a '
  if (req.query.type && req.query.type != '') {
    sql += 'where a.' + req.query.type + '=1 '
  }
  sql += 'order by a.create_time desc, a.id desc '
  sql += 'limit ' + page * limit + ',' + limit
  req.getConnection(function(error, conn) {
    conn.query(sql, function(err, result) {
      if (err) {
        console.log(err)
        res.jsonp({code: -1, msg: '查询新闻信息失败'})
      } else {
        res.jsonp({code: 0, msg: '查询新闻信息成功', data: result})
      }
    })
  })
}

exports.getNewsDetail = function(req, res) {

  req.assert('id', '新闻id缺少').notEmpty()

  const errors = req.validationErrors()
  if( !errors ) { 
    let sql = 'select * from news where id=' + req.query.id
    req.getConnection(function(error, conn) {
      conn.query(sql, function(err, result) {
        if (err) {
          console.log(err)
          res.jsonp({code: -1, msg: '查询新闻信息失败'})
        } else {
          // console.log(result)
          if(result.length > 0) {
            res.jsonp({code: 0, msg: '查询新闻信息成功', data: result[0]})
          } else {
            res.jsonp({code: 0, msg: '暂无数据'})
          }
        }
      })
    })
  } else {
    res.jsonp({code: -1, msg: '传入参数错误'})
  }
}