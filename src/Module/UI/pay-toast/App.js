/**
 * 支付框组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import './App.css';
//支付提示框    onClose=取消操作    onConfirm=确认操作   onFree=免洗操作
//show=true/false    status=pay/loading/fail/success/free     amount=支付金额 
export class CardVerify extends Component{
    constructor(props) {
        super(props);
        this.state = {value:'',text:'获取验证码'};
        this.interval = null;
        this.handleClick = this.handleClick.bind(this);
        this.handleSend = this.handleSend.bind(this);
    }
    handleClick() {
        '' !== this.state.value && this.props.callback(this.state.value);
    }
    handleSend() {
         if (isNaN(this.state.text)) {
            this.setState({text:60});
            this.interval = setInterval(
                () => {
                    let countdown = (this.state.text - 1);
                    if (countdown <= 0) {
                        clearInterval(this.interval);
                        return this.setState({text:'获取验证码'});
                    }
                    this.setState({text:countdown});
                },
                1000
            );
            this.props.onSend();
         }
     }
     componentWillUnmount() {
         null !== this.interval && clearInterval(this.interval);
     }

    render() {
        if (!this.props.show) return null;
        return (
            <div className='m-layer-bg'>
                <div className='pay-toast'>
                    <i className='m-close' onClick={this.props.onClose}></i>
                    <div><span className='m-pay'>会员卡支付</span></div>
                    <div className='card-verify'>
                        <span style={{color:'#999'}}>需要验证客户手机号：</span>
                        <span style={{color:'#ff6e42'}}>{this.props.phone}</span>
                    </div>
                    <div className='sms-code'>
                        <label htmlFor='smsCode'>验证码：</label>
                        <input id='smsCode' type='text' value={this.state.value} onChange={e => this.setState({value:e.target.value})}/>
                        &emsp;
                        <span onClick={this.handleSend}>{this.state.text}{isNaN(this.state.text)? null : ' 秒'}</span>
                    </div>
                    <div className='card-verify'>
                        <button type='button' className='m-btn gradient lightblue middle' onClick={this.handleClick}>确认</button>
                    </div>
                </div>
            </div>
        );
    }
}

export class SpecialVerify extends Component{
    constructor(props) {
        super(props);
        this.state = {value:'',text:'获取验证码',amount:''};
        this.interval = null;
        this.handleClick = this.handleClick.bind(this);
        this.handleSend = this.handleSend.bind(this);
    }
    handleClick() {
        if ('' !== this.state.value && !isNaN(this.state.amount)) {
            this.props.callback(this.state.value,this.state.amount);
        }
    }
    handleSend() {
         if (isNaN(this.state.text)) {
            this.setState({text:60});
            this.interval = setInterval(
                () => {
                    let countdown = (this.state.text - 1);
                    if (countdown <= 0) {
                        clearInterval(this.interval);
                        return this.setState({text:'获取验证码'});
                    }
                    this.setState({text:countdown});
                },
                1000
            );
            this.props.onSend();
         }
     }
     componentWillUnmount() {
         null !== this.interval && clearInterval(this.interval);
     }

    render() {
        if (!this.props.show) return null;
        return (
            <div className='m-layer-bg'>
                <div className='pay-toast'>
                    <i className='m-close' onClick={this.props.onClose}></i>
                    <div><span className='m-pay'>特殊折扣</span></div>
                    <div className='special-verify'>
                        <span style={{color:'#999'}}>需要验证店长手机号：</span>
                        <span style={{color:'#ff6e42'}}>{this.props.phone}</span>
                    </div>
                    <div className='special-amount'>
                        <label htmlFor='special-amount'>折扣金额：</label>
                        <input id='special-amount' type='text' value={this.state.amount} onChange={e => this.setState({amount:e.target.value})}/>
                        &emsp;<span>元</span>
                    </div>
                    <div className='sms-code'>
                        <label htmlFor='smsCode'>验&nbsp;&nbsp;证&nbsp;&nbsp;码：</label>
                        <input id='smsCode' type='text' value={this.state.value} onChange={e => this.setState({value:e.target.value})}/>
                        &emsp;
                        <span onClick={this.handleSend}>{this.state.text}{isNaN(this.state.text)? null : ' 秒'}</span>
                    </div>
                    <div style={{textAlign:'center',marginTop:'20px'}}>
                        <button type='button' className='m-btn gradient lightblue middle' onClick={this.handleClick}>确认</button>
                    </div>
                </div>
            </div>
        );
    }
}

export class FreeVerify extends Component{
    constructor(props) {
        super(props);
        this.state = {value:'',text:'获取验证码'};
        this.interval = null;
        this.handleClick = this.handleClick.bind(this);
        this.handleSend = this.handleSend.bind(this);
    }
    handleClick() {
        '' !== this.state.value && this.props.callback(this.state.value);
    }
    handleSend() {
         if (isNaN(this.state.text)) {
            this.setState({text:60});
            this.interval = setInterval(
                () => {
                    let countdown = (this.state.text - 1);
                    if (countdown <= 0) {
                        clearInterval(this.interval);
                        return this.setState({text:'获取验证码'});
                    }
                    this.setState({text:countdown});
                },
                1000
            );
            this.props.onSend();
         }
     }
     componentWillUnmount() {
         null !== this.interval && clearInterval(this.interval);
     }
    render() {
        if (!this.props.show) return null;
        return (
            <div className='m-layer-bg'>
                <div className='pay-toast'>
                    <i className='m-close' onClick={this.props.onClose}></i>
                    <div><span className='m-pay'>免洗</span></div>
                    <div style={{textAlign:'center',marginTop:'20px'}}>免洗将不会支付任何金额</div>
                    <div className='special-verify'>
                        <span style={{color:'#999'}}>需要验证店长手机号：</span>
                        <span style={{color:'#ff6e42'}}>{this.props.phone}</span>
                    </div>
                    <div className='sms-code'>
                        <label htmlFor='smsCode'>验证码：</label>
                        <input id='smsCode' type='text' value={this.state.value} onChange={e => this.setState({value:e.target.value})}/>
                        &emsp;
                        <span onClick={this.handleSend}>{this.state.text}{isNaN(this.state.text)? null : ' 秒'}</span>
                    </div>
                    <div style={{textAlign:'center',marginTop:'40px'}}>
                        <button type='button' className='m-btn gradient lightblue middle' onClick={this.handleClick}>确认</button>
                    </div>
                </div>
            </div>
        );
    }
}