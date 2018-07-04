import React,{Component} from 'react'
import './style.css'

export default class FormRegister extends Component{
    constructor(props){
        super(props);
        this.state = {
            message:"",
            isLogin:false,
            user: {
                email: "",
                password: ""
            }
        };
        this.onTextFieldChange = this.onTextFieldChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    onTextFieldChange(event){
        const name = event.target.name;
        let {user} = this.state;
        user[name] = event.target.value;
        this.setState({
            user:user
        })
    }
    onSubmit(event) {
        const {user} = this.state;
        const {store} = this.props;
        event.preventDefault();
        store.login(user.email, user.password)
            .then(()=>{
                this.setState({
                    isLogin: true
                })
            })
            .catch((err) => this.setState({
                message:err
            }));
    }
    render(){
        return(
        <div className="userForm" id="userForm">
            {!this.state.isLogin && <form onSubmit={this.onSubmit} method="POST">
                {this.state.message !=="" && <div className="err">{this.state.message}</div>}
                <label>Логин<input onChange={this.onTextFieldChange} name="email" type="email"
                                   placeholder="Почтовый ящик"/></label>
                <label>Пароль<input onChange={this.onTextFieldChange} name="password" type="password"
                                    placeholder="Пароль"/></label>
                <div className="btnRegister">
                    <button className="btnCreateAcc">Создать аккаунт?</button>
                    <button className="btnSignIn" type="submit">Войти</button>
                </div>
            </form>
            }
        </div>
        );
    }
}