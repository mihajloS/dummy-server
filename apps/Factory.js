const {Authenticate} = require('./authenticate/login');

// Authentication module
const auth = new Authenticate();


// Export modules
module.exports = {auth};
