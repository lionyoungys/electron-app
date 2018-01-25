/**
 * 发送短信验证码弹框组件
 * @author yangyunlong
 */
import React from 'react';
import './App.css';

//onClose show number value onSendRequest callback
export default class extends React.Component {
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
            this.props.onSendRequest();
         }
     }
     componentWillUnmount() {
         null !== this.interval && clearInterval(this.interval);
     }

    render() {
        if (!this.props.show) return null;
        return (
            <div className='m-layer-bg'>
                <div className='sms'>
                    <i className="m-close" onClick={this.props.onClose}></i>
                    <div className='m-bg-linear'>
                        <span className='m-phone'>验证手机号</span>
                    </div>
                    <div>您需要验证手机号&nbsp;<span>{this.props.number}</span></div>
                    <div>
                        <label htmlFor='smsCode'>验证码：</label>
                        <input id='smsCode' type='text' value={this.state.value} onChange={e => this.setState({value:e.target.value})}/>
                        &emsp;
                        <span onClick={this.handleSend}>{this.state.text}{isNaN(this.state.text)? null : ' 秒'}</span>
                    </div>
                    <div><button type='button' className='m-btn gradient lightblue middle' onClick={this.handleClick}>确认</button></div>
                </div>
            </div>
        );
    }
}