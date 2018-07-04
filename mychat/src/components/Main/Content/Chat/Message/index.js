import React,{Component} from 'react'
import '../../styles.css'

class Message extends Component{

    render(){
        const mes = this.props.message;
        return(
            <div className={mes.me? "messages mine": "messages"}>
                <div className="messageUserImage"><img src={mes.avatar} alt=""/></div>
                <p>{mes.text}</p>
            </div>
        );
    }
}

export default Message;