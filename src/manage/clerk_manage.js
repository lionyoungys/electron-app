/**
 * 员工管理组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import '../static/api';
import Crumbs,{Notification} from '../static/UI';
const md5 = require('md5');

class ClerkManage extends Component {
    constructor(props) {
        super(props);
        this.crumbs = [{key:0,text:'员工管理'}];
        this.state = {clerks:[],show:false};
        this.addClerk = this.addClerk.bind(this);    //弹窗唤醒事件
        this.callback = this.callback.bind(this);    //弹窗回调函数
        this.deleteClerk = this.deleteClerk.bind(this);    //删除员工
    }

    componentDidMount() {
        axios.post(api.U('clerkList'),api.data({token:this.props.token}))
        .then((response) => {
            let result = response.data.data;
            this.setState({clerks:result});
            console.log(result);
        });
    }

    callback(isConfirm) {
        if (isConfirm) {
            axios.post(api.U('clerkList'),api.data({token:this.props.token}))
            .then((response) => {
                let result = response.data.data;
                this.setState({clerks:result});
                console.log(result);
            });
        }
        this.setState({show:false})
    }

    addClerk() {this.setState({show:true});}
    deleteClerk(e) {
        let id = e.target.dataset.id,
            state = this.state;
        axios.post(api.U('deleteClerk'),api.data({token:this.props.token,id:id}))
        .then((response) => {
            if (api.verify(response.data)) {
                let index = id.inObjectArray(state.clerks,'id');
                if (-1 !== index) {
                    state.clerks.splice(index,1);
                    this.setState({clerks:state.clerks});
                }
            }
        });
    }

    render () {
        let props = this.props,
            state = this.state,
            html = state.clerks.map((obj) => 
                <tr className='ui-tr-d' key={obj.id}>
                    <td>{obj.nickname}</td>
                    <td>{obj.username}</td>
                    <td>
                        <input 
                            type='button' 
                            value='删除' 
                            className='ui-btn ui-btn-editor'
                            onClick={this.deleteClerk}
                            data-id={obj.id}
                        />
                    </td>
                </tr>
            );
        return (
            <div>
                <Crumbs crumbs={this.crumbs} callback={props.changeView}/>
                <section className='ui-container'>
                    <div className='ui-box-right'>
                        <input 
                            type='button' 
                            value='+添加员工' 
                            className='ui-btn ui-btn-confirm ui-btn-large'
                            onClick={this.addClerk}
                        />
                    </div>
                    <div className='ui-content'>
                        <table className='ui-table'>
                            <thead className='ui-fieldset'>
                                <tr className='ui-tr-h'><th>姓名</th><th>手机号</th><th>编辑</th></tr>
                            </thead>
                            <tbody className='ui-fieldset'>{html}</tbody>
                        </table>
                    </div>
                </section>
                <AddClerk show={state.show} callback={this.callback} token={props.token}/>
            </div>
        );
    }
}

class AddClerk extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name:'',mobile:'',captcha:'',captchaInfo:'',password:'',show:false,
            msg:'获取验证码'
        };
        this.countdown = 60;
        this.timeOutId = this.intervalId = null;
        this.onConfirm = this.onConfirm.bind(this);    //确认
        this.onCancel = this.onCancel.bind(this);    //取消
        this.captcha = this.captcha.bind(this);    //获取验证码
        this.changeName = this.changeName.bind(this);    //名字
        this.changeMobile = this.changeMobile.bind(this);    //电话
        this.changeCaptcha = this.changeCaptcha.bind(this);    //验证码
        this.changePassword = this.changePassword.bind(this);    //密码
    }

    componentWillUnmount() {
        if (null !== this.timeOutId) {clearTimeout(this.timeOutId);}
        if (null !== this.intervalId) {clearInterval(this.intervalId);}
    }

    onConfirm() {
        let state = this.state,
            props = this.props;
        if (state.captcha !== state.captchaInfo) {
            this.setState({show:true});
            this.timeOutId = setTimeout(() => {this.setState({show:false})}, 3000);
        } else {
            axios.post(
                api.U('addClerk'),
                api.data({
                    token:props.token,
                    nickname:state.name,
                    username:state.mobile,
                    password:state.password
                })
            )
            .then((response) => {
                if (api.verify(response.data)) {
                    props.callback(true);
                }
            });
        }
    }
    onCancel() {this.props.callback(false);}
    changeName(e) {this.setState({name:e.target.value});}
    changeMobile(e) {this.setState({mobile:e.target.value});}
    changeCaptcha(e) {this.setState({captcha:md5(e.target.value)});}
    changePassword(e) {this.setState({password:e.target.value});}
    captcha() {
        let state = this.state,
            props = this.props;
        if ('获取验证码' != state.msg) return;
        if (state.mobile.length === 11) {
            axios.post(api.U('addClerk'),api.data({token:props.token,mobile:state.mobile}))
            .then((response) => {
                if (api.verify(response.data)) {
                    this.setState({captchaInfo:response.data.data,msg:'60s'});
                    this.intervalId = setInterval(
                        () => {
                            if (0 == this.countdown) {
                                this.setState({msg:'获取验证码'});
                                this.countdown = 60;
                                clearInterval(this.intervalId);
                            } else {
                                --this.countdown
                                this.setState({msg:this.countdown + 's'});
                            }
                        },
                        1000
                    );
                }
            });
        }
    }
    
    render () {
        let props = this.props,
            state = this.state;
        if (!props.show) return null;
        return (
            <section className='ui-alert-bg'>
                <Notification show={state.show} width='120'>验证码不正确!</Notification>
                <div className='ui-clerk-box'>
                    <div className='ui-clerk-box-up'>
                        <div className='ui-clerk-box-title'>新增员工</div>
                        <div className='ui-clerk-box-content'>
                            <p>
                                <span>姓名：</span>
                                <input 
                                    type='text' 
                                    className='ui-clerk-box-input' 
                                    maxLength='4'
                                    onChange={this.changeName}
                                />
                            </p>
                            <p>
                                <span>手机号：</span>
                                <input 
                                    type='text' 
                                    className='ui-clerk-box-input' 
                                    onChange={this.changeMobile}
                                />
                            </p>
                            <p>
                                <span>验证码：</span>
                                <input 
                                    type='text' 
                                    className='ui-clerk-box-input2'
                                    onChange={this.changeCaptcha}
                                />
                                <span onClick={this.captcha}>{state.msg}</span>
                            </p>
                            <p>
                                <span>密码：</span>
                                <input 
                                    type='password' 
                                    className='ui-clerk-box-input'
                                    onChange={this.changePassword}
                                />
                            </p>
                        </div>
                    </div>
                    <div className='ui-clerk-box-down'>
                        <div className='ui-clerk-box-btn' onClick={this.onCancel}>取消</div>
                        <div className='ui-clerk-box-btn' onClick={this.onConfirm}>确认</div>
                    </div>
                </div>
            </section>
        );
    }
}

export default ClerkManage;