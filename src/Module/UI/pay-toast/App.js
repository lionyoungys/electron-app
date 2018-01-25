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
    }

    render() {
        if (!this.props.show) return null;
        return (
            <div className='m-layer-bg'>
                <div className='pay-toast'>
                    <i className='m-close' onClick={this.props.onClose}></i>
                    <div><span className='m-pay'>会员卡支付</span></div>
                </div>
            </div>
        );
    }
}

export class SpecialVerify extends Component{
    constructor(props) {
        super(props);
    }

    render() {
        if (!this.props.show) return null;
        return (
            <div className='m-layer-bg'>
                <div className='pay-toast'>
                    <i className='m-close' onClick={this.props.onClose}></i>
                    <div><span className='m-pay'>特殊折扣</span></div>
                </div>
            </div>
        );
    }
}

export class FreeVerify extends Component{
    constructor(props) {
        super(props);
    }

    render() {
        if (!this.props.show) return null;
        return (
            <div className='m-layer-bg'>
                <div className='pay-toast'>
                    <i className='m-close' onClick={this.props.onClose}></i>
                    <div><span className='m-pay'>免洗</span></div>
                </div>
            </div>
        );
    }
}