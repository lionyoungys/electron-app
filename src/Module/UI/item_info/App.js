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
                    <input className='m-input-small long postfix' type='text' readOnly value={this.props.color} onClick={this.props.handleColor}/>
                </div>
                <div>
                    <label>瑕疵</label>
                    <input className='m-input-small long postfix' type='text' readOnly value={this.props.problem}  onClick={this.props.handleProblem}/>
                </div>
                <div>
                    <label>洗后预估</label>
                    <input className='m-input-small long postfix' type='text' readOnly value={this.props.forecast} onClick={this.props.handleForecast}/>
                </div>
            </div>
        );
    }
}