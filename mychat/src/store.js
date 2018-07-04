import {OrderedMap} from 'immutable';
import Service from './service';
import Realtime from './realtime';

export default class Store{
    constructor(appComponent) {
        this.app = appComponent;
        this.service = new Service();
        this.messages = new OrderedMap();
        this.channels = new OrderedMap();
        this.activeChannelId = null;

        this.user = this.getUserLocalStorage();
        this.users = new OrderedMap();

        this.search = {
            users: new OrderedMap()
        };
        this.realtime = new Realtime(this);
        console.log("STORE CREATE",this.users);

    }

    fetchUsersChannels(){
        const user = this.getUserLocalStorage();
        const options = {
            headers:{
                authorization:user
            }
        };
        if(user){
            this.service.get('me/channels',options).then(response => {
                console.log('response',response.data);
            }).catch(err=>{
                console.log("Error fetching users channel",err);
            })
        }
    }


    getSearchUsers(){
        return this.search.users.valueSeq();
    }
    startSearchUsers(query = "") {
        const data = {search:query};
        this.search.users = this.search.users.clear();
        this.service.post('users/search', data).then(res=>{
           const users = res.data;
           users.forEach(user=>{
               this.search.users = this.search.users.set(user.id, user);
            });
            this.update();
        }).catch(err=>{
            console.log(err);
        });
    }

    signOut(){
        this.user = null;
        localStorage.user = null;
        this.setCurrentUser(this.user);
        this.update();
    }
    setCurrentUser(user){
        this.user = user;
        localStorage.user = JSON.stringify(user);
        this.update();
    }
    getUserLocalStorage(){
        let user = null;
        if(localStorage.user) {
            user = JSON.parse(localStorage.user);
        }
        return user;
    }
    login(email = null, password = null){
        const user = {
            email:email,
            password:password
        };
        return new Promise((resolve,reject)=>{
            this.service.post('users/login', user).then(res=>{
                this.setCurrentUser(res.data);
                this.realtime.connect();
                this.fetchUsersChannels();
                resolve(res);
            }).catch(err=>{
               reject(err.response.data.error);
            });
        })

    }

    getCurrentUser(){
        return this.getUserLocalStorage();
    }
    setMessage(message){
        this.messages = this.messages.set(message.id,message);
        const channelId = message.channelId;
        const channel = this.channels.get(channelId);
        if(channel)
            channel.messages = channel.messages.set(message.id,message);
        else{
            this.service.get(`channels/${channelId}`).then(response=>{
                const channel = response.data;
                const users = channel.members;
                // users.forEach(user=>{
                //     this.set
                // })
                this.channels = this.channels.set(channel.id,channel);
            })
        }
        this.update();
    }
    addMessage(id, message={}){
        if(message.text.trim() === "")
            return;
        this.messages = this.messages.set(id, message);
        const channel = this.getActiveChannel();
        const usersFromChannel = this.getUsersFromChannel(channel);
        let members=[];
        let title = [];
        for(let user of usersFromChannel) {
            members.push(user);
            title.push(user.name);
        }
        channel.lastMessage = message.text;
        channel.name = title.splice(1).join(",");
        channel.members = members;

        //send to the server channel
        if(channel.isNew){
            const obj = {
                action:'createChannel',
                payload:channel
            };
            this.realtime.send(obj);
        }


        //send  to the server new msg
        this.realtime.send({
            action:'createMessage',
            payload:message
        });


        channel.messages = channel.messages.set(id, message);
        channel.updated = new Date();
        channel.isNew = false;

        this.channels = this.channels.set(this.activeChannelId, channel);
        this.update();
    }
    getMessagesFromChannel(channel){
        let messages = [];
        const arr = this.messages;

        if(channel){
           channel.messages.map(function (elem,index) {
               const mes = arr.get(index);
               messages.push(mes);
               return mes;
            });
        }
        return messages;
    }
    getUsers(){
        return this.users.valueSeq();
    }
    getUsersFromChannel(channel = null){
        if(channel)
            console.log("CHANNEL",channel);
        return channel? channel.users.valueSeq(): new OrderedMap().valueSeq();
    }
    addUserToTheChannel(user={}){
        const channel = this.getActiveChannel();
        channel.users = channel.users.set(user.id, user);
        this.channels = this.channels.set(channel.id, channel);
        this.update();
    }
    createChannel(channel={}){
        this.addChannel(channel);
        this.setActiveChannelId(channel.id);
    }
    addChannel(channel={}){
        this.channels = this.channels.set(channel.id, channel);
        this.update();
    }
    getChannels(){
        if(this.user) {
            this.channels = this.channels.sort((a, b) => a.updated < b.updated);
            return this.channels.valueSeq();
        }
        return new OrderedMap().valueSeq();
    }

    setActiveChannelId(id){
        this.activeChannelId = id;
        this.update();
    }
    getActiveChannel(){
        const activeChannel = this.activeChannelId ? this.channels.get(this.activeChannelId) : this.channels.first();
        return activeChannel === undefined ? null : activeChannel;
    }
    update(){
        this.app.forceUpdate();
    }
}