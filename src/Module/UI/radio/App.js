/**
 * 单选框组件
 * @author yangyunlong
 */
import React from 'react';

//单选框    checked:true/false(是否选中)    children:值 value:值    onClick:点击回调(arg:value|children, arg:checked)
export default class extends React.Component {
    constructor(props) {super(props)}
    render() {
        return (
            <span className='m-pointer' onClick={() => this.props.onClick(tool.isSet(this.props.value) ? this.props.value : this.props.children, this.props.checked)}>
                <i className={'fa ' + (this.props.checked ? 'fa-check-circle' : 'fa-check-circle-o')}></i>&nbsp;{this.props.children}
            </span>
        );
    }
}