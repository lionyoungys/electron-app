/**
 * 下拉搜索组件
 * @author yangyunlong
 */
import React from 'react';

//placeholder    option=[value,value,value]    [callback=回调操作]
export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value:tool.isSet(this.props.value) ? this.props.value : '', 
            selected:'string' === typeof this.props.selected && '' !== this.props.selected ? this.props.selected : null, 
            show:false,
            minWidth:null
        };
        this.handleChange = this.handleChange.bind(this);
        this.toggleShow = this.toggleShow.bind(this);
    }

    componentDidMount() {
        this.input.onkeydown = ( e => {'Enter' === e.code && this.props.callback(this.state.value, this.state.selected)} );
        this.setState({minWidth:this.div.offsetWidth});
    }
    handleChange(e) {this.setState({selected:e.target.innerText, show:false})}
    toggleShow() {this.setState({show:!this.state.show})}
    
    render() {
        let len = this.props.option.length,
            option = [];
        for (let i = 0;i < len;++i) {
            if ((null === this.state.selected && 0 === i) || this.state.selected === this.props.option[i]) continue;
            option.push(
                <div
                    key={this.props.option[i] + i}
                    onClick={this.handleChange}
                >{this.props.option[i]}</div>
            );
        }
        return (
            <div className='select-search'>
                <div
                    className={this.state.show ? 'select-search-option-show' : null}
                    style={{minWidth:this.state.minWidth}}
                >
                    <i onClick={this.toggleShow}></i>
                    <div
                        className='select-search-selected'
                        onClick={this.toggleShow}
                    >{null === this.state.selected ? this.props.option[0] : this.state.selected}</div>
                    <div ref={div => this.div = div} className='select-search-option'>{option}</div>
                </div>
                <input 
                    type='text' 
                    placeholder={this.props.placeholder} 
                    value={this.state.value}
                    ref={input => this.input = input}
                    onChange={e => this.setState({value:e.target.value})}
                />
                <button type='button' onClick={() => this.props.callback(this.state.value, this.state.selected)}>
                    <i className="fa fa-search"></i>
                </button>
            </div>
        );
    }
}