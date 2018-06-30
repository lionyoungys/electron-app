/**
 * 数学处理组件
 * @author Edwin Young
 * @desc 加减框,onSub:减号事件;onAdd:加号事件;param:回调参数
 */

import React from 'react';
export default class extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        let event = e.target.dataset.event;
        'function' === typeof this.props[event] && this.props[event](this.props.param);
    }

    render() {
        return (
            <span className='ui-math'>
                <i className='ui-math-sub' data-event='onSub' onClick={this.handleClick}></i>
                <input type='text' readOnly value={this.props.children}/>
                <i className='ui-math-add' data-event='onAdd' onClick={this.handleClick}></i>
            </span>
        );
    }
}