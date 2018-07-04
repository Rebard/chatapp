const {OrderedMap} = require('immutable');
let connections = new OrderedMap();
const UserController = require('./app/controllers/UserController');
const ChannelController = require('./app/controllers/ChannelController');
const MessageController = require('./app/controllers/MessageController');
const messageController = new MessageController();
const userController = new UserController();
const channelController = new ChannelController();

module.exports = function(server) {
    const io = require('socket.io').listen(server);
    io.set('origins', 'localhost:*');
    io.sockets.on('connection', function (socket) {
        console.log('socket con success',socket.id);
        const clientConnection = {
            id:socket.id,
            socket:socket,
            userId:null,
            isAuth:false
        };
        connections = connections.set(socket.id, clientConnection);

        socket.on('message',function(msg){
            console.log("ClIENT Say",msg);
            doTheJob(socket.id, msg, io);
        });
        socket.emit('message',socket.id);
    });

};
function send(socket,msg, io){
    io.to(socket.id).emit('message',msg);
}
function sendMessageToChannel(room, obj, io){
   io.to(room).emit('message',obj);

}
function doTheJob(socketId,msg, io) {

    const action = msg.action;
    const payload = msg.payload;
    const userConnection = connections.get(socketId);

    switch(action){

        case 'getMessagesFromChannel':{
            const channelId = payload;
           // const messages = messageController.findByChannel(channelId);
            console.log(channelId);

        }
        case 'createMessage':{
            if(userConnection.isAuth){
                let messageObj = payload;
                messageObj.userId = userConnection.userId;
                messageController.create(messageObj).then(msg=> {
                    let payload = msg.message;
                    payload.userId = msg.user.id;
                    payload.channelId = msg.channel.id;
                    const obj = {
                        action:'messageAdded',
                        payload:payload
                    };
                    const room = msg.channel.id;
                    sendMessageToChannel(room,obj,io);
                }).catch(err => {
                    const obj = {
                        action: 'create message error',
                        payload: payload
                    };
                    const socket = userConnection.socket;
                    send(socket,obj,io);
                });

            }

            break;
        }
        case 'createChannel':{
            const channel = payload;
            //const connection = connections.get(socketId);
            channelController.create(channel).then((channelObj)=>{
                const obj = {
                    action:'channelAdded',
                    payload: channelObj
                };

                channelObj.members.forEach(user=>{
                    let connection = connections.filter(con=>{
                        return con.userId === user.id;
                    });
                    //console.log("CHANNEL ADED",connection);
                    connection.forEach(con=>{
                        con.socket.join(channelObj.channel.id);
                    })
                });
                const room = channelObj.channel.id;
                sendMessageToChannel(room,obj,io);

               // send(connection.socket, obj, io);
            });

            break;
        }
        case 'auth': {
            const userId = payload.id;
            const connection = connections.get(socketId);
            if (connection) {
                userController.load(userId).then(user => {
                    connection.isAuth = true;
                    connection.userId = user.id;
                    connections = connections.set(socketId, connection);
                    const obj = {
                        action: 'authSuccess',
                        payload: "Успех"
                    };
                    send(connection.socket, obj, io);
                }).catch(err => {
                    const obj = {
                        action: 'authError',
                        payload: 'Ошибка аутентификации'
                    };
                    send(connection.socket, obj, io);
                })
            }
            break;
        }
        default: break;
    }
}