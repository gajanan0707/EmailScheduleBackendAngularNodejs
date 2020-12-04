//-------------import packages------------------------------------------
let express = require('express'),
    mongoose = require('mongoose'),
    cors = require('cors'),
    bodyParser = require('body-parser'),


    //-------------database path---------------------------------------------
    dbConfig = require('./database/db');

//-------------import the email service  & email snpooze-----------------------------------
const emailService = require('./service/email-service');
const emailsnoozeService = require('./service/emailsnooze');


//--------------Watch Changes database--------------------------
const socket_io = require('socket.io');
var io = socket_io();
const User = require('./models/shedulemodel');
const changeStream = User.watch();

changeStream.on('change', (change) => {
    io.emit('changeData', change, emailService.sendMail());
});
io.on('connection', function () {
    console.log('connected');
});
var socket = io;
module.exports = socket;

//-------------Watch for any updates----------------------------------------
const MongoClient = require("mongodb").MongoClient;
const uri = "mongodb+srv://AngularCrud:AngularCrud@cluster0.nknho.mongodb.net/AngularCrud??authSource=admin?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
client.connect().then(db => {
    const changeStream = client.db("AngularCrud").collection("snoozeEmail").watch();
    changeStream.on("change", next => {});
})

//-------------Connecting with mongo db-----------------------------------
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => {
    console.log('Database sucessfully connected')
}).catch((error) => {
    console.log('Database could not connected: ' + error)
})

//-------------For First Time Email send------------------------
emailService.sendMail()

//-------------After First Email Send Snooze---------------------------
emailsnoozeService.sendMailsnooze()

//----------------User route for login signup---------------------------------
const userRoutes = require('./routes/userroute')

//----------------use the packages--------------------------------------------
const app = express();
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,PUT,PATCH,DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
    res.setHeader('Access-Control-Allow-Credentials', 'false')
    next()
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cors());
app.use("/public",express.static('public'));
// simple route
app.get('/', function (req, res) {
    res.sendFile( __dirname + "/" + "index.html" );
})
//--------------api for authentication Email Crud-----------------------------------------------
app.use('/user', userRoutes)

//--------------Create port----------------------------------------------------------
const port = process.env.PORT || 4001;
const server = app.listen(port, () => {
    console.log('Connected to port ' + port)
})
var io = require('socket.io').listen(server);


//-------------Find 404 and hand over to error handler-------------------------------
app.use((req, res, next) => {
    next(createError(404));
});

//-------------error handler----------------------------------------------------------
app.use(function (err, req, res, next) {
    console.error(err.message); // Log error message in our server's console
    if (!err.statusCode) err.statusCode = 500; // If err has no specified error code, set error code to 'Internal Server Error (500)'
    res.status(err.statusCode).send(err.message); // All HTTP requests must have a response, so let's send back an error with its status code and message
});