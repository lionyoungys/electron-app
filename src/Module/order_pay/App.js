/**
 * 订单支付组件
 * @author yangyunlong
 */
const {ipcRenderer} = window.require('electron');
import React, {Component} from 'react';
import Crumb from '../UI/crumb/App';
import Search2 from '../UI/search2/App';
import Radio from '../UI/radio/App';
import Pay from '../UI/pay/App';
import {CardVerify} from '../UI/pay-toast/App';
import './App.css';

export default class extends Component {
    constructor(props) {
        super(props);
        this.id = '838';
        this.state = {
            payAmount:0,
            payRealAmount:0,
            keepPrice:0,
            freightPrice:0,
            craftPrice:0,
            reducePrice:0,
            reduceRealPrice:0,
            amount:0,
            totalAmount:0,
            uid:null,
            umobile:'',
            hasPlatform:0,
            hasMerchant:0,
            platform:{},
            merchant:{},
            items:[],
            sn:'',
            coupon:0,
            checked:null,
            cashReduce:null,
            wechatReduce:null,
            alipayReduce:null,
            show:false,
            status:'pay',
            cardVerifyShow:false,


            realAmount:0,payment:'',
            reduce:10,reduceAmount:0,voucher:0,voucher_id:null,
            vipBalance:0,merchantBalance:0,
            vipDiscount:10,merchantDiscount:10,vip_id:null,
            isShow:false,paymentStatus:'payment',user_id:null,
        };
        this.gateway = ['PLATFORM','MERCHANT','CASH','WechatPay_Pos','Alipay_AopF2F'];
        this.useCoupon = this.useCoupon.bind(this);    //使用优惠券
        this.calculate = this.calculate.bind(this);    //计算价格方法
        this.handleChecked = this.handleChecked.bind(this);    //切换支付方式
        this.handleReduceChecked = this.handleReduceChecked.bind(this);    //切换优惠方式
        this.getPayRealAmount = this.getPayRealAmount.bind(this);    //获取实际支付金额
    }

    componentDidMount() {
        axios.post(api.U('pay_order'),api.D({token:this.props.token,oid:this.id}))
        .then(response => {
            if (api.V(response.data)) {
                let result = response.data.result;
                this.setState({
                    payAmount:result.pay_amount,
                    payRealAmount:result.pay_amount,
                    keepPrice:result.keep_price,
                    freightPrice:result.freight_price,
                    craftPrice:result.craft_price,
                    reducePrice:result.reduce_price,
                    reduceRealPrice:result.reduce_price,
                    amount:result.amount,
                    uid:result.uid,
                    totalAmount:result.total_amount,
                    platform:result.platform,
                    merchant:result.merchant,
                    hasPlatform:result.has_platform,
                    hasMerchant:result.has_merchant,
                    umobile:result.umobile,
                    items:result.items
                });
            }
            console.log(response.data);
        });
    }

    useCoupon(value) {
        if ('' != value) {
            if (2 == this.state.checked && 'free' == this.state.cashReduce) return alert('免洗订单不可使用优惠券');
            axios.post(api.U('pay_coupon'),api.D({token:this.props.token,sn:value}))
            .then(response => {
                if (api.V(response.data)) {
                    this.calculate({sn:value,coupon:response.data.value});
                } else {
                    alert(response.data.msg);
                }
            });
        }
    }

