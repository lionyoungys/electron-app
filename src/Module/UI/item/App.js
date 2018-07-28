/**
 * 项目名称及编号组件
 * @author yangyunlong
 */
import React from 'react';
import './App.css';

//name:衣物名称    sn:衣物编码    onChange:当用户改变衣物编码输入框回调函数
export default class extends React.Component {
    constructor(props) {super(props);}
    componentDidMount() {
        var keycode = new tool.KeyCode();
        keycode.listen(this.input, value => {
            'function' === typeof this.props.onChange && this.props.onChange({target:{value:value}});
        });
    }
    render() {
        return (
            <div className='item'>
                <div>衣物</div>
                <div>
                    <label>名称</label>
                    <input className='m-input-small' type='text' readOnly value={this.props.name}/>
                </div>
                <div>
                    <label htmlFor='item_sn'>衣物编码</label>
                    <input
                        className='m-input-small'
                        type='text'
                        id='item_sn'
                        autoFocus
                        ref={input => this.input = input}
                        value={this.props.sn}
                        // onChange={this.props.onChange}
                    />
                </div>
                <div style={{display:('undefined' === typeof this.props.take_time ? 'none' : 'block')}}>
                    <label htmlFor='take_time'>取衣时间</label>
                    <input
                        className='m-input-small postfix'
                        type='text'
                        id='take_time'
                        readOnly
                        value={this.props.take_time}
                        onClick={this.props.onClick}
                    />
                </div>
            </div>
        );
    }
}