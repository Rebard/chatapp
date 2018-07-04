const Sequelize = require('sequelize');
const db = require('../../database');

const Channel = db.define('channels', {
    id:{
          type:Sequelize.STRING,
          primaryKey:true
      },
      title: Sequelize.STRING,
      lastMessage: Sequelize.STRING
});


module.exports = Channel;



// module.exports = (sequelize, Sequelize) => {
//     const Channel = sequelize.define('channels', {
//          id:{
//               type:Sequelize.STRING,
//               primaryKey:true
//           },
//           title: Sequelize.STRING,
//           lastMessage: Sequelize.STRING
//     });
//     return Channel;
// };
//
