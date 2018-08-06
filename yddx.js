let express = require('express')
let app = express()

let mysql = require('mysql')
let myConnection  = require('express-myconnection')
let config = require('./config/config')
let dbOptions = {
	host:	  config.database.host,
	user: 	  config.database.user,
	password: config.database.password,
	port: 	  config.database.port, 
	database: config.database.db
}

app.use(myConnection(mysql, dbOptions, 'pool'))


/**
 * Express Validator Middleware for Form Validation
 */ 
let expressValidator = require('express-validator')
app.use(expressValidator())


/**
 * body-parser module is used to read HTTP POST data
 * it's an express middleware that reads form's input 
 * and store it as javascript object
 */ 
let bodyParser = require('body-parser')
/**
 * bodyParser.urlencoded() parses the text as URL encoded data 
 * (which is how browsers tend to send form data from regular forms set to POST) 
 * and exposes the resulting object (containing the keys and values) on req.body.
 */ 
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true }));


/**
 * This module let us use HTTP verbs such as PUT or DELETE 
 * in places where they are not supported
 */ 
let methodOverride = require('method-override')

/**
 * using custom logic to override method
 * 
 * there are other ways of overriding as well
 * like using header & using query value
 */ 
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    let method = req.body._method
    delete req.body._method
    return method
  }
}))

/**
 * This module shows flash messages
 * generally used to show success or error messages
 * 
 * Flash messages are stored in session
 * So, we also have to install and use 
 * cookie-parser & session modules
 */ 
let flash = require('express-flash')
let cookieParser = require('cookie-parser');
let session = require('express-session');

app.use(cookieParser('keyboard cat'))
app.use(session({ 
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true,
	cookie: { maxAge: 60000 }
}))
app.use(flash())

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  next();
});


/**
 * import routes/index.js
 * import routes/users.js
 */ 
let index = require('./routes/index')
let users = require('./routes/user_route')
let wx = require('./routes/wx_oauth')
let cos = require('./routes/cos_route')


app.use('/api/test', index)
app.use('/api/user', users)
app.use('/api/wx', wx)
app.use('/api/cos', cos)

app.listen(config.server.port, function(){
	console.log('Server running at port ' + config.server.port + ': http://127.0.0.1:' + config.server.port )
})
