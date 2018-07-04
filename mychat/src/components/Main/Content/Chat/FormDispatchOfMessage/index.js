import React, {Component} from 'react';
import './styles.css';
import 'font-awesome/css/font-awesome.min.css';
import {ObjectId} from 'ObjectId';

class FormDispatchOfMessage extends Component{
    sendMessage(){
        const activeChannel = this.props.store.getActiveChannel();
        const user = this.props.store.getCurrentUser();
        const msgID = new ObjectId().toString();
        const textMsg = document.querySelector("#msg").value;
        const newMessage = {
            id:msgID,
            userId:user.id,
            text:textMsg,
            avatar:user.avatar,
            created:new Date().toDateString(),
            channelId:activeChannel.id,
            me:true
        };

        this.props.store.addMessage(msgID, newMessage);
        document.querySelector("#msg").value = "";

    }
    render(){
        return(
            <form id="formSend">
                <textarea placeholder="Введите сообщение..." id="msg"/>
                <div className='butSubmit' onClick={this.sendMessage.bind(this)}>
                    <i className="fa fa-paper-plane fa-2x" aria-hidden="true"/>
                </div>
            </form>
        );
    }
}
export default FormDispatchOfMessage;