    calculate(obj) {
        if (!tool.isSet(obj)) obj = {};
        obj.coupon = tool.isSet(obj.coupon) ? obj.coupon : this.state.coupon;
        obj.checked = tool.isSet(obj.checked) ? obj.checked : this.state.checked;
        if (null === obj.checked) {
            obj.payRealAmount = tool.safeDIC(this.state.payAmount, obj.coupon);
            obj.reduceRealPrice = tool.safeDIC(this.state.totalAmount, obj.payRealAmount);
        } else {
            obj.cashReduce = 'undefined' !== typeof obj.cashReduce ? obj.cashReduce : this.state.cashReduce;
            obj.wechatReduce = 'undefined' !== typeof obj.wechatReduce ? obj.wechatReduce : this.state.wechatReduce;
            obj.alipayReduce = 'undefined' !== typeof obj.alipayReduce ? obj.alipayReduce : this.state.alipayReduce;
            let payAmount = this.state.payAmount;
            switch (Number(obj.checked)) 
            {
                case 0:
                    let platform = this.state.platform;
                    obj.payRealAmount = this.getPayRealAmount(platform.cdiscount);
                    obj.payRealAmount = tool.safeDIC(obj.payRealAmount, obj.coupon);
                    if (obj.payRealAmount == 0) return alert('支付价格为0时只能使用现金!');
                    if (obj.payRealAmount > platform.cbalance) return alert('余额不足');
                    break;
                case 1:
                    let merchant = this.state.merchant;
                    obj.payRealAmount = this.getPayRealAmount(merchant.cdiscount);
                    obj.payRealAmount = tool.safeDIC(obj.payRealAmount, obj.coupon);
                    if (obj.payRealAmount == 0) return alert('支付价格为0时只能使用现金!');
                    if (obj.payRealAmount > merchant.cbalance) return alert('余额不足');
                    break;
                case 2:
                    if ('free' == obj.cashReduce) {
                        obj.payRealAmount = payAmount;
                        obj.coupon = 0;
                        obj.sn = '';
                    } else if ('floor' == obj.cashReduce) {
                        obj.payRealAmount = Math.floor( tool.safeDIC(payAmount, obj.coupon) );
                    } else {
                        obj.payRealAmount = tool.safeDIC(payAmount, obj.coupon);
                    }
                    break;
                case 3:
                    if ('floor' == obj.wechatReduce) {
                        obj.payRealAmount = Math.floor( tool.safeDIC(payAmount, obj.coupon) );
                    } else {
                        obj.payRealAmount = tool.safeDIC(payAmount, obj.coupon);
                        if (obj.payRealAmount == 0) return alert('支付价格为0时只能使用现金!');
                    }
                    break;
                case 4:
                    if ('floor' == obj.alipayReduce) {
                        obj.payRealAmount = Math.floor( tool.safeDIC(payAmount, obj.coupon) );
                    } else {
                        obj.payRealAmount = tool.safeDIC(payAmount, obj.coupon);
                        if (obj.payRealAmount == 0) return alert('支付价格为0时只能使用现金!');
                    }
                    break;
            }
        }
        this.setState(obj);
    }
    handleChecked(checked) {
        if (this.state.checked === checked) return;
        this.calculate({checked:checked});
    }

    handleReduceChecked(key, value) {
        this.state[key] == value ? this.calculate({[key]:null}) : this.calculate({[key]:value});
    }

    getPayRealAmount(discount) {
        let items = this.state.items,
            len = items.length,
            temp = null,
            sum = 0;
        for (let i = 0;i < len;++i) {
            if (1 == items[i].has_discount && items[i].item_discount > discount) {
                temp = ( tool.mul(items[i].item_price, discount) / 10 );
                sum = tool.sum( sum, temp);
            } else {
                sum = tool.sum(sum, items[i].item_real_price);
            }
        }
        return sum;
    }

    render() {
        let state = this.state;
        return (
            <div>
                <Crumb data={[{key:0,value:'添加项目'},{key:1,value:'订单支付'}]} callback={this.props.changeView}/>
                <div className='m-container'>
                    <div className='order-pay-box'>
                        <div>
                            <div><span>应收：</span><span>&yen;&nbsp;{this.state.totalAmount}</span></div>
                            <div><span>品项折扣：</span><span>&yen;&nbsp;{this.state.reduceRealPrice}</span></div>
                            <div><span>代金券：</span><span>&yen;&nbsp;{this.state.coupon}</span></div>
                            <div><span>实收：</span><span className='m-red'>&yen;&nbsp;{this.state.payRealAmount}</span></div>
                        </div>
                        <Search2 btnVal='使用代金券' callback={this.useCoupon} placeholder='请输入代金券码'/>
                    </div>
                    <div className='m-box' style={{fontSize:'20px'}}>选择支付方式:</div>
                    <Gateway
                        checked={this.state.checked}
                        hasVip={1 == this.state.hasPlatform}
                        vipBalance={this.state.platform.cbalance}
                        hasMerchant={1 == this.state.hasMerchant}
                        merchantBalance={this.state.merchant.cbalance}
                        cashReduce={this.state.cashReduce}
                        wechatReduce={this.state.wechatReduce}
                        alipayReduce={this.state.alipayReduce}
                        onChecked={this.handleChecked}
                        onReduceChecked={this.handleReduceChecked}
                    />
                    <div className='m-box m-text-r'>
                        <button type='button' className='m-btn confirm middle' onClick={() => this.setState({cardVerifyShow:true})}>确认支付</button>
                    </div>
                </div>
                <Pay
                    show={this.state.show}
                    amount={this.state.payRealAmount}
                    status={this.state.status}
                    onClose={() => this.setState({show:false,status:'pay'})}
                    onConfirm={this.onConfirm}
                />
                <CardVerify show={this.state.cardVerifyShow} onClose={() => this.setState({cardVerifyShow:false})}/>
            </div>
        );
    }
}


