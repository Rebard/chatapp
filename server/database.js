const mysql = require('mysql'),
      Sequelize = require('sequelize'),
      config = require('./app/config').db.mysql["development"];

const sequelize = new Sequelize(config["database"], config["username"], config["password"], {
    host: config["host"],
    dialect: 'mysql',
    operatorsAliases: false,
});
// const User = require('./app/models/user')(sequelize,Sequelize);
// const Channel = require('./app/models/channel')(sequelize,Sequelize);

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });
module.exports = sequelize;
