/**
 * 优惠券搜索使用组件
 * @author yangyunlong
 */
import React from 'react';
import './App.css';
//btnVal   placeholder  [callback=回调操作]
export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value:''};
    }
    componentDidMount() {
        this.input.onkeydown = ( e => {'Enter' === e.code && this.props.callback(this.state.value)} );
    }
    render() {
        return (
            <span className='search2'>
                <input 
                    type='text' 
                    placeholder={this.props.placeholder} 
                    value={this.state.value}
                    ref={input => this.input = input}
                    onChange={e => this.setState({value:e.target.value})}
                />
                <button 
                    type='button'
                    onClick={() => this.props.callback(this.state.value)}
                >{this.props.btnVal}</button>
            </span>
        );
    }
}