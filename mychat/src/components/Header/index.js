import React, {Component} from 'react';
import './styles.css'
import 'font-awesome/css/font-awesome.min.css';
import {OrderedMap} from "immutable";
import {ObjectId} from 'ObjectId';
import SearchUser from "./SearchUser";
import UserBar from "./UserBar";

class Header extends Component{
    constructor(props){
        super(props);
        this.state = {
            searchUser: "",
            selectUserID:null
        };
        this.createNewChannel = this.createNewChannel.bind(this);
        this.searchUser = this.searchUser.bind(this);
    }
    onSelectUser(user){
      const {store} = this.props;
      store.addUserToTheChannel(user);
      this.setState({
          selectUserID:user.id,
      });
    }
    searchUser(event){
        this.setState({
            searchUser:event.target.value,
        },()=>{
            const {store} = this.props;
            store.startSearchUsers(this.state.searchUser);
        });
    }
    createNewChannel(){
        this.setState({
            selectUserID:null
        });
        const {store} = this.props;
        const newChannelID = new ObjectId().toString();
        const currentUser = store.getCurrentUser();
        const id = currentUser.id;
        let newChannel = {
            id: newChannelID,
            avatar:"https://w-dog.ru/wallpapers/5/6/306565792330301.jpg",
            name:"",
            lastMessage:"",
            messages:new OrderedMap(),
            isNew:true,
            users:new OrderedMap(),
            updated: new Date()
        };
        newChannel.users = newChannel.users.set(id,currentUser);
        store.createChannel(newChannel);
    }
    render(){
        const {store} = this.props;
        let searchUsers = store.getSearchUsers();
        const currentUser = store.getCurrentUser();
        //let usersFromChannel = store.getUsersFromChannel(store.getActiveChannel());
        const search = searchUsers.map((user)=>{
                return currentUser.id !== user.id? <SearchUser key={user.id} user={user}
                                    selectUser={this.onSelectUser.bind(this,user)}
                                    searchUserID={this.state.selectUserID}/>: null;
        });
        const channelStart = {name:""};
        let channel = store.getActiveChannel() === null? channelStart: store.getActiveChannel();
        return(
            <header id="head">
                {currentUser && <div className="left">
                    <button><i className="fa fa-cog fa-2x" aria-hidden="true"/></button>
                    <h2>Диалоги</h2>
                    <button onClick={this.createNewChannel}><i className="fa fa-pencil-square-o fa-2x"/></button>
                </div>
                }
                <div className="middle">
                    {channel.isNew ?
                        <div>
                            <label>
                                Имя:
                                <input onChange={this.searchUser} type="text" maxLength="20" placeholder="Имя участника"/>
                            </label>
                            <div className="searchUsersList">
                                {search}
                            </div>
                        </div> : <h2>{channel.name}</h2>
                    }
                </div>
                <div className="right">
                    <UserBar store={store}/>
                </div>
            </header>
        );
    }
}
export default Header;