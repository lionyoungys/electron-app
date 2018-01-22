/**
 * 支付框组件
 * @author yangyunlong
 */
import React from 'react';
import './App.css';
//支付提示框    onCancelRequest=取消操作    onConfirmRequest=确认操作    onFreeRequest=免洗操作
//isShow=true/false    status=payment/loading/fail/success/free    free=免费时显示字段    amount=支付金额
export default class extends React.Component{
    constructor(props) {
        super(props);
        this.state = {authcode:['','','','']}
        this.input = [];
        this.paymentStatus = this.paymentStatus.bind(this);
        this.setAuthCode = this.setAuthCode.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.enterListener = this.enterListener.bind(this);
    }

    enterListener(input) {
        this.input[3] = input;
        if (func.isSet(input)) {
            input.onkeydown = e => {if ('Enter' === e.code) this.onConfirm();}
        }
    }
    
    setAuthCode(e) {
        let value = e.target.value, len = value.length,
            index = Number(e.target.dataset.index),
            authcode = this.state.authcode,autoSubmit = false;
        if (3 !== index && 4 == len) this.input[index + 1].focus();    //判断是否为前三个输入框
        this.state.authcode[index] = value
        this.setState({authcode:this.state.authcode});
    }

    onConfirm() {
        let authcode = this.state.authcode;
        if (
            4 === authcode[0].length
            &&
            4 === authcode[1].length
            &&
            4 === authcode[2].length
            &&
            6 === authcode[3].length
        ) {
            this.props.onConfirmRequest(
                (authcode[0] + authcode[1] + authcode[2] + authcode[3]),
                this.props.amount
            );
        }
    }

    paymentStatus() {
        const status = {}, 
              props = this.props, 
              state = this.state,
              center = {alignItems:'center',justifyContent:'center'};
        // 支付
        status.payment = (
            <div className='ui-payment-box' style={{flexDirection:'column'}}>
                <div 
                    style={{margin:'24px 0 30px 6px',fontSize:'18px',color:'#333'}}
                >支付金额：<span style={{fontSize:'22px',color:'#ff3413'}}>{props.amount}</span></div>
                <div 
                    style={{margin:'0 0 12px 6px',fontSize:'16px',color:'#b2b2b2'}}
                >输入付款码或扫描支付码</div>
                <div className='ui-payment-input-box'>
                    <input 
                        type='text' 
                        value={state.authcode[0]} 
                        onChange={this.setAuthCode} 
                        maxLength='4'
                        data-index='0'
                        autoFocus
                        ref={input => this.input[0] = input}
                    />
                    <input 
                        type='text' 
                        value={state.authcode[1]} 
                        onChange={this.setAuthCode} 
                        maxLength='4'
                        data-index='1'
                        ref={input => this.input[1] = input}
                    />
                    <input 
                        type='text' 
                        value={state.authcode[2]} 
                        onChange={this.setAuthCode} 
                        maxLength='4'
                        data-index='2'
                        ref={input => this.input[2] = input}
                    />
                    <input 
                        type='text' 
                        value={state.authcode[3]} 
                        onChange={this.setAuthCode} 
                        data-index='3'
                        maxLength='6'
                        ref={this.enterListener}
                    />
                </div>
                <div style={{textAlign:'center'}}>
                    <input type='button' className='ui-teamwork-confirm' onClick={this.onConfirm}/>
                </div>
            </div>
        );
        // 支付中
        status.loading = (
            <div className='ui-payment-box' style={center}>
                <div>
                    <div className='ui-payment-loading'></div>
                    <div style={{marginTop:'33px',fontSize:'20px',color:'#b2b2b2',textAlign:'center'}}>支付中</div>
                </div>
            </div>
        );
        // 失败
        status.fail = (
            <div className='ui-payment-box' style={center}>
                <div>
                    <div className='ui-payment-fail'></div>
                    <div style={{marginTop:'24px',fontSize:'22px',color:'#b2b2b2',textAlign:'center'}}>支付失败</div>
                </div>
            </div>
        );
        // 成功
        status.success = (
            <div className='ui-payment-box' style={center}>
                <div>
                    <div className='ui-payment-success'></div>
                    <div style={{marginTop:'22px',fontSize:'22px',color:'#26a4da',textAlign:'center'}}>支付成功</div>
                </div>
            </div>
        );
        // 免费
        status.free = (
            <div className='ui-payment-box' style={{flexDirection:'column'}}>
                <div style={{width:'318px',padding:'42px 20px',lineHeight:'30px',fontSize:'16px',color:'#333'}}>{props.free}</div>
                <div style={{textAlign:'center'}}>
                    <input type='button' className='ui-teamwork-confirm' onClick={props.onFreeRequest}/>
                </div>
            </div>
        );

        return func.isSet(props.status) ? status[props.status] : status.payment;
    }

    render() {
        let props = this.props,
            state = this.state;
        if (!props.isShow) return null;
        return (
            <section className='ui-fixed-bg'>
                <div className='ui-payment'>
                    <div className='ui-mm-layer-title'>
                        <em className='ui-mm-icon-payment'>用户支付</em>
                        <em className='ui-close3' onClick={() => {this.setState({authcode:['','','','']});props.onCancelRequest();}}></em>
                    </div>
                    {this.paymentStatus()}
                </div>
            </section>
        );
    }
}
