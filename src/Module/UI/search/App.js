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
        this.state = {value:''};
    }

    componentDidMount() {
        this.input.onkeydown = ( e => {'Enter' === e.code && this.props.callback(this.state.value)} );
    }
    
    render() {
        return (
            <div className='search'>
                <input 
                    type='text' 
                    placeholder={this.props.placeholder} 
                    value={this.state.value}
                    ref={input => this.input = input}
                    onChange={e => this.setState({value:e.target.value})}
                />
                <button type='button' onClick={() => this.props.callback(this.state.value)}>
                    <i className="fa fa-search"></i>
                </button>
            </div>
        );
    }
}