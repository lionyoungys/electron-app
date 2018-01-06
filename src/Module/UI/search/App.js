/**
 * 搜索框组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import './App.css';

//searchbar placeholder  [callback=回调操作]
export default class extends Component {
    constructor(props) {
        super(props);
        this.state = {value:''};
        this.onEnterRequest = this.onEnterRequest.bind(this);
    }
    onEnterRequest(input) {
        if (null !== input) {
            input.onkeydown = ( e => {'Enter' === e.code && this.props.callback(this.state.value)} );
        }
    }
    render() {
        return (
            <div className='search'>
                <input 
                    type='text' 
                    placeholder={this.props.placeholder} 
                    value={this.state.value}
                    ref={input => this.onEnterRequest(input)}
                    onChange={e => this.setState({value:e.target.value})}
                />
                <button type='button' onClick={() => this.props.callback(this.state.value)}>
                    <i className="fa fa-search"></i>
                </button>
            </div>
        );
    }
}