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
                <div>加价</div>
                <div>
                    <label htmlFor='keep_price'>保值金额</label>
                    <input className='m-input-small' id='keep_price' type='text' value={this.props.keep_price} onChange={this.props.handleKeepPrice}/>&nbsp;元
                </div>
                <div>
                    <label htmlFor='craft_price'>工艺加价</label>
                    <input id='craft_price' className='m-input-small' type='text' value={this.props.craft_price} onChange={this.props.handleCraftPrice}/>&nbsp;元
                </div>
                <div>
                    <label htmlFor='craft_des'>加价备注</label>
                    <input className='m-input-small' type='text' id='craft_des' value={this.props.craft_des} onChange={this.props.handleCraftDes}/>
                </div>
            </div>
        );
    }
}