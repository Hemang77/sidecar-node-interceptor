global.mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const dbUrl = require('../config/keys');
mongoose.connect(dbUrl.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Database is connected');
}, err => {
    console.log('Can not cannect to the database', err);
});

mongoose.connection.on('connected', async () => {
    console.log('MongoDB Connected');
});
mongoose.connection.on('error', (err) => {
    console.log('Mongodb connection failed. ' + err);
    mongoose.disconnect();
});

mongoose.connection.once('open', () => {
    console.log('MongoDB connection opened!');
});

mongoose.connection.on('reconnected', () => {
    console.log('MongoDB reconnected!');
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected!');
    mongoose.connect(dbUrl.MONGODB_URI);
});

module.exports = mongoose;