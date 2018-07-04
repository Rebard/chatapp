import React, {Component} from 'react';
import './styles.css';
import Chat from "./Chat";

class Content extends Component{
    render(){
        const store = this.props.store;
        return(
            <div className="content">
                <Chat store={store}/>
            </div>
        );
    }
}
export default Content;