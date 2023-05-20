
process.env.NODE_ENV = 'local';
console.log("process.env.ENV", process.env.NODE_ENV)
module.exports = require('./local.constant');
