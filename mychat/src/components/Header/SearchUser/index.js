import React,{Component} from 'react';
import './style.css'

export default class SearchUser extends Component{
    render(){
        const {user, selectUser,searchUserID} = this.props;

        return(
            <div>
            {searchUserID !== user.id?
                <div className="user" onClick={selectUser}>
                    <img src={user.avatar} alt="Avatar"/>
                    <h3>{user.name}</h3>
                 </div>: null
            }
            </div>
        )
    }
}