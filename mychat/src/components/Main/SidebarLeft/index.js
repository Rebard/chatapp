import React, {Component} from 'react';
import './styles.css';

class SidebarLeft extends Component{
    render(){
        const store = this.props.store;
        const channels = store.getChannels();
        const chans = channels.map(function(channel,index){
            return (
            <div key={index} className={channel === store.getActiveChannel()? "channel active": "channel"}
                 onClick={()=>{
                     store.setActiveChannelId(channel.id);
                 }}
            >
                <img src={channel.avatar} alt="Avatar"/>
                <div>
                    <h3>{channel.name}</h3>
                    <span>{channel.lastMessage}</span>
                </div>
            </div>
            )
        });
        return(
            <div className="sidebarLeft">
                {chans}
            </div>
        );
    }
}
export default SidebarLeft;