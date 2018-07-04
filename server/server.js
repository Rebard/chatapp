let express = require('express'),
    bodyParser = require('body-parser'),
    http = require('http'),
    config = require('./app/config'),
    AppRouter = require('./app/routes'),
    db = require('./database');

const app = express();

const server = http.createServer(app);
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.routes = new AppRouter(app);

server.listen(config.port,function(){
    console.log("Сервер запущен на порту " + config.port);
});

db.sync({force:false}).then(()=>{

});
require('./socket')(server);


