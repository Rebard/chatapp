import React, {Component} from 'react';
import './styles.css';
import Message from "./Message";
import FormDispatchOfMessage from './FormDispatchOfMessage';

class Chat extends Component{

    componentDidUpdate(){
        if(document.querySelector("#chat").lastChild !== null)
            document.querySelector("#chat").lastChild.scrollIntoView(false);
    }
    render(){
        const {store} = this.props;
        const activeChannel = store.getActiveChannel();
        const messages = store.getMessagesFromChannel(activeChannel);
        const chat =  messages.map(function(elem,index){
            return <Message key={index} message={elem}/>;
        });
        return(
            <div style={{height:'100%'}}>
                <div className="chat" id="chat">
                    {chat}
                </div>
                {activeChannel && <FormDispatchOfMessage store={store}/>}
            </div>

        );
    }
}
export default Chat;