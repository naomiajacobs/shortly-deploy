var app = require('./server-config.js');

//use env variables
var port = process.env.PORT || 4568

app.listen(port);

console.log('Server now listening on port ' + port);
