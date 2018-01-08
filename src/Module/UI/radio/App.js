/**
 * 单选框组件
 * @author yangyunlong
 */
import React from 'react';
import './App.css';
//单选框    boolean:true/false(是否选中)    children:值    onClick:点击回调(arg:children)
export default class extends React.Component {
    constructor(props) {super(props)}
    render() {
        return (
            <span className='m-pointer' onClick={() => this.props.onClick(this.props.children)}>
                <i className={'fa ' + (this.props.boolean ? 'fa-check-circle' : 'fa-check-circle-o')}></i>&nbsp;{this.props.children}
            </span>
        );
    }
}