/**
 * 订单支付组件
 * @author yangyunlong
 */
const {ipcRenderer} = window.require('electron');
import React, {Component} from 'react';
import {Search2, PayMent} from '../static/UI';

class Pay extends Component {
    constructor(props) {
        super(props);
        console.log(this.props);
        this.params = this.props.param.paramToObject();
        //this.params = {id:'1596',from:'offline'};
        console.log(this.params);
        this.id = this.params.id;
        this.state = {
            amount:'0',discount:'0',realAmount:0,payment:'',
            reduce:10,reduceAmount:0,voucher:0,voucher_id:null,
            vipExist:1,merchantExist:1,vipBalance:0,merchantBalance:0,
            vipDiscount:10,merchantDiscount:10,vip_id:null,
            isShow:false,paymentStatus:'payment',user_id:null,
        };
        this.toggleChecked = this.toggleChecked.bind(this);    //切换支付方式
        this.toggleReduce = this.toggleReduce.bind(this);    //切换折扣方式
        this.specialChange = this.specialChange.bind(this);    //修改特殊折扣
        this.bindDiscount = this.bindDiscount.bind(this);
        this.onOnlinePayRequest = this.onOnlinePayRequest.bind(this);
        this.onPayRequest = this.onPayRequest.bind(this);
        this.onFreeRequest = this.onFreeRequest.bind(this);
        this.afterPay = this.afterPay.bind(this);
    }

    componentDidMount() {
        axios.post(api.U('orderPay'),api.data({token:this.props.token,order_id:this.id}))
        .then((response) => {
            let result = response.data.data,
                merchant = result.merchantCard,
                vip = result.platformCard,
                order = result.order;
            this.setState({
                amount:order.total_amount,
                discount:order.reduce_price,
                realAmount:func.difference(order.total_amount,order.reduce_price),
                vipExist:vip.card_exist,
                merchantExist:merchant.card_exist,
                vipBalance:vip.card_sum,
                merchantBalance:merchant.balance,
                vipDiscount:vip.card_discount,
                vip_id:vip.id,
                user_id:order.userid,
                merchantDiscount:merchant.discount,
            });
            console.log(result);
        });
    }

    toggleChecked(e) {
        let target = e.target,
            state = this.state,
            amount = state.amount;
        console.log(target.dataset.payment);
        if (
            !target.classList.contains('ui-checked2') 
            && 
            target.classList.contains('ui-checkbox2')
        ) {
            let payment = target.dataset.payment;
            if ('vip' == payment) {    //专店会员卡
                let realAmount = Number(((amount * 100 - state.voucher *100) * state.vipDiscount) / 10) /100;
                this.setState({realAmount:realAmount});
            } else if ('merchant' == payment) {    //商家会员卡
                let realAmount = Number(((amount * 100 - state.voucher *100) * state.merchantDiscount) / 10) /100;
                this.setState({realAmount:realAmount});
            } else if (
                'cash' == payment || 'wechat' == payment || 'alipay' == payment
            ) {    //现金
                if ('free' == state.reduce) {
                    this.setState({realAmount:amount});
                } else if ('special' == state.reduce) {
                    this.setState({realAmount:state.reduceAmount})
                } else if ('ceil' == state.reduce) {
                    this.setState({realAmount:(Number(amount * 100  - state.voucher * 100) / 100)});
                } else {
                    let realAmount = Number(((amount * 100 - state.voucher *100) * state.reduce) / 10) / 100;
                    this.setState({realAmount:realAmount});
                }
            }
            this.setState({payment:payment});
        }
    }

    onPayRequest() {
        let state = this.state,
            props = this.props;
        if (0 == state.realAmount) {
            this.setState({isShow:true,paymentStatus:'free'});
        } else {
            if ('vip' == state.payment) {
                axios.post(
                    api.U('sendPayRequest'),
                    api.D({
                        token:props.token,
                        type:'MEMBER_CARD',
                        order_id:this.id,
                        state:'1',
                        card_id:state.vip_id,
                        amount:state.realAmount,
                    })
                )
                .then(response => {
                    if (api.verify(response.data)) {
                        this.afterPay();
                        props.changeView({element:'index'});
                    }
                    console.log(response.data);
                });
            } else if ('merchant' == state.payment) {
                axios.post(
                    api.U('sendPayRequest'),
                    api.D({
                        token:props.token,
                        type:'MERCHANT_CARD',
                        state:'1',
                        order_id:this.id,
                        amount:state.realAmount,
                    })
                )
                .then(response => {
                    if (api.verify(response.data)) {
                        this.afterPay();
                        props.changeView({element:'index'});
                    }
                    console.log(response.data);
                });
            } else if ('cash' == state.payment) {
                axios.post(
                    api.U('sendPayRequest'),
                    api.D({
                        token:props.token,
                        type:'CASH',
                        state:'1',
                        order_id:this.id,
                        amount:state.realAmount,
                    })
                )
                .then(response => {
                    if (api.verify(response.data)) {
                        this.afterPay();
                        props.changeView({element:'index'});
                    }
                    console.log(response.data);
                });
            } else if ('wechat' == state.payment || 'alipay' == state.payment) {
                this.setState({isShow:true,paymentStatus:'payment'});
            }
        }
        console.log(state.realAmount);
    }

