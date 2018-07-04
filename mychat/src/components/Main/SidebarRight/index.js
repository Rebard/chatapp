import React, {Component} from 'react';
import './styles.css';
import '../../Header/UserBar/FormRegister'


class SidebarRight extends Component{
    render(){
        const {store} = this.props;
        const curUser = store.getCurrentUser();
        const activeChannel = store.getActiveChannel();
        const users = activeChannel? store.getUsersFromChannel(activeChannel): store.getUsers();
        let members = users.map(function(user){
            return(
                <div key={user.id} className="user">
                    <img src={user.avatar} alt="Avatar"/>
                    <div>
                        <h3>{user.name}</h3>
                        <span>{user.created}</span>
                    </div>
                </div>
            );
        });
        return(
            <div className="sidebarRight">
                {curUser &&
                    <div>
                        <h2>Люди</h2>
                        {members}
                    </div>
                }
            </div>
        );
    }
}
export default SidebarRight;