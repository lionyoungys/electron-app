/**
 * 头组件
 * @author yangyunlong
 */
import React from 'react';

//children:标题内容    onClose()|关闭事件
export default class extends React.Component {
    constructor(props) {super(props)}

    render() {
        return (
            <div className='elem-header'>
                <div className='left'>{this.props.children}</div><div className='right' onClick={this.props.onClose}></div>
            </div>
        );
    }
}