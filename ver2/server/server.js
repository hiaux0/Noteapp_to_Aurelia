const bodyParser = require('body-parser'),
      mongoose   = require('mongoose'),
      express    = require('express')
      
const app = express()

//////////////////////////////////
//
//      Mongo SETUP / mongoose
// 

mongoose.promise = global.Promise
mongoose.connect('mongodb://dbtest:dbtest@localhost:27017/dbtest')

//////////////////////////////////
//
//      Express SETUP
// 

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

//////////////////////////////////
//
//      Routes
// 

const routes = require('./api/routes/database_routes')
routes(app) // register the routes

const port = process.env.PORT || 3000
app.listen(port, function() {
  console.log('Server started on port ' + port)
})