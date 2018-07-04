import React, {Component} from 'react';
import './styles.css';
import SidebarLeft from "./SidebarLeft";
import SidebarRight from "./SidebarRight";
import Content from "./Content";

class Main extends Component{

    render(){
        const {height} = this.props;
        const style = {
            height:height-50
        };
        const store = this.props.store;
        return(
            <main style={style}>
                <SidebarLeft store={store} />
                <Content store={store}/>
                <SidebarRight store={store}/>
            </main>
        );
    }
}
export default Main;