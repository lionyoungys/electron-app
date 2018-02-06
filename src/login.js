/**
 * 登录界面
 * @author yangyunlong
 */
const {ipcRenderer} = window.require('electron');
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './login.css';
import './api';
String.prototype.trim = function () {return this.replace(/(^\s*)|(\s*$)/g,'')};    //去除字符串中的空字符；

class Container extends Component {
    constructor(props) {
        super(props);
        this.state = {text:'', isShow:false, current:0};
        this.timeOutID = null;
        this.elements = [Login, Forgot];
        this.notice = this.notice.bind(this);    //提示信息回调方法
    }
    notice(text) {
        this.setState({isShow:true,text:text});
        this.timeID = setTimeout(
            () => {this.setState({isShow:false});}, 
            3000
        );
    }
    componentWillUnmount() {null !== this.timeOutID && clearTimeout(timeOutID);}
    render () {
        let state = this.state,
            E = this.elements[state.current];
        return (
            <div className='container'>
                <div 
                    className='notice' 
                    style={{display:(state.isShow ? 'inline-block' : 'none')}}
                >{state.text}</div>
                <em id='close' onClick={() => ipcRenderer.send('login-msg','close')}></em>
                <E notice={this.notice} changeView={index => this.setState({current:index})}/>
            </div>
        );
    }
}

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {mobile:'',password:'',code:'',captcha:'',unique:'',image:''};
        this.captcha = this.captcha.bind(this);    //获取验证码
        this.onLoginRequest = this.onLoginRequest.bind(this);    //登录事件      
    }
    //初始化获取验证码
    componentDidMount() {this.captcha()}

    captcha() {
        axios.get(api.U('captcha'))
        .then(response => {
            let result = response.data.result;
            this.setState({captcha:result.captcha, unique:result.unique, image:result.image});
        });
    }
    
    onLoginRequest() {
        let state = this.state;
        if (
            '' !== state.mobile 
            && 
            '' !== state.password 
            && 
            '' !== state.code
            && 
            !isNaN(state.mobile)
        ) {
            axios.post(
                api.U('login'),
                api.D({
                    mobile_number:state.mobile,
                    passwd:state.password,
                    code:state.code,
                    captcha:state.captcha,
                    unique:state.unique
                })
            )
            .then(response => {
                let result = response.data;
                console.log(result);
                if (!api.V(result)) {
                    //验证错误时，提示登录信息错误
                    this.props.notice(result.msg);
                    this.captcha();                 
                } else {
                	localStorage.setItem('order', result.order);
                	localStorage.setItem('is_root', result.is_root);
                    localStorage.setItem('token', result.token);                    
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
                    <label className='label'>电&emsp;话：</label>
                    <input 
                        type="text" 
                        value={state.mobile} 
                        autoFocus 
                        maxLength="11"
                        onChange={e => this.setState({mobile:e.target.value.trim()})}
                        className='text'
                    />
                </div>
                <div style={{marginBottom:'14px'}}>
                    <label className='label'>密&emsp;码：</label>
                    <input 
                        type="password" 
                        value={state.password}
                        onChange={e => this.setState({password:e.target.value.trim()})}
                        className='text'
                    />
                </div>
                <div style={{marginBottom:'14px'}}>
                    <label className='label' style={{display:'block', float:'left'}}>验证码:</label>
                    <input 
                        type="text" 
                        value={state.code}
                        onChange={e => this.setState({code:e.target.value.trim()})}
                        className='input3'
                    />
                   <img src={state.image} onClick={this.captcha} className='img'/>
                </div>
                <div style={{clear:'both',marginTop:'5px'}}>
                    <label className='label'></label>
                    <input type="button" value="登陆" className='btn' onClick={this.onLoginRequest} style={{marginTop:'12px'}}/>
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
            newPassword:'',confirmPassword:'',mobile_number:'',captcha:'',
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
    changeMobile(e) {this.setState({mobile_number:e.target.value.trim()});}
    changeCaptcha(e) {this.setState({captcha:e.target.value.trim()});}
    onConfirmRequest() {
        let state = this.state;
        if (
            '' === state.newPassword
            ||
            '' === state.mobile_number
            ||
            isNaN(state.mobile_number)
            ||
            '' === state.captcha
        ) return;
        if (state.newPassword !== state.confirmPassword) {
            return this.props.notice('确认密码不一致');
        }
        axios.post(
            api.U('forgot'),
            api.D({
                mobile_number:state.mobile_number,
                passwd:state.newPassword,                
                sms_code:state.captcha               
            })
        )
        
        .then((response) => {
        	console.log(response);
            if (api.V(response.data)) {
            	
                this.props.changeView(0);
            } else {
                this.props.notice(response.data.msg);
            }
        });
    }

    getCaptcha() {
        let state = this.state;
        if ('获取验证码' !== state.msg || '' === state.mobile_number || isNaN(state.mobile_number)) return;
        axios.post(api.U('forgotSendCode'),api.D({mobile_number:state.mobile_number}))
        .then((response) => {
        	console.log(response);
            if (api.V(response.data)) {
            	
                this.setState({msg:'60s'});
                this.intervalID = setInterval(
                    () => {
                        if (0 == this.countdown) {
                            this.setState({msg:'获取验证码'});
                            this.countdown = 60;
                            clearInterval(this.intervalID);
                        } else {
                            --this.countdown;
                            this.setState({msg:this.countdown + 's'});
                        }
                    },
                    1000
                );
            } else {
                this.props.notice(response.data.msg);
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
                        value={state.mobile_number} 
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