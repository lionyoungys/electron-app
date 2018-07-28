/**
 * 搜索框组件
 * @author yangyunlong
 */
import React from 'react';
import './App.css';

//searchbar placeholder  [callback=回调操作]    autoFocus
export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value:'string' === typeof this.props.value ? this.props.value : '',
            type:'password'
        };
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        if (this.props.scanner) {
            var keycode = new tool.KeyCode();
            keycode.listen(
                this.input, 
                value => {
                    this.setState({value:value, type:'text'});
                    'function' === typeof this.props.onChange && this.props.onChange(value);
                },
                () => {
                    'function' === typeof this.props.callback && this.props.callback(this.state.value);
                }
            );
        } else {
            this.input.onkeydown = ( e => {'Enter' === e.code && 'function' === typeof this.props.callback && this.props.callback(this.state.value)} );
        }
    }
    handleChange(e) {
        if (!this.props.scanner) {
            let value = e.target.value;
            this.setState({value:value, type:'text'});
            'function' === typeof this.props.onChange && this.props.onChange(value);
        }
    }
    
    render() {
        let value = 'string' === typeof this.props.value ? this.props.value : this.state.value;
        return (
            <div className='search'>
                <input 
                    type={this.state.type} 
                    placeholder={this.props.placeholder} 
                    value={value}
                    ref={input => this.input = input}
                    onChange={this.handleChange}
                    autoFocus={this.props.autoFocus}
                />
                <button type='button' onClick={() => this.props.callback(this.state.value)}>
                    <i className="fa fa-search"></i>
                </button>
            </div>
        );
    }
}