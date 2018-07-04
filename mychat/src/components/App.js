import React,{Component} from 'react';
import './app_style.css'
import Header from "./Header";
import Main from './Main'
import Store from '../store'

class App extends Component{
    constructor(props){
        super(props);
        this.state = {
            store: new Store(this),
            height:window.innerHeight
        };
        this.onResize = this.onResize.bind(this);
    }
    onResize(){
        this.setState({
            height:window.innerHeight
        })
    }
    componentDidMount(){
        window.onresize = this.onResize;
    }

    render() {
        const store = this.state.store;
        const style = {
            height:this.state.height
        };
        return (
            <div style={style} className="wrapper">
                <Header store={store}/>
                <Main store={store} height={this.state.height}/>
            </div>

        );
    }
}
 export default App;