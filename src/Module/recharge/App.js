/**
 * 会员充值组件
 * @author yangyunlong
 */
const {ipcRenderer} = window.require('electron');
import React from 'react';
import Gateway from '../UI/gateway/App';
import Search from '../UI/search/App';
import Pay from '../UI/pay/App';
import './App.css';
const style = {marginBottom:'10px',fontSize:'18px'};

export default class extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            data:{cards:[{},{}],cdiscount:''},
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
        let discount = this.state.data.cdiscount;
        if (1 > discount || 10 < discount) return alert('折扣必须大于1且小于10');
        axios.post(
            api.U('recharge1_0_6'),
            api.D({
                token:this.props.token,
                uid:this.state.data.id,
                amount:this.state.amount,
                give:this.state.give,
                auth_code:authCode,
                discount:discount,
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
                this.props.changeView({view:'done', param:{msg:'充值', index:'member'}});
            } else {
                if (0 != this.state.checked) {
                    this.setState({status:'fail'});
                }
            }
        });
    }

    render() {
        let cards = this.state.data.cards;
        return (
            <div>
                <div className='m-container'>
                    <div style={style}>核对会员信息</div>
                    <table className='m-table' style={{marginBottom:'20px'}}>
                        <tbody className='member-update'>
                            <tr className='bd-lightgrey'><td>姓名</td><td>{this.state.data.uname}</td></tr>
                            <tr className='bd-lightgrey'><td>手机号</td><td>{this.props.param}</td></tr>
                            <tr className='bd-lightgrey'>
                                <td>会员折扣</td>
                                <td>
                                    <input type='text' value={this.state.data.cdiscount} onChange={e => {
                                        let value = e.target.value;
                                        if (isNaN(value) || value > 10 || value.toString().length > 4) return;
                                        this.state.data.cdiscount = value;
                                        this.setState({data:this.state.data});
                                    }}/>&nbsp;折&emsp;&emsp;&emsp;<span className='e-orange'>打折后:原价&times;{Math.floor(this.state.data.cdiscount * 1000) / 100}%</span>
                                </td>
                            </tr>
                            <tr className='bd-lightgrey'><td>当前余额</td><td className='m-red'>{this.state.data.cbalance}</td></tr>
                        </tbody>
                    </table>
                    <div style={style}>会员充值</div>
                    <div style={{marginBottom:'16px'}}>
                        充值金额：<input type='text' value={this.state.amount} onChange={e => this.setState({amount:e.target.value})}/>&nbsp;&nbsp;元
                        &emsp;&emsp;
                        赠送金额：<input type='text' value={this.state.give} onChange={e => this.setState({give:e.target.value})}/>&nbsp;&nbsp;元
                    </div>
                    {/* <div className='m-box' style={{marginLeft:'60px',fontSize:'14px',lineHeight:'30px',display:('企业会员卡' == this.state.data.cname ? 'none' : 'block')}}>
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
                    </div> */}
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