/**
 * 完成页界面组件
 * @author yangyunlong
 */

import React from 'react';
import './App.css';


export default class extends React.Component {
    constructor(props) {super(props)}

    render() {
        return (
            <div className='done'>
                <div>恭喜，{this.props.param.msg}完成</div>
                <div>
                    <button type='button' className='e-btn confirm' onClick={() => this.props.changeView({view:this.props.param.index, param:this.props.param.param})}>返回{this.props.param.msg}首页</button>
                    &emsp;&emsp;
                    <button type='button' className='e-btn cancel' data-view={this.props.param.index} onClick={this.props.closeView} >关闭窗口</button>
                </div>
            </div>
        );
    }
}