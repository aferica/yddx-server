exports.getVideos = function(req, res) {
  const page = req.query.page ? parseInt(req.query.page) - 1 : 0
  const limit = req.query.limit ? parseInt(req.query.limit) : 10
  let sql = 'Select * from videos a '
  if (req.query.type && req.query.type != '') {
    sql += "where a.type='" + req.query.type + "' "
  }
  sql += 'limit ' + page * limit + ',' + limit
  req.getConnection(function(error, conn) {
    conn.query(sql, function(err, result) {
      if (err) {
        console.log(err)
        res.jsonp({code: -1, msg: '查询视频信息失败'})
      } else {
        res.jsonp({code: 0, msg: '查询视频信息成功', data: result})
      }
    })
  })
}