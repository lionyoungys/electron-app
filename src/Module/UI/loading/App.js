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
    }

    render() {
        if (!this.props.show) return null;
        return (
            <div className='loading-bg'>
                <div className='loading'>{this.props.notice}</div>
            </div>
        );
    }
}