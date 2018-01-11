/**
 * 项目颜色、瑕疵及洗后预估组件
 * @author yangyunlong
 */
import React from 'react';
import './App.css';

export default class extends React.Component {
    constructor(props) {super(props);}

    render() {
        return (
            <div className='item-info'>
                <div>特征</div>
                <div>
                    <label>颜色</label>
                    <input className='m-input-small long postfix' type='text' disabled value={this.props.color}/>
                </div>
                <div>
                    <label>瑕疵</label>
                    <input className='m-input-small long postfix' type='text' disabled value={this.props.question}/>
                </div>
                <div>
                    <label htmlFor='item_sn'>洗后预估</label>
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