    onFreeRequest() {
        let state = this.state,
            props = this.props;
        if (0 == state.realAmount) {
            if ('cash' == state.payment && 'free' == state.reduce) {
                this.setState({paymentStatus:'loading'});
                axios.post(
                    api.U('sendPayRequest'),
                    api.D({
                        token:props.token,
                        type:'CASH',
                        state:'0',
                        order_id:this.id,
                        amount:state.realAmount,
                    })
                )
                .then(response => {
                    if (api.verify(response.data)) {
                        this.afterPay();
                        this.setState({paymentStatus:'success'});
                        props.changeView({element:'index'});
                    }
                    console.log(response.data);
                });
            }
        }
    }

    onOnlinePayRequest(authcode) {
        let state = this.state,
            props = this.props;
        if (0 == state.realAmount) return;
        if ('wechat' == state.payment) {
            this.setState({paymentStatus:'loading'});
            axios.post(
                api.U('sendPayRequest'),
                api.D({
                    token:props.token,
                    type:'WECHAT',
                    state:'1',
                    order_id:this.id,
                    auth_code:authcode,
                    amount:state.realAmount,
                })
            )
            .then(response => {
                if (api.verify(response.data)) {
                    this.afterPay();
                    this.setState({paymentStatus:'success'});
                    props.changeView({element:'index'});
                } else {
                    this.setState({paymentStatus:'fail'});
                }
                console.log(response.data);
            });
        } else if ('alipay' == state.payment) {
            this.setState({paymentStatus:'loading'});
            axios.post(
                api.U('sendPayRequest'),
                api.D({
                    token:props.token,
                    type:'ALI',
                    state:'1',
                    order_id:this.id,
                    auth_code:authcode,
                    amount:state.realAmount,
                })
            )
            .then(response => {
                if (api.verify(response.data)) {
                    this.afterPay();
                    this.setState({paymentStatus:'success'});
                    props.changeView({element:'index'});
                } else {
                    this.setState({paymentStatus:'fail'});
                }
                console.log(response.data);
            });
        }
    }

    //结算完成后打印订单及发送代金券使用请求
    afterPay() {
        let props = this.props,
            state = this.state;

        //
        //打印操作
        //
        let printView = 'public/prints/index.html';
        if ('invoice' == props.branch) {
            printView = 'public/prints/invoice.html';
        }
        ipcRenderer.send(
            'print-silent',
            printView,
            {uid:props.uid,order_id:this.id,token:this.props.token}
        );
        if (null != state.voucher_id) {
            axios.post(
                api.U('afterPayUseVoucher'),
                api.D({
                    token:props.token,
                    uid:props.uid,
                    user_id:state.user_id,
                    orderid:this.id,
                    couponid:state.voucher_id
                }))
            .then(response => {

            });
        }
    }

    toggleReduce(e) {
        let target = e.target,
            reduce = target.dataset.reduce,
            state = this.state,
            amount = state.amount;
        console.log(reduce);
        if (
            !target.classList.contains('ui-radio-checked') 
            && 
            target.classList.contains('ui-radio')
        ) {
            if ('free' == reduce) {
                this.setState({realAmount:amount,reduce:reduce});
            } else if ('special' == reduce) {
                this.setState({realAmount:state.reduceAmount,reduce:reduce})
            } else if ('ceil' == reduce) {
                this.setState({realAmount:(Number(amount * 100 - state.voucher * 100) / 100),reduce:reduce});
            } else {
                let realAmount = Number(((amount * 100 - state.voucher * 100) * reduce) / 10) / 100;
                this.setState({realAmount:realAmount,reduce:reduce});
            }
        }
    }

    specialChange(e) {
        let value = e.target.value;
        if (!isNaN(value)) {
            console.log(e.target.value);
            this.setState({reduceAmount:value,realAmount:value});
        }
    }
    bindDiscount(word) {
        let props = this.props;
        if ('' != word) {
            axios.post(
                api.U('useVoucher'),
                api.D({token:props.token,uid:props.uid,number:word})
            )
            .then(response => {
                console.log(response.data);
                if (api.verify(response.data)) {
                    let result = response.data.data,
                        realAmount = (this.state.realAmount * 100 - result.value * 100) / 100;
                    this.setState({voucher:result.value,voucher_id:result.id,realAmount:realAmount});
                }
            });
        }
        console.log(word);
    }

