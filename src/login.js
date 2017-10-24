/**
 * 登录界面js
 * @author yangyunlong
 */
const {ipcRenderer} = window.require('electron');
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './login.css';
import './static/api';
String.prototype.trim = function () {return this.replace(/(^\s*)|(\s*$)/g,'');};    //去除字符串中的空字符；

class Container extends Component {
    constructor(props) {
        super(props);
        this.state = {notice:'',isShow:false};
        this.timeID = null;
        this.onCloseRequest = this.onCloseRequest.bind(this);    //关闭窗口事件
        this.noticeCallback = this.noticeCallback.bind(this);    //提示信息回调方法
    }
    onCloseRequest() {ipcRenderer.send('login-msg','close');}
    noticeCallback(notice) {
        this.setState({isShow:true,notice:notice});
        this.timeID = setTimeout(
            () => {
                this.setState({isShow:false});
            }, 
            3000
        );
    }
    componentWillUnmount() {
        if (null !== this.timeID) clearTimeout(timeID);
    }
    render () {
        let state = this.state;
        return (
            <section className='container'>
                <div 
                    className='notice' 
                    style={{display:(state.isShow ? 'inline-block' : 'none')}}
                >{state.notice}</div>
                <em id='close' onClick={this.onCloseRequest}></em>
                <Login noticeCallback={this.noticeCallback}/>
            </section>
        );
    }
}

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {mobile:'',password:''};
        this.changeMobile = this.changeMobile.bind(this);    //更改电话
        this.changePassword = this.changePassword.bind(this);    //更改密码
        this.onLoginRequest = this.onLoginRequest.bind(this);    //登录事件
    }

    changeMobile(e) {this.setState({mobile:e.target.value.trim()});}
    changePassword(e) {this.setState({password:e.target.value.trim()});}
    onLoginRequest() {
        let state = this.state;
        if (
            '' !== state.mobile 
            && 
            '' !== state.password 
            && 
            !isNaN(state.mobile)
        ) {
            axios.post(api.U('login'), api.data({username:state.mobile,password:state.password}))
            .then((response) => {
                let result = response.data;
                if (!api.verify(result)) {
                    //验证错误时，提示登录信息错误
                    this.props.noticeCallback(result.status);
                } else {
                    localStorage.setItem('token', result.data.token);
                    localStorage.setItem('role', result.data.role);
                    localStorage.setItem('uid', result.data.uid);          
                    ipcRenderer.send('login-msg','SUCCESS');
                }
            });
        }
    }

    render() {
        let state = this.state;
        return (
            <div className='login-container'>
                <div style={{marginBottom:'12px'}}>
                    <label className='label' htmlFor="account">电&nbsp;话：</label>
                    <input 
                        type="text" 
                        value={state.mobile} 
                        autoFocus 
                        maxLength="11"
                        onChange={this.changeMobile}
                        className='text'
                    />
                </div>
                <div style={{marginBottom:'14px'}}>
                    <label className='label' htmlFor="passwd">密&nbsp;码：</label>
                    <input 
                        type="password" 
                        value={state.password}
                        onChange={this.changePassword}
                        className='text'
                    />
                </div>
                <div>
                    <label className='label'></label>
                    <input type="button" value="登陆" className='btn' onClick={this.onLoginRequest}/>
                </div>
                <div className='forgot'>忘记密码？</div>
                <div className='protocol'>
                    点击登录，即表示您同意<span style={{color:'#fa2212'}}>用户协议</span>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<Container/>,document.getElementById('root'));