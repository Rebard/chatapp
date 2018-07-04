const Message = require('../models/message');
const UserController = require('./UserController');
const ChannelController = require('./ChannelController');
const channelController = new ChannelController();
const userController = new UserController();

class MessageController{
    constructor(){}
    findByChannel(channelId){
        Message.findAll({where:{channelId:channelId}}).then(messages=>{
            return messages;
        })
    }
    create(obj){
        return new Promise((resolve,reject)=>{
            const message = {
                id: obj.id,
                text: obj.text,
                // userId: obj.userId,
                // channelId: obj.channelId,
                created: new Date()
            };
            channelController.load(obj.channelId)
                .then(channel=>{
                    userController.load(obj.userId)
                        .then(user=>{
                            const result = {
                                user:user,
                                channel:channel.channel
                            };
                            return result;
                        }).then(obj=>{
                           // console.log("obj",obj);
                            Message.create(message).then(msg=>{
                                obj.user.addMessage(msg);
                                obj.channel.addMessage(msg);

                                const result = {
                                    message: msg,
                                    user:obj.user,
                                    channel:obj.channel
                                };
                                //console.log('result',result);
                                return resolve(result);
                            }).catch(err => {
                                return reject(err);
                            });
                    });
                });

        })

    }
}

module.exports = MessageController;