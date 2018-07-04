import io from 'socket.io-client';
import {OrderedMap} from "immutable";

export default class Realtime{
    constructor(store){
        this.store = store;
        this.socket = null;
        this.connect();
    }
    authentication(){
        const store = this.store;
        const user = store.getUserLocalStorage();

        const message = {
            action:'auth',
            payload:user
        };
        this.send(message);
        store.fetchUsersChannels();
        console.log("Client Say", message);
    }

    send(msg={}){
        this.socket.emit('message',msg);
    }
    readResponse(socket){
        const store = this.store;
        const currentUser = store.getCurrentUser();
        const currentUserId = currentUser.id;
        socket.on('message',function(data){

           const action = data.action;
           const payload = data.payload;

           switch(action) {

               case 'messageAdded': {
                   const userId = payload.userId;
                   const messageObj = {
                       id:payload.id,
                       text:payload.text,
                       userId:payload.userId,
                       channelId:payload.channelId,
                       created:payload.created,
                       me: currentUserId === payload.userId
                   };
                   console.log(data);
                   store.setMessage(messageObj);
                   break;
               }


               case 'channelAdded':
                   const channel = payload.channel;
                   const usersFromChannel = new OrderedMap(payload.members);
                   console.log("MEMBERS,",usersFromChannel);
                   let newChannel = {
                       id: channel.id,
                       avatar:"https://w-dog.ru/wallpapers/5/6/306565792330301.jpg",
                       name:channel.title,
                       lastMessage:channel.lastMessage,
                       messages:new OrderedMap(),
                       users: usersFromChannel,
                       isNew:false,
                       updated: new Date()
                   };

                   store.addChannel(newChannel);
                   break;

               default:
                   break;
           }
        })
    }
    connect(){
        const socket = io.connect('http://localhost:3001');
        this.socket = socket;
        if(this.store.getCurrentUser()){
            this.authentication();
            this.readResponse(this.socket);
        }


    }
}
