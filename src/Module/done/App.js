/**
 * 完成页界面组件
 * @author yangyunlong
 */

import React from 'react';


export default class extends React.Component {
    constructor(props) {super(props)}

    render() {
        return (
            <div style={{marginTop:'59px'}}>
                <div style={{margin:'0 0 55px 90px'}}>恭喜，{this.props.param.msg}完成</div>
                <div style={{marginLeft:'29px'}}>
                    <button type='button' className='e-btn confirm' onClick={() => this.props.changeView({view:'take'})}>返回{this.props.param.msg}首页</button>
                    <button type='button' className='e-btn cancel' style={{marginLeft:'37px'}} data-view={this.props.param.index} onClick={this.props.closeView} >关闭窗口</button>
                </div>
            </div>
        );
    }
}