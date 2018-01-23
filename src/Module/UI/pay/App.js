/**
 * 支付框组件
 * @author yangyunlong
 */
import React from 'react';
import './App.css';
//支付提示框    onClose=取消操作    onConfirm=确认操作   onFree=免洗操作
//show=true/false    status=pay/loading/fail/success/free     amount=支付金额 
export default class extends React.Component{
    constructor(props) {
        super(props);
        this.state = {authCode:['','','','']}
        this.input = [];
        this.onClose = this.onClose.bind(this);
        this.setAuthCode = this.setAuthCode.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
    }
    onClose() {
        this.setState({authCode:['','','','']});
        this.props.onClose();
    }
    componentDidMount() {
        this.input[3].onkeydown = ( e => {'Enter' === e.code && this.onConfirm()} )
    }
    
    setAuthCode(e) {
        let value = e.target.value,
            index = Number(e.target.dataset.index),
            len = value.length;
        (3 !== index && 4 === len) && this.input[index + 1].focus();
        if (( 3 !== index && 4 >= len ) || ( 3 === index && 6 >= len )) {
            this.state.authCode[index] = value
            this.setState({authCode:this.state.authCode});
        }
    }

    onConfirm() {
        let authCode = this.state.authCode;
        if (
            4 === authCode[0].length && !isNaN(authCode[0])
            &&
            4 === authCode[1].length && !isNaN(authCode[1])
            &&
            4 === authCode[2].length && !isNaN(authCode[1])
            &&
            6 === authCode[3].length && !isNaN(authCode[1])
        ) this.props.onConfirm((authCode[0] + authCode[1] + authCode[2] + authCode[3]));
    }

    render() {
        let status = this.props.status,
            authCode = this.state.authCode; 
        return (
            <div className='m-layer-bg' style={{display:(this.props.show ? 'block' : 'none')}}>
                <div className='pay'>
                    <i className='m-close' onClick={this.onClose}></i>
                    <div className='m-bg-linear'><span className='m-pay'>支付</span></div>
                    <div className='pay-box' style={{display:('pay' === status ? 'block' : 'none')}}>
                        <div className='amount'>支付金额：<span>{this.props.amount}</span></div>
                        <div className='pay-notice'>输入付款码或扫描支付码</div>
                        <div className='input-box'>
                            <input type='text' value={authCode[0]} onChange={this.setAuthCode} data-index='0' ref={input => this.input[0] = input}/>
                            <input type='text' value={authCode[1]} onChange={this.setAuthCode} data-index='1' ref={input => this.input[1] = input}/>
                            <input type='text' value={authCode[2]} onChange={this.setAuthCode} data-index='2' ref={input => this.input[2] = input}/>
                            <input type='text' value={authCode[3]} onChange={this.setAuthCode} data-index='3' ref={input => this.input[3] = input}/>
                        </div>
                        <div className='m-text-c'>
                            <button type='button' className='m-btn gradient lightblue middle' onClick={this.onConfirm}>确认</button>
                        </div>
                    </div>
                    <div className='pay-box' style={{display:('loading' === status ? 'block' : 'none')}}>
                        <img src='./img/loading.gif'/><div className='word'>支付中...</div>
                    </div>
                    <div className='pay-box' style={{display:('success' === status ? 'block' : 'none')}}>
                        <img src='./img/pay-success.png'/><div className='word success'>支付成功</div>
                    </div>
                    <div className='pay-box' style={{display:('fail' === status ? 'block' : 'none')}}>
                        <img src='./img/pay-fail.png'/><div className='word'>支付失败!</div>
                    </div>
                    <div className='pay-box' style={{display:('free' === status ? 'block' : 'none')}}>
                        <div className='word free'>免洗订单将不会支付任何金额，此订单确认免洗吗？</div>
                        <div className='m-text-c'>
                            <button type='button' className='m-btn gradient lightblue middle' onClick={this.props.onFree}>确认</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
