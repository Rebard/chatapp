import React,{Component} from 'react'
import './style.css'

export default class UserMenu extends Component{
    constructor(props){
        super(props);
        this.state= {
            showUserMenu: true
        };
        this.onClickSignOut = this.onClickSignOut.bind(this);
        this.onClickNotProfile = this.onClickNotProfile.bind(this);
    }
   onClickNotProfile(event){
        // let doc;
        // if(document.querySelector("#userMenu").parentNode!== null)
        //     doc = document.querySelector("#userMenu").parentNode;
        // console.log(doc);
        // for(let temp = event.target;temp !== document; temp = temp.parentNode){
        //     if(temp === doc)
        //         return;
        // }
        // console.log("elem",event.target);
        // this.setState({
        //     showUserMenu: false
        // });
   }
    componentDidMount(){
        window.addEventListener('click',this.onClickNotProfile);
    }
    componentWillMount(){
        window.removeEventListener('click',this.onClickNotProfile);
    }
    onClickSignOut() {
        const {store} = this.props;
        store.signOut();
    }

    render(){
        console.log('state',this.state.showUserMenu);
        return(
            <div id="userMenu">
            {this.state.showUserMenu &&
                <div className='userMenu'>
                    <div className='itemMenu' onClick={this.onClickSignOut}>Мой профиль</div>
                    <div className='itemMenu' onClick={this.onClickSignOut}>Выйти</div>
                </div>
            }
            </div>
        );
    }
}