class Gateway extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='m-box'>
                <div className='order-pay-row' style={{display:(this.props.hasVip ? 'block' : 'none')}}>
                    <span onClick={() => this.props.onChecked(0)}>
                        <i className={'fa ' + (0 == this.props.checked ? 'fa-check-circle' : 'fa-check-circle-o')}></i>
                        &nbsp;&nbsp;<span className='m-icon vip'>平台卡支付</span>&emsp;
                        <span className='m-small'>余额：&yen;{this.props.vipBalance}</span>
                    </span>
                </div>
                <div className='order-pay-row' style={{display:(this.props.hasMerchant ? 'block' : 'none')}}>
                    <span onClick={() => this.props.onChecked(1)}>
                        <i className={'fa ' + (1 == this.props.checked ? 'fa-check-circle' : 'fa-check-circle-o')}></i>
                        &nbsp;&nbsp;<span className='m-icon merchant'>专店卡支付</span>&emsp;
                        <span className='m-small'>余额：&yen;{this.props.merchantBalance}</span>
                    </span>
                </div>
                <div className='order-pay-row'>
                    <span onClick={() => this.props.onChecked(2)}>
                        <i className={'fa ' + (2 == this.props.checked ? 'fa-check-circle' : 'fa-check-circle-o')}></i>
                        &nbsp;&nbsp;<span className='m-icon cash'>现&nbsp;金&nbsp;&nbsp;支&nbsp;付</span>
                        &emsp;
                        <Radio 
                            checked={'special' == this.props.cashReduce}
                            value='special' 
                            onClick={value => this.props.onReduceChecked('cashReduce', value)}
                        >特殊折扣</Radio>
                        &emsp;
                        <Radio
                            checked={'floor' == this.props.cashReduce}
                            value='floor'
                            onClick={value => this.props.onReduceChecked('cashReduce', value)}
                        >取整抹零</Radio>
                        &emsp;
                        <Radio
                            checked={'free' == this.props.cashReduce}
                            value='free'
                            onClick={value => this.props.onReduceChecked('cashReduce', value)}
                        >免洗</Radio>
                    </span>
                </div>
                <div className='order-pay-row'>
                    <span onClick={() => this.props.onChecked(3)}>
                        <i className={'fa ' + (3 == this.props.checked ? 'fa-check-circle' : 'fa-check-circle-o')}></i>
                        &nbsp;&nbsp;<span className='m-icon wechat'>微&nbsp;信&nbsp;&nbsp;支&nbsp;付</span>
                        &emsp;
                        <Radio
                            checked={'special' == this.props.wechatReduce}
                            value='special'
                            onClick={value => this.props.onReduceChecked('wechatReduce', value)}
                        >特殊折扣</Radio>
                        &emsp;
                        <Radio
                            checked={'floor' == this.props.wechatReduce}
                            value='floor'
                            onClick={value => this.props.onReduceChecked('wechatReduce', value)}
                        >取整抹零</Radio>
                    </span>
                </div>
                <div className='order-pay-row'>
                    <span onClick={() => this.props.onChecked(4)}>
                        <i className={'fa ' + (4 == this.props.checked ? 'fa-check-circle' : 'fa-check-circle-o')}></i>
                        &nbsp;&nbsp;<span className='m-icon alipay'>支付宝支付</span>
                        &emsp;
                        <Radio
                            checked={'special' == this.props.alipayReduce}
                            value='special'
                            onClick={value => this.props.onReduceChecked('alipayReduce', value)}
                        >特殊折扣</Radio>
                        &emsp;
                        <Radio
                            checked={'floor' == this.props.alipayReduce}
                            value='floor'
                            onClick={value => this.props.onReduceChecked('alipayReduce', value)}
                        >取整抹零</Radio>
                    </span>
                </div>
            </div>
        );
    }
}