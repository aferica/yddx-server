var config = {
	database: {
    // host:	  'localhost', 	// database host
    host:	  '193.112.176.174', 	// database host
		user: 	  'root', 		// your database username
		password: 'HCKJ@admin', 		// your database password
		port: 	  3306, 		// default MySQL port
		db: 	  'yddx' 		// your database name
	},
	server: {
		host: '127.0.0.1',
		port: 4040
  },
  weixin: {
    appid: 'wx540cd05861c228f1', // 小程序 appid
    secret: 'ded42858e25de95465adbb8e0485bf81', // 小程序密钥
  },
  cos: {
    SecretId: 'AKIDvpZ7Uh59UvSvEMM6f7OTN4Zw88wXak6F',
    SecretKey: '63nbRXilfNyNoEYnxvgIm4AnJdlhS1Qg',
    Bucket: 'yidongdangxiao-1256926653',
    Region: 'ap-guangzhou'
  },
  redis: {
    // host:   'localhost',
    host:   '193.112.176.174',
    password: 'HCKJ@admin',
    port:     6379,
  }
}

module.exports = config