    render() {
        let state = this.state;
        return (
            <div>
                <div style={{padding:'0 20px'}}>
                    <div className='ui-pay-amount'>
                        <div>
                            <div style={{padding:'23px 0',fontSize:'18px',color:'#999'}}>请输入代金券码：</div>
                            <Search2 button='绑定并使用' callback={this.bindDiscount}/>
                        </div>
                        <div>
                            <div className='ui-pay-amount-area'>
                                <span>应收：</span><span>&yen;{state.amount}</span>
                            </div>
                            <div className='ui-pay-amount-area'>
                                <span>品项折扣：</span><span>&yen;{state.discount}</span>
                            </div>
                            <div className='ui-pay-amount-area'>
                                <span>代金券：</span><span>&yen;{state.voucher}</span>
                            </div>
                        </div>
                        {/* <div>
                            <span className='ui-pay-prefix'>&emsp;应收：</span>
                            <span style={{fontSize:'24px'}}>&yen;{state.amount}</span>
                        </div>
                        <div>
                            <span className='ui-pay-prefix'>品项折扣：</span>
                            <span style={{fontSize:'24px',color:'#fe5c4c'}}>
                                &minus;&nbsp;&yen;{state.discount}
                            </span>
                        </div>
                        <div>
                            <span className='ui-pay-prefix'>实收：</span>
                            <span style={{fontSize:'30px',color:'#ff0000'}}>&yen;{state.realAmount}&emsp;</span>
                        </div> */}
                    </div>
                    <div className='ui-pay-amount-area' style={{justifyContent:'flex-end',paddingTop:'24px'}}>
                        <span>实收：</span>
                        <span style={{color:'#fd3333',fontSize:'24px'}}>&yen;{state.realAmount}</span>
                    </div>
                </div>
                <div style={{padding:'16px 20px 0'}}>
                    <div style={{fontSize:'20px',color:'#999999',padding:'0 0 24px 13px'}}>选择支付方式</div>
                    <div className='ui-pay-row' style={{display:(1 == state.vipExist ? 'block' : 'none')}}>
                        <section 
                            className={'ui-checkbox2' + ('vip' == state.payment ? ' ui-checked2' : '')} 
                            data-payment='vip' 
                            onClick={this.toggleChecked}
                        >
                            <em className='ui-pay-icon-vip'></em>
                            <span className='ui-pay-payment'>平台会员卡支付</span>
                            <span className='ui-pay-postfix'>可用余额：&yen;{state.vipBalance}</span>
                        </section>
                    </div>
                    <div className='ui-pay-row' style={{display:(1 == state.merchantExist ? 'block' : 'none')}}>
                        <section 
                            className={'ui-checkbox2' + ('merchant' == state.payment ? ' ui-checked2' : '')} 
                            data-payment='merchant' 
                            onClick={this.toggleChecked}
                        >
                            <em className='ui-pay-icon-merchant'></em>
                            <span className='ui-pay-payment'>专店会员卡支付</span>
                            <span className='ui-pay-postfix'>可用余额：&yen;{state.merchantBalance}</span>
                        </section>
                    </div>
                    <div className='ui-pay-row'>
                        <section 
                            className={'ui-checkbox2' + ('cash' == state.payment ? ' ui-checked2' : '')} 
                            data-payment='cash' 
                            onClick={this.toggleChecked}
                        >
                            <em className='ui-pay-icon-cash'></em>
                            <span className='ui-pay-payment'>现金支付</span>
                        </section>
                        <div className='ui-pay-radio-container' style={{display:('cash' == state.payment ? 'block' : 'none')}}>
                            <span 
                                className={'ui-radio' + ('9' == state.reduce ? ' ui-radio-checked' : '')}
                                data-reduce='9'
                                onClick={this.toggleReduce}
                            >
                                九折
                            </span>
                            <span 
                                className={'ui-radio' + ('8' == state.reduce ? ' ui-radio-checked' : '')}
                                data-reduce='8'
                                onClick={this.toggleReduce}
                            >
                                八折
                            </span>
                            <span 
                                className={'ui-radio' + ('7' == state.reduce ? ' ui-radio-checked' : '')}
                                data-reduce='7'
                                onClick={this.toggleReduce}
                            >
                                七折
                            </span>
                            <span 
                                className={'ui-radio' + ('special' == state.reduce ? ' ui-radio-checked' : '')}
                                data-reduce='special'
                                onClick={this.toggleReduce}
                            >
                                特殊折扣：
                                <input type='text' className='ui-input2' value={state.reduceAmount} onChange={this.specialChange}/>
                                &nbsp;元
                            </span>
                            <span 
                                className={'ui-radio' + ('ceil' == state.reduce ? ' ui-radio-checked' : '')}
                                data-reduce='ceil'
                                onClick={this.toggleReduce}
                            >
                                取证抹零
                            </span>
                            <span 
                                className={'ui-radio' + ('free' == state.reduce ? ' ui-radio-checked' : '')}
                                data-reduce='free'
                                onClick={this.toggleReduce}
                            >
                                免洗
                            </span>
                        </div>
                    </div>
                    <div className='ui-pay-row'>
                        <section 
                            className={'ui-checkbox2' + ('wechat' == state.payment ? ' ui-checked2' : '')} 
                            data-payment='wechat' 
                            onClick={this.toggleChecked}
                        >
                            <em className='ui-pay-icon-wechat'></em>
                            <span className='ui-pay-payment'>微信支付</span>
                        </section>
                        <div className='ui-pay-radio-container' style={{display:('wechat' == state.payment ? 'block' : 'none')}}>
                            <span 
                                className={'ui-radio' + ('9' == state.reduce ? ' ui-radio-checked' : '')}
                                data-reduce='9'
                                onClick={this.toggleReduce}
                            >
                                九折
                            </span>
                            <span 
                                className={'ui-radio' + ('8' == state.reduce ? ' ui-radio-checked' : '')}
                                data-reduce='8'
                                onClick={this.toggleReduce}
                            >
                                八折
                            </span>
                            <span 
                                className={'ui-radio' + ('7' == state.reduce ? ' ui-radio-checked' : '')}
                                data-reduce='7'
                                onClick={this.toggleReduce}
                            >
                                七折
                            </span>
                            <span 
                                className={'ui-radio' + ('special' == state.reduce ? ' ui-radio-checked' : '')}
                                data-reduce='special'
                                onClick={this.toggleReduce}
                            >
                                特殊折扣：
                                <input type='text' className='ui-input2' value={state.reduceAmount} onChange={this.specialChange}/>
                                &nbsp;元
                            </span>
                            <span 
                                className={'ui-radio' + ('ceil' == state.reduce ? ' ui-radio-checked' : '')}
                                data-reduce='ceil'
                                onClick={this.toggleReduce}
                            >
                                取证抹零
                            </span>
                        </div>
                    </div>
                    <div className='ui-pay-row'>
                        <section 
                            className={'ui-checkbox2' + ('alipay' == state.payment ? ' ui-checked2' : '')} 
                            data-payment='alipay' 
                            onClick={this.toggleChecked}
                        >
                            <em className='ui-pay-icon-alipay'></em>
                            <span className='ui-pay-payment'>支付宝支付</span>
                        </section>
                        <div className='ui-pay-radio-container' style={{display:('alipay' == state.payment ? 'block' : 'none')}}>
                            <span 
                                className={'ui-radio' + ('9' == state.reduce ? ' ui-radio-checked' : '')}
                                data-reduce='9'
                                onClick={this.toggleReduce}
                            >
                                九折
                            </span>
                            <span 
                                className={'ui-radio' + ('8' == state.reduce ? ' ui-radio-checked' : '')}
                                data-reduce='8'
                                onClick={this.toggleReduce}
                            >
                                八折
                            </span>
                            <span 
                                className={'ui-radio' + ('7' == state.reduce ? ' ui-radio-checked' : '')}
                                data-reduce='7'
                                onClick={this.toggleReduce}
                            >
                                七折
                            </span>
                            <span 
                                className={'ui-radio' + ('special' == state.reduce ? ' ui-radio-checked' : '')}
                                data-reduce='special'
                                onClick={this.toggleReduce}
                            >
                                特殊折扣：
                                <input type='text' className='ui-input2' value={state.reduceAmount} onChange={this.specialChange}/>
                                &nbsp;元
                            </span>
                            <span 
                                className={'ui-radio' + ('ceil' == state.reduce ? ' ui-radio-checked' : '')}
                                data-reduce='ceil'
                                onClick={this.toggleReduce}
                            >
                                取证抹零
                            </span>
                        </div>
                    </div>
                    <div style={{padding:'45px 0 0 110px'}}>
                        <input 
                            type='button' 
                            value='立即支付' 
                            className='ui-btn ui-btn-confirm ui-btn-large'
                            onClick={this.onPayRequest}
                        />
                    </div>
                </div>
                <PayMent 
                    isShow={state.isShow}
                    status={state.paymentStatus}
                    amount={state.realAmount}
                    free='免洗订单将不会支付任何金额，此订单确定免洗吗？'
                    onCancelRequest={() => this.setState({isShow:false,paymentStatus:'payment'})}
                    onFreeRequest={this.onFreeRequest}
                    onConfirmRequest={this.onOnlinePayRequest}
                />
            </div>
        );
    }
}

export default Pay;