import React,{Component} from 'react';
import './style.css';
import avatar from '../../../images/avatar.png';
import FormRegister from "./FormRegister";
import UserMenu from "./UserMenu";

export default class UserBar extends Component{
    constructor(props){
        super(props);
        this.state ={
            showFormLogin:false,
            showUserMenu:false
        };
        this.onClickOutside = this.onClickOutside.bind(this);
        this.onClickProfile = this.onClickProfile.bind(this);
    }
    onClickProfile(){
        this.setState({
            showUserMenu:!this.state.showUserMenu
        });
    }

    isShowFormLogin(){
        this.setState({
            showFormLogin: true
        })
    }
    onClickOutside(event){
        const doc = document.querySelector("#userForm");
        for(let temp = event.target;temp !== document; temp = temp.parentNode){
            if(temp === doc || temp === document.querySelector('.btnLogin'))
                return;
        }
        this.setState({
            showFormLogin: false
        })
    }
    componentDidMount(){
        window.addEventListener('click',this.onClickOutside);
    }
    componentWillMount(){
        window.removeEventListener('click',this.onClickOutside);
    }
    render(){
        const {store} = this.props;
        const user = store.getCurrentUser();
        return (
            <div className="userBar">
                {!user?
                    <button className="btnLogin" onClick={this.isShowFormLogin.bind(this)}>Войти
                    </button>:<h3>{user.name}</h3>
                }
                {this.state.showFormLogin && <FormRegister store={store} />}
                <img src={avatar}
                     onClick={user? this.onClickProfile:null}
                     alt=""/>
                {this.state.showUserMenu && <UserMenu store={store}/> }
            </div>
        )
    }
}