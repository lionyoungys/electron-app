/**
 * 订单支付组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import '../static/api';
import Crumbs from '../static/UI';

class Pay extends Component {
    constructor(props) {
        super(props);
        this.params = this.props.param.paramToObject();
        console.log(this.params);
        this.id = this.params.id;
        this.crumbs = [
            {text:'收衣',key:0,e:'take'},
            {text:'添加项目',key:1,e:'item',param:this.props.param},
            {text:'工艺加价',key:2,e:'craft',param:this.props.param},
            {text:'衣物检查',key:3,e:'check',param:this.props.param},
            {text:'订单支付',key:4}
        ];
        this.state = {
            amount:'0',discount:'0',realAmount:'0',payment:'',
            reduce:'',reduceAmount:'',
            vipExist:1,merchantExist:1,vipBalance:0,merchantBalance:0
        };
        this.toggleChecked = this.toggleChecked.bind(this);    //切换支付方式
        this.toggleReduce = this.toggleReduce.bind(this);    //切换折扣方式
        this.specialChange = this.specialChange.bind(this);    //修改特殊折扣
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
                merchantBalance:merchant.balance
            });
            console.log(result);
            console.log('=====================');
            console.log(order);
        });
    }

    toggleChecked(e) {
        let target = e.target;
        if (
            !target.classList.contains('ui-checked2') 
            && 
            target.classList.contains('ui-checkbox2')
        ) {
            this.setState({payment:target.dataset.payment});
        }
    }

    toggleReduce(e) {
        let target = e.target;
        if (
            !target.classList.contains('ui-radio-checked') 
            && 
            target.classList.contains('ui-radio')
        ) {
            this.setState({reduce:target.dataset.reduce});
        }
    }

    specialChange(e) {
        this.setState({reduceAmount:e.target.value});
    }

    render() {
        let state = this.state;
        return (
            <div>
                <Crumbs crumbs={this.crumbs} callback={this.props.changeView}/>
                <div style={{padding:'0 20px'}}>
                    <div className='ui-pay-amount'>
                        <div>
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
                        </div>
                    </div>
                </div>
                <div style={{padding:'36px 20px 0'}}>
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
                                元
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
                                元
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
                                元
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
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default Pay;