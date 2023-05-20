global.express = require('express');

// internal imports
const constant = require('./config/keys');

// external imports
const compression = require('compression');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const port = process.env.PORT || constant.PORT || 4000; // setting port
const env = process.env.NODE_ENV || 'development'; //setting environment


// app.use(cors({
//     origin: constant.serverConfig.CORS.allowedHosts
// }));

// Enable compression
app.use(compression());

// Prevent opening page in frame or iframe to protect from clickjacking
app.use(helmet.frameguard());

app.use(bodyParser.json({ limit: '10mb' })); // to parse body in json
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true })); //  to support URL-encoded bodies and to remove deprecation warnings


// version 1
app.use('/api/v1/product', require('./v1/routes/products'));

//catch 404 and forward to error handler
app.use((req, res, next) => {
    console.log(req.url);
    let err = new Error('Not Found');
    err.status = 400;
    next(err);
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port} with ${env} environment`);
});
