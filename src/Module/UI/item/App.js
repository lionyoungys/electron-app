/**
 * 项目名称及编号组件
 * @author yangyunlong
 */
import React from 'react';
import './App.css';

//name:衣物名称    sn:衣物编码    onChange:当用户改变衣物编码输入框回调函数
export default class extends React.Component {
    constructor(props) {super(props);}

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
                        value={this.props.sn}
                        onChange={this.props.onChange}
                    />
                </div>
            </div>
        );
    }
}