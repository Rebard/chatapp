const Sequelize = require('sequelize');
const db = require('../../database');
const User = require('./user');
const Channel = require('./channel');

const Message = db.define('messages', {
    id:{
        type:Sequelize.STRING,
        primaryKey:true
    },
    text: Sequelize.TEXT,
    created: Sequelize.DATE
});
User.hasMany(Message);
Message.belongsTo(User);
Channel.hasMany(Message);
Message.belongsTo(Channel);


module.exports = Message;