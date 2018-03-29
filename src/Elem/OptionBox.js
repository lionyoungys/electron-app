/**
 * 单选框/复选框组件
 * @author yangyunlong
 */
import React from 'react';

//type:radio|checkbox    checked:true/false(是否选中)    value:值    children:内容    onClick:点击回调(value|children, checked)
export default class extends React.Component {
    constructor(props) {
        super(props);
        this.type = (tool.isSet(this.props.type) && this.props.type === 'checkbox') ? 'e-checkbox' : 'e-radio';
    }
    render() {
        return (
            <span
                className={this.type + (this.props.checked ? ' checked' : '')}
                onClick={() => this.props.onClick( (tool.isSet(this.props.value) ? this.props.value : this.props.children), this.props.checked )}
            >{this.props.children}</span>
        );
    }
}