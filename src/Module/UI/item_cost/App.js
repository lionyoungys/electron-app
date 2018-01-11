/**
 * 项目保值金额、工艺加价及加价备注组件
 * @author yangyunlong
 */
import React from 'react';
import './App.css';

export default class extends React.Component {
    constructor(props) {super(props);}

    render() {
        return (
            <div className='item-cost'>
                <div>特征</div>
                <div>
                    <label>保值金额</label>
                    <input className='m-input-small' type='text' value={this.props.color}/>&nbsp;元
                </div>
                <div>
                    <label>工艺加价</label>
                    <input className='m-input-small' type='text' value={this.props.question}/>&nbsp;元
                </div>
                <div>
                    <label htmlFor='item_sn'>加价备注</label>
                    <input
                        className='m-input-small long'
                        type='text'
                        id='item_sn'
                        value={this.props.sn}
                        onChange={this.props.onChange}
                    />
                </div>
            </div>
        );
    }
}