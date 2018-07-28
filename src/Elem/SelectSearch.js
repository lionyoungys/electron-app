/**
 * 下拉搜索组件
 * @author yangyunlong
 */
import React from 'react';

//placeholder    value    option=[value,value,value]    [callback=回调操作]
export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value:'string' === typeof this.props.value ? this.props.value : '', 
            selected:'string' === typeof this.props.selected && '' !== this.props.selected ? this.props.selected : this.props.option[0], 
            show:false,
            minWidth:null
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeText = this.handleChangeText.bind(this);
        this.toggleShow = this.toggleShow.bind(this);
    }

    componentDidMount() {
        if (this.props.scanner) {
            var keycode = new tool.KeyCode();
            keycode.listen(
                this.input, 
                value => this.setState({value:value}),
                () => {
                    'function' === typeof this.props.callback && this.props.callback(this.state.value, this.state.selected);
                }
            );
        } else {
            this.input.onkeydown = ( e => {'Enter' === e.code && this.props.callback(this.state.value, this.state.selected)} );
        }
        
        this.setState({minWidth:this.div.offsetWidth});
    }
    handleChange(e) {this.setState({selected:e.target.innerText, show:false})}
    handleChangeText(e) {!this.props.scanner && this.setState({value:e.target.value})}
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
            <div className='select-search'>
                <div
                    className={this.state.show ? 'select-search-option-show' : null}
                    style={{minWidth:this.state.minWidth}}
                >
                    <i onClick={this.toggleShow}></i>
                    <div
                        className='select-search-selected'
                        onClick={this.toggleShow}
                    >{this.state.selected}</div>
                    <div ref={div => this.div = div} className='select-search-option'>{option}</div>
                </div>
                <input 
                    type='text' 
                    placeholder={this.props.placeholder} 
                    value={this.state.value}
                    ref={input => this.input = input}
                    onChange={this.handleChangeText}
                />
                <button type='button' onClick={() => this.props.callback(this.state.value, this.state.selected)}>
                    <i className="fa fa-search"></i>
                </button>
            </div>
        );
    }
}