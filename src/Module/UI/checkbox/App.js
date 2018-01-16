/**
 * 单选框组件
 * @author yangyunlong
 */
import React from 'react';

//复选框    checked:true/false(是否选中)    children:值    onClick:点击回调(arg:children, arg:checked)
export default class extends React.Component {
    constructor(props) {super(props)}
    render() {
        return (
            <span className='m-pointer' onClick={() => this.props.onClick((tool.isSet(this.props.value) ? this.props.value : this.props.children), this.props.checked)}>
                <i className={'fa fa-check-square' + (this.props.checked ? ' checked' : '')}></i>&nbsp;{this.props.children}
            </span>
        );
    }
}