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
        this.state = {notice:'',isShow:false,current:0};
        this.timeOutID = null;
        this.elements = [Login,Forgot];
        this.onCloseRequest = this.onCloseRequest.bind(this);    //关闭窗口事件
        this.noticeCallback = this.noticeCallback.bind(this);    //提示信息回调方法
        this.changeView = this.changeView.bind(this);    //修改界面方法
    }
    onCloseRequest() {ipcRenderer.send('login-msg','close');}
    noticeCallback(notice) {
        this.setState({isShow:true,notice:notice});
        this.timeID = setTimeout(() => {this.setState({isShow:false});}, 3000);
    }
    changeView(index) {this.setState({current:index});}
    componentWillUnmount() {if (null !== this.timeOutID) clearTimeout(timeOutID);}
    render () {
        let state = this.state,
            E = this.elements[state.current];
        return (
            <section className='container'>
                <div 
                    className='notice' 
                    style={{display:(state.isShow ? 'inline-block' : 'none')}}
                >{state.notice}</div>
                <em id='close' onClick={this.onCloseRequest}></em>
                <E noticeCallback={this.noticeCallback} changeView={this.changeView}/>
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
                    <label className='label'>电&nbsp;话：</label>
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
                    <label className='label'>密&nbsp;码：</label>
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
                <div className='forgot' onClick={() => {this.props.changeView(1)}}>忘记密码？</div>
                <div className='protocol'>
                    点击登录，即表示您同意<span style={{color:'#fa2212'}} onClick={() => ipcRenderer.send('protocol','show')}>用户协议</span>
                </div>
            </div>
        );
    }
}


class Forgot extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newPassword:'',confirmPassword:'',mobile:'',captcha:'',
            msg:'获取验证码'
        };
        this.intervalID = null;
        this.countdown = 60;
        this.changeNewPassword = this.changeNewPassword.bind(this);    //新密码
        this.changeConfirmPassword = this.changeConfirmPassword.bind(this);    //确认密码
        this.changeMobile = this.changeMobile.bind(this);    //修改电话号码
        this.changeCaptcha = this.changeCaptcha.bind(this);    //修改验证码
        this.onConfirmRequest = this.onConfirmRequest.bind(this);    //确认提交
        this.getCaptcha = this.getCaptcha.bind(this);    //获取验证码
    }

    changeNewPassword(e) {this.setState({newPassword:e.target.value.trim()});}
    changeConfirmPassword(e) {this.setState({confirmPassword:e.target.value.trim()});}
    changeMobile(e) {this.setState({mobile:e.target.value.trim()});}
    changeCaptcha(e) {this.setState({captcha:e.target.value.trim()});}
    onConfirmRequest() {
        let state = this.state;
        if (
            '' === state.newPassword
            ||
            '' === state.mobile
            ||
            isNaN(state.mobile)
            ||
            '' === state.captcha
        ) return;
        if (state.newPassword !== state.confirmPassword) {
            return this.props.noticeCallback('确认密码不一致');
        }
        axios.post(
            api.U('forgot'),
            api.data({
                username:state.mobile,
                password:state.newPassword,
                code:state.captcha
            })
        )
        .then((response) => {
            if (api.verify(response.data)) {
                this.props.changeView(0);
            } else {
                this.props.noticeCallback('修改失败');
            }
        });
    }

    getCaptcha() {
        let state = this.state;
        if ('获取验证码' !== state.msg || '' === state.mobile || isNaN(state.mobile)) return;
        axios.post(api.U('forgotSendCode'),api.data({username:state.mobile}))
        .then((response) => {
            if (api.verify(response.data)) {
                this.setState({msg:'60s'});
                this.intervalID = setInterval(
                    () => {
                        if (0 == this.countdown) {
                            this.setState({msg:'获取验证码'});
                            this.countdown = 60;
                            clearInterval(this.intervalID);
                        } else {
                            --this.countdown
                            this.setState({msg:this.countdown + 's'});
                        }
                    },
                    1000
                );
            } else {
                this.props.noticeCallback(response.data.status);
            }
        }); 
    }

    componentWillUnmount() {if (null !== this.intervalID) clearInterval(this.intervalID)}


    render() {
        let state = this.state;
        const style = {paddingBottom:'22px'};
        return (
            <div className='forgot-container'>
                <div>
                    <label className='label2'>新密码：</label>
                    <input 
                        type="password" 
                        value={state.newPassword} 
                        autoFocus 
                        onChange={this.changeNewPassword}
                        className='text'
                    />
                </div>
                <div>
                    <label className='label2'></label>
                    <div className='word'>*密码为6～18位字母、数字组合</div>
                </div>
                <div style={style}>
                    <label className='label2'>确认密码：</label>
                    <input 
                        type="password" 
                        value={state.confirmPassword} 
                        onChange={this.changeConfirmPassword}
                        className='text'
                    />
                </div>
                <div style={style}>
                    <label className='label2'>手机号：</label>
                    <input 
                        type="text" 
                        value={state.mobile} 
                        onChange={this.changeMobile}
                        className='text'
                    />
                </div>
                <div style={style}>
                    <label className='label2'>验证码：</label>
                    <input 
                        style={{width:'105px'}}
                        type="text" 
                        value={state.captcha} 
                        onChange={this.changeCaptcha}
                        className='text'
                    />
                    <span className='word2' onClick={this.getCaptcha}>{state.msg}</span>
                </div>
                <div>
                    <label className='label2'></label>
                    <input type="button" value="确认" className='btn' onClick={this.onConfirmRequest}/>
                </div>
                <div className='back' onClick={() => {this.props.changeView(0)}}>返回登录</div>
            </div>
        );
    }
}

ReactDOM.render(<Container/>,document.getElementById('root'));