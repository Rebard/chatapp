const Channel = require('../models/channel');
const UserController = require('./UserController');
const User = new UserController();
const {OrderedMap} = require('immutable');
const {ObjectId} = require('ObjectId');

class ChannelController{
    constructor(){
        this.channels = new OrderedMap();
    }
    load(id){
        return new Promise((resolve,reject)=>{
            const channelInCache = this.channels.get(id);
            if (channelInCache)
                return resolve(channelInCache);
            // console.log("CHANELID", id);
            Channel.findById(id).then(channel=>{
                channel.getUsers().then(users=>{
                    const obj = {
                        channel:channel,
                        members:users
                    };
                    if(channel){
                        this.channels = this.channels.set(id, obj);
                    }
                    return channel? resolve(obj):reject("Диалог не найден");
                })
            }).catch(err => console.log(err));
        });
    }
    create(obj){
        return new Promise((resolve,reject)=>{
            let id = obj.id;
            let idObject = id? id:new ObjectId().toString();
            const members = obj.members;
            const channel = {
                id:idObject,
                title:obj.name,
                lastMessage:obj.lastMessage
            };
            let users = [];
            let usersFromChannel = new OrderedMap();
            members.forEach(member=>{
               User.load(member.id).then(user=>{
                   users.push(user);
                   usersFromChannel = usersFromChannel.set(member.id,user);
               })
            });

            Channel.create(channel).then(channel=> {
                channel.setUsers(users);
                const obj = {
                    channel:channel,
                    members:usersFromChannel
                };
                return resolve(obj);
            }).catch(err=> reject(err));
        });

               // this.channels = this.channels.set(channel.id,channel.dataValues);
    }
}
module.exports = ChannelController;