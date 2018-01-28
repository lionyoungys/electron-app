/**
 * 新增企业会员组件
 * @author yangyunlong
 */
const {ipcRenderer} = window.require('electron');
import React from 'react';
import Crumb from '../UI/crumb/App';
import Gateway from '../UI/gateway/App';
import Search from '../UI/search/App';
import Pay from '../UI/pay/App';
import './App.css';
const style = {marginBottom:'10px',fontSize:'18px'};

export default class extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            data:{cards:[{},{}]},
            checked:0,
            amount:'',
            give:'',
            status:'pay',
            show:false
        };
        this.gateway = [
            'CASH',             //现金支付
            'WechatPay_Pos',    //微信扫码支付
            'Alipay_AopF2F'    //支付宝扫码付
        ];
        this.handleClick = this.handleClick.bind(this);
        this.submit = this.submit.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
    }

    componentDidMount() {
        axios.post(api.U('recharge_info'),api.D({token:this.props.token,umobile:this.props.param}))
        .then(response => {
            api.V(response.data) && this.setState({data:response.data.result});
        });
    }

    onConfirm(authCode) {
        this.setState({status:'loading'});
        this.submit(authCode);
    }
    handleClick() {
        if (isNaN(this.state.amount) || this.state.amount < 0) return;
        if (0 != this.state.checked) {
            this.setState({show:true});
        } else {
            this.submit();
        }
    }

    submit(authCode) {
        authCode = tool.isSet(authCode) ? authCode : '1';
        axios.post(
            api.U('recharge'),
            api.D({
                token:this.props.token,
                uid:this.state.data.id,
                amount:this.state.amount,
                give:this.state.give,
                auth_code:authCode,
                gateway:this.gateway[this.state.checked]
            })
        )
        .then(response => {
            if (api.V(response.data)) {
                ipcRenderer.send(
                    'print-silent',
                    'public/prints/recharge.html',
                    {token:this.props.token,record_id:response.data.result,url:api.U('recharge_print')}
                );
                this.props.changeView({view:'index'});
            } else {
                if (0 != this.state.checked) {
                    this.setState({status:'fail'});
                }
            }
        });
    }

    onPayRequest() {
        let state = this.state,
            member = state.memberInfo.member;
        if (!isNaN(state.amount) && state.amount > 0) {
            if (0 !== state.payment) {
                this.setState({isShow:true});
            } else {
                this.setState({paymentStatus:'loading'})
                axios.post(
                    api.U('rechargeMerchantCard'),
                    api.D({
                        token:this.props.token,
                        uid:member.id,
                        card_name:member.card_name,
                        balance:state.amount,
                        auth_code:'',
                        give:state.give,
                        type:1,pay_type:'CASH'
                    })
                )
                .then(response => {
                    if (api.verify(response.data)) {
                        console.log(response.data);
                        this.printOrder(response.data.data.rechargeId);
                        this.setState({paymentStatus:'success'});
                        this.props.changeView({element:'index'});
                    } else {
                        this.setState({paymentStatus:'fail'});
                    }
                });
            }
        }
        
    }
    onOnlinePayRequest(authcode, amount) {
        let state = this.state,
            member = state.memberInfo.member;
        this.setState({paymentStatus:'loading'})
        axios.post(
            api.U('rechargeMerchantCard'),
            api.D({
                token:this.props.token,
                uid:member.id,
                card_name:member.card_name,
                balance:amount,
                auth_code:authcode,
                give:state.give,
                type:1,pay_type:(1 == state.payment ? 'WECHAT' : 'ALI')
            })
        )
        .then(response => {
            console.log(response.data);
            if (api.verify(response.data)) {
                this.printOrder(response.data.data.rechargeId);
                this.setState({paymentStatus:'success'});
                this.props.changeView({element:'index'});
            } else {
                this.setState({paymentStatus:'fail'});
            }
        });
    }

    render() {
        let cards = this.state.data.cards;
        return (
            <div>
                <Crumb data={[{key:0,value:'会员管理',view:'member'},{key:1,value:'会员充值'}]} callback={this.props.changeView}/>
                <div className='m-container'>
                    <div style={style}>核对会员信息</div>
                    <table className='m-table' style={{marginBottom:'20px'}}>
                        <tbody className='member-update'>
                            <tr className='bd-lightgrey'><td>姓名</td><td>{this.state.data.uname}</td></tr>
                            <tr className='bd-lightgrey'><td>手机号</td><td>{this.props.param}</td></tr>
                            <tr className='bd-lightgrey'><td>会员类型</td><td>{this.state.data.cname}</td></tr>
                            <tr className='bd-lightgrey'><td>当前余额</td><td className='m-red'>{this.state.data.cbalance}</td></tr>
                        </tbody>
                    </table>
                    <div style={style}>会员充值</div>
                    <div>
                        充值金额：<input type='text' value={this.state.amount} onChange={e => this.setState({amount:e.target.value})}/>&nbsp;&nbsp;元
                        &emsp;&emsp;
                        赠送金额：<input type='text' value={this.state.give} onChange={e => this.setState({give:e.target.value})}/>&nbsp;&nbsp;元
                    </div>
                    <div className='m-box' style={{marginLeft:'60px',fontSize:'14px',lineHeight:'30px'}}>
                        <p>温馨提示</p>
                        <p>
                            充值金额
                            <span className='m-red'>&ge;{cards[0].price}且&lt;{cards[1].price}元</span>,
                            可升级为{cards[0].card_name},享受
                            <span className='m-red'>{cards[0].discount}</span>
                            折优惠
                        </p>
                        <p>
                            充值金额
                            <span className='m-red'>&ge;{cards[1].price}元</span>,
                            可升级为{cards[1].card_name},享受
                            <span className='m-red'>{cards[1].discount}</span>
                            折优惠
                        </p>
                            <p>如果已经是{cards[1].card_name},无论充值多少,仍享受当前优惠</p>
                    </div>
                    <Gateway checked={this.state.checked} callback={value => this.setState({checked:value})}/>
                    <div style={{marginTop:'20px'}}>
                        <button type='button' className='m-btn confirm large' onClick={this.handleClick}>立即支付</button>
                    </div>
                </div>
                <Pay
                    show={this.state.show}
                    amount={this.state.amount}
                    status={this.state.status}
                    onClose={() => this.setState({show:false,status:'pay'})}
                    onConfirm={this.onConfirm}
                />
            </div>
        );
    }
}