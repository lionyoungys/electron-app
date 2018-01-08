/**
 * 面包屑组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import './App.css';
//单选框    boolean:true/false(是否选中)    children:值    onClick:点击回调(arg:children)
export default class extends Component {
    constructor(props) {super(props)}
    render() {
        return (
            <span className='m-pointer' onClick={() => this.props.onClick(this.props.children)}>
                <i className={'fa ' + (this.props.boolean ? 'fa-check-circle' : 'fa-check-circle-o')}></i>&nbsp;{this.props.children}
            </span>
        );
    }
}