const bodyParser = require('body-parser'),
      mongoose   = require('mongoose'),
      express    = require('express'),
      cors       = require('cors')
      
const app = express()

//////////////////////////////////
//
//      Mongo SETUP / mongoose
// 

mongoose.promise = global.Promise
mongoose.connect('mongodb://note_app:note_app@localhost:27017/note_app')

//////////////////////////////////
//
//      Express SETUP
// 

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cors())

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
