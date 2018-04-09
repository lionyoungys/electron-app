/**
 * 搜索框组件
 * @author yangyunlong
 */
import React from 'react';
import './App.css';

//searchbar placeholder  [callback=回调操作]
export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value:tool.isSet(this.props.value) ? this.props.value : ''};
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        this.input.onkeydown = ( e => {'Enter' === e.code && this.props.callback(this.state.value)} );
    }
    handleChange(e) {
        let value = e.target.value;
        this.setState({value:value});
        tool.isSet(this.props.onChange) && this.props.onChange(value);   
    }
    
    render() {
        let value = 'string' === typeof this.props.value ? this.props.value : this.state.value;
        return (
            <div className='search'>
                <input 
                    type='text' 
                    placeholder={this.props.placeholder} 
                    value={value}
                    ref={input => this.input = input}
                    onChange={this.handleChange}
                />
                <button type='button' onClick={() => this.props.callback(this.state.value)}>
                    <i className="fa fa-search"></i>
                </button>
            </div>
        );
    }
}