const Sequelize = require('sequelize');
const db = require('../../database');
const Channel = require('./channel');

const User = db.define('users', {
    id:{
        type:Sequelize.STRING,
        primaryKey:true
    },
    name: Sequelize.STRING,
    email: Sequelize.STRING,
    password: Sequelize.STRING
});

User.belongsToMany(Channel, {
    as:'Channels',
    through: 'userChannels',
    foreignKey: 'userId',
    otherKey:'channelId'
});
Channel.belongsToMany(User, {
    as:'Users',
    through: 'userChannels',
    foreignKey: 'channelId',
    otherKey: 'userId'
});

module.exports = User;



// module.exports = (sequelize, Sequelize) => {
//     const User = sequelize.define('users', {
//         id:{
//             type:Sequelize.STRING,
//             primaryKey:true
//         },
//         name: Sequelize.STRING,
//         email: Sequelize.STRING,
//         password: Sequelize.STRING
//     });
//
//     return User;
// };

