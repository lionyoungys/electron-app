/**
 * 下拉框组件
 * @author yangyunlong
 */
import React from 'react';

//placeholder    option=[value,value,value]    [onChange=回调操作]
export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value:tool.isSet(this.props.value) ? this.props.value : '', 
            selected:this.props.option[0], 
            show:false
        };
        this.handleChange = this.handleChange.bind(this);
        this.toggleShow = this.toggleShow.bind(this);
    }

    handleChange(e) {
        let value = e.target.innerText;
        this.setState({selected:value, show:false})
        'function' === typeof this.props.onChange && this.props.onChange(value);
    }
    toggleShow() {this.setState({show:!this.state.show})}
    
    render() {
        let len = this.props.option.length,
            option = [];
        for (let i = 0;i < len;++i) {
            if (this.state.selected === this.props.option[i]) continue;
            option.push(
                <div
                    key={this.props.option[i] + i}
                    onClick={this.handleChange}
                >{this.props.option[i]}</div>
            );
        }
        return (
            <div className={`select${this.state.show ? ' select-show' : ''}`}>
                <i onClick={this.toggleShow}></i>
                <div
                    className='select-selected'
                    onClick={this.toggleShow}
                >{this.state.selected}</div>
                <div className='select-option'>{option}</div>
            </div>
        );
    }
}