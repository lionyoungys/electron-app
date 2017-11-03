/**
 * 新增企业会员组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import '../static/api';
import Crumbs, {Search} from '../static/UI';
import md5 from 'md5';

export default class MemberUpdateInfo extends Component{
    constructor(props) {
        super(props);
        this.params = this.props.param;
        this.state = {user:{},record:[],mobileShow:false,discountShow:false};
        this.onUpdateDiscountRequest = this.onUpdateDiscountRequest.bind(this);
        this.onUpdateMobileRequest = this.onUpdateMobileRequest.bind(this);
    }

    componentDidMount() {
        axios.post(
            api.U('memberDetail'), 
            api.data({token:this.props.token,number:this.params.number})
        )
        .then(response => {
            let result = response.data.data;
            this.setState({user:result.user,record:result.record})
            console.log(result);
        });
    }

    onUpdateDiscountRequest(discount) {
        let props = this.props,
            state = this.state;
        axios.post(
            api.U('updateMemberInfo'),
            api.D({token:props.token,uid:props.uid,type:2,memberid:state.user.id,discount:discount})
        )
        .then(response => {
            console.log(response);
            if (api.verify(response.data)) {
                state.user.discount = discount;
                this.setState({user:state.user,discountShow:false});
            }
        });
    }

    onUpdateMobileRequest(mobile) {
        let props = this.props,
            state = this.state;
        axios.post(
            api.U('updateMemberInfo'),
            api.D({token:props.token,uid:props.uid,type:1,memberid:state.user.id,mobile_number:mobile})
        )
       .then(response => {
            console.log(response);
            if (api.verify(response.data)) {
                state.user.mobile_number = mobile;
                this.setState({user:state.user,mobileShow:false});
            }
        });
    }

    render() {
        let props = this.props,
            state = this.state,
            user = state.user,
            record = state.record,
            html = record.map(obj =>
                <div className='ui-md-row' key={obj.id}>
                    <div>
                        <span>{1 == obj.type ? '会员充值' : '会员洗衣消费'}</span>
                        <span>{obj.update_time}</span>
                    </div>
                    <div>{1 == obj.type ? '' : '-'}&yen;{obj.amount}</div>
                </div>
            );
        return (
            <div>
                <Crumbs 
                    crumbs={[{key:0,text:'会员管理',e:'member_manage'},{key:1,text:'会员信息变更'}]} 
                    callback={props.changeView}
                />
                <section className='ui-md-box'>
                    <div><span>卡号：</span><span>{user.ucode}</span></div>
                    <div><span>姓名：</span><span>{user.username}</span></div>
                    <div><span>性别：</span><span>{1 == user.sex ? '男' : '女'}</span></div>
                    <div><span>会员类型：</span><span>{user.card_name}</span></div>
                    <div>
                        <span>手机号：</span><span>{user.mobile_number}</span>
                        <input 
                            type='button' 
                            className='ui-btn ui-btn-confirm' 
                            value='变更' style={{marginLeft:'45px'}}
                            onClick={() => this.setState({mobileShow:true})}
                        />
                    </div>
                    <div><span>会员余额：</span><span className='ui-red'>&yen;{user.balance}</span></div>
                    <div>
                        <span>会员折扣：</span><span>{user.discount}</span>
                        <input 
                            type='button' 
                            className='ui-btn ui-btn-confirm' 
                            value='变更' 
                            style={{marginLeft:'45px'}}
                            onClick={() => this.setState({discountShow:true})}
                        />
                    </div>
                    <div><span>会员生日：</span><span>{user.birthday}</span></div>
                    <div><span>办理时间：</span><span>{Number(user.register_time).dateFormat('datetime', '.')}</span></div>
                    <div><span>会员地址：</span><span>{user.address}</span></div>
                    <div><span>备注：</span><span>{user.remark}</span></div>
                </section>
                <div className='ui-md-partition'>余额明细</div>
                {html}
                <UpdateDiscount 
                    show={state.discountShow} 
                    onCancelRequest={() => this.setState({discountShow:false})}
                    onConfirmRequest={this.onUpdateDiscountRequest}
                />
                <UpdateMobile 
                    show={state.mobileShow}
                    token={props.token}
                    mobile={user.mobile_number}
                    onCancelRequest={() => this.setState({mobileShow:false})}
                    onConfirmRequest={this.onUpdateMobileRequest}
                />
            </div>
        );
    }
}

class UpdateDiscount extends Component{
    constructor(props) {
        super(props);
        this.state = {discount:''};
    }

    render() {
        let props = this.props,
            state = this.state;

        if (!props.show) return null;
        return (
            <section className='ui-fixed-bg'>
                <div className='ui-update-discount'>
                    <div className='ui-mm-layer-title'>
                        <em className='ui-mm-icon-discount'>变更会员折扣</em>
                        <em className='ui-close3' onClick={props.onCancelRequest}></em>
                    </div>
                    <div style={{textAlign:'center',padding:'33px 0 30px',fontSize:'18px',color:'#999'}}>请输入新折扣信息</div>
                    <div style={{textAlign:'center',lineHeight:'40px',fontSize:'18px',paddingBottom:'29px'}}>
                        <input 
                            type='text'
                            style={{width:'198px',height:'38px',border:'1px solid #e0e7eb'}}
                            value={state.discount}
                            onChange={e => this.setState({discount:e.target.value})}
                        />&nbsp;折
                    </div>
                    <div style={{textAlign:'center'}}>
                        <input
                            type='button' 
                            className='ui-teamwork-confirm'
                            onClick={() => {
                                if (!isNaN(state.discount) && state.discount > 0 && state.discount < 10) {
                                    props.onConfirmRequest(state.discount);
                                }
                            }}
                        />
                    </div>
                </div>
            </section>
        );
    }
}

class UpdateMobile extends Component{
    constructor(props) {
        super(props);
        this.state = {notice:'获取验证码',captcha:'',mobile:'',inputCaptcha:''};
        this.countdown = 60;
        this.intervalID = null;
        this.getCaptcha = this.getCaptcha.bind(this);
        this.onConfirmRequest = this.onConfirmRequest.bind(this);
    }

    getCaptcha() {
        let state = this.state,
            props = this.props;
        if ('获取验证码' != state.notice) return;
        if (11 === props.mobile.length && !isNaN(props.mobile)) {
            axios.post(api.U('clerkSendCode'),api.data({token:props.token,mobile:props.mobile}))
            .then(response => {
                if (api.verify(response.data)) {
                    this.setState({captcha:response.data.data,notice:'60s'});
                    this.intervalID = setInterval(
                        () => {
                            if (1 == this.countdown) {
                                this.setState({notice:'获取验证码'});
                                this.countdown = 60;
                                clearInterval(this.intervalID);
                            } else {
                                --this.countdown
                                this.setState({notice:this.countdown + 's'});
                            }
                        },
                        1000
                    );
                }
            });
        }
    }
    onConfirmRequest() {
        let state = this.state;
        if (
            !isNaN(state.mobile) 
            && 
            11 === state.mobile.length
            &&
            '' !== state.captcha
            &&
            '' !== state.inputCaptcha
            &&
            state.captcha === md5(state.inputCaptcha)
        ) {
            this.props.onConfirmRequest(state.mobile);
        }
    }

    componentWillUnmount() {
        if (null !== this.intervalID) {
            clearInterval(this.intervalID);
        }
    }

    render() {
        let props = this.props,
            state = this.state;
        if (!props.show) return null;
        return (
            <section className='ui-fixed-bg'>
                <div className='ui-update-mobile'>
                    <div className='ui-mm-layer-title'>
                        <em className='ui-mm-icon-mobile'>变更手机号</em>
                        <em className='ui-close3' onClick={props.onCancelRequest}></em>
                    </div>
                    <div style={{textAlign:'center',padding:'38px 0 35px',fontSize:'18px',color:'#999'}}>
                        您需要验证原手机号<span style={{color:'#f8953d'}}>{props.mobile}</span>
                    </div>
                    <div className='row'>
                        <span>验证码：</span>
                        <input 
                            type='text' 
                            style={{width:'168px'}} 
                            onChange={e => this.setState({inputCaptcha:e.target.value})}
                            value={state.inputCaptcha}
                        />
                        <span onClick={this.getCaptcha}>{state.notice}</span>
                    </div>
                    <div className='row'>
                        <span>新手机号：</span>
                        <input 
                            type='text' 
                            style={{width:'270px'}}
                            value={state.mobile}
                            maxLength='11'
                            onChange={e => this.setState({mobile:e.target.value})}
                        />
                    </div>
                    <div className='row'>
                        <span></span>
                        <input type='button' className='ui-teamwork-confirm' onClick={this.onConfirmRequest}/>
                    </div>
                </div>
            </section>
        );
    }
}