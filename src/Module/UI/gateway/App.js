/**
 * 支付方式选项组件
 * @author yangyunlong
 */
import React from 'react';
import './App.css';
//checked:0,1,2    callback
export default class extends React.Component {
    constructor(props) {super(props)}

    render() {
        return (
            <div className='gateway'>
                <div>选择支付方式：</div>
                <div>
                    <span onClick={() => this.props.callback(0)}>
                        <i className={'fa ' + (0 == this.props.checked ? 'fa-check-circle' : 'fa-check-circle-o')}></i>
                        &nbsp;&nbsp;
                        <span className='m-icon cash'>现金支付</span>
                    </span>
                    &emsp;&emsp;
                    <span onClick={() => this.props.callback(1)}>
                        <i className={'fa ' + (1 == this.props.checked ? 'fa-check-circle' : 'fa-check-circle-o')}></i>
                        &nbsp;&nbsp;
                        <span className='m-icon wechat'>微信支付</span>
                    </span>
                    &emsp;&emsp;
                    <span onClick={() => this.props.callback(2)}>
                        <i className={'fa ' + (2 == this.props.checked ? 'fa-check-circle' : 'fa-check-circle-o')}></i>
                        &nbsp;&nbsp;
                        <span className='m-icon alipay'>支付宝支付</span>
                    </span>
                </div>
            </div>
        );
    }
}