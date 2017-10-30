/**
 * 员工管理组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import '../static/api';
import Crumbs,{Notification} from '../static/UI';
import md5 from 'md5';

export default class ClerkManage extends Component {
    constructor(props) {
        super(props);
        this.crumbs = [{key:0,text:'员工管理'}];
        this.state = {clerks:[],show:false,authList:[]};
        this.callback = this.callback.bind(this);    //弹窗回调函数
        this.deleteClerk = this.deleteClerk.bind(this);    //删除员工
    }

    componentDidMount() {
        axios.post(api.U('getAuth'),api.data({token:this.props.token}))
        .then(response => {
            for (var k in response.data) {this.state.authList.push(response.data[k])}
            this.setState({authList:this.state.authList});
        });
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
                    <td>{obj.auth}</td>
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
                            onClick={() => this.setState({show:true})}
                        />
                    </div>
                    <div className='ui-content'>
                        <table className='ui-table'>
                            <thead className='ui-fieldset'>
                                <tr className='ui-tr-h'><th>姓名</th><th>手机号</th><th>权限</th><th>编辑</th></tr>
                            </thead>
                            <tbody className='ui-fieldset'>{html}</tbody>
                        </table>
                    </div>
                </section>
                <AddClerk show={state.show} authList={state.authList} callback={this.callback} token={props.token}/>
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
        this.captcha = this.captcha.bind(this);    //获取验证码
        this.toggleChecked = this.toggleChecked.bind(this);
    }


    componentWillUnmount() {
        if (null !== this.timeOutId) {clearTimeout(this.timeOutId);}
        if (null !== this.intervalId) {clearInterval(this.intervalId);}
    }

    onConfirm() {
        let state = this.state,
            props = this.props;
        if (md5(state.captcha) !== state.captchaInfo) {
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
    
    captcha() {
        let state = this.state,
            props = this.props;
        if ('获取验证码' != state.msg) return;
        if (state.mobile.length === 11) {
            axios.post(api.U('clerkSendCode'),api.data({token:props.token,mobile:state.mobile}))
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

    toggleChecked(e) {
        let target = e.target;
        if (target.classList.contains('ui-checked3')) {

        }
        target.classList.toggle('ui-checked3');
    }
    
    render () {
        let props = this.props,
            state = this.state,
            auths = props.authList.map((obj, index) => 
                <span 
                    key={index} 
                    data-index={index + 1} 
                    className='ui-checkbox3' 
                    onClick={this.toggleChecked}
                >{obj}</span>  
            );
        if (!props.show) return null;
        return (
            <section className='ui-fixed-bg'>
                <Notification show={state.show} width='120'>验证码不正确!</Notification>
                <div className='ui-clerk-box'>
                    <div className='ui-clerk-box-header'>
                        <span>添加员工</span>
                        <em className='ui-close3' onClick={() => props.callback(false)}></em>
                    </div>
                    <div className='ui-clerk-box-body'>
                        <div className='ui-clerk-box-row'>
                            <span>姓名：</span>
                            <input 
                                type='text' 
                                value={state.name} 
                                onChange={e => this.setState({name:e.target.value})}
                            />
                        </div>
                        <div className='ui-clerk-box-row'>
                            <span>手机号：</span>
                            <input 
                                type='text' 
                                value={state.mobile}
                                onChange={e =>{if (!isNaN(e.target.value)) this.setState({mobile:e.target.value})}}
                            />
                        </div>
                        <div className='ui-clerk-box-row'>
                            <span>验证码：</span>
                            <input 
                                type='text' 
                                className='input' 
                                value={state.captcha}
                                onChange={e => this.setState({captcha:e.target.value})}
                            />
                            <span className='captcha' onClick={this.captcha}>{state.msg}</span>
                        </div>
                        <div className='ui-clerk-box-row'>
                            <span>密码：</span>
                            <input 
                                type='text' 
                                value={state.password} 
                                onChange={e => this.setState({password:e.target.value})}
                            />
                        </div>
                        <div className='ui-clerk-box-row' style={{paddingTop:'16px'}}>
                            <span style={{height:'24px',lineHeight:'24px'}}>权限设置：</span>
                            <div className='auth'>{auths}</div>
                        </div>
                        <div className='ui-clerk-box-row' style={{marginTop:'-6px'}}>
                            <span></span><input type='button' className='ui-teamwork-confirm' onClick={this.onConfirm}/>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
