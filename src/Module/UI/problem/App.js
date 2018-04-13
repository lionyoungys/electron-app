/**
 * 问题描述、颜色设置弹窗组件
 * @author yangyunlong
 */
import React from 'react';
import {color, problem, forecast} from './Data';
import './App.css';
// title:标题文字    onCloseRequest:关闭弹窗    展示数据 type:color/problem/null  onConfirmRequest(value,options);
export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {color:[], problem:[], forecast:[], colorVal:'', problemVal:'', forecastVal:''}
        this.handleClick = this.handleClick.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleConfirm = this.handleConfirm.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }
    handleConfirm() {
        let value = this.state[this.props.type + 'Val'],
            options = this.state[this.props.type];
        if ('' !== value || options.length > 0) {
            this.props.onConfirmRequest(value, options.toSimpleArray('value'));
            this.setState({color:[],problem:[],forecast:[],colorVal:'',problemVal:'',forecastVal:''});
        }
        
    }

    handleClose() {
        this.setState({color:[],problem:[],forecast:[],colorVal:'',problemVal:'',forecastVal:''});
        this.props.onCloseRequest();
    }
    handleCancel(e) {
        this.state[this.props.type].splice(e.target.dataset.key, 1);
        this.setState({checked:this.state.checked});
    }
    handleClick(e) {
        let checked = this.state[this.props.type],
            len = checked.length,
            value = e.target.innerText;
        if (len < 4 && -1 === value.inObjectArray(checked, 'value')) {
            checked.push({key:len,value:value});
            this.setState({[this.props.type]:checked});
        }
    }

    render() {
        let options = null,
            title = null;
        if ('color' === this.props.type) {
            options = color.map(obj => <div key={obj.key} onClick={this.handleClick}>{obj.value}</div>);
            title = '颜色';
        } else if ('problem' === this.props.type) {
            options = problem.map(obj => <div key={obj.key} onClick={this.handleClick}>{obj.value}</div>);
            title = '瑕疵';
        } else if ('forecast' === this.props.type) {
            options = forecast.map(obj => <div key={obj.key} onClick={this.handleClick}>{obj.value}</div>);
            title = '洗后预估';
        } else {
            return null;
        }
        let placeholder = ( '也可输入具体' + title ),
            valKey = ( this.props.type + 'Val' ),
            checked = this.state[this.props.type].map( obj => 
                <span className='e-tag' key={obj.key}>
                    {obj.value}
                    <i className='e-tag-del' data-key={obj.key} onClick={this.handleCancel}></i>
                </span>
            );
        return (
            <div className='problem'>
                <div>{title}</div>
                <div>{options}</div>
                <div>
                    <div>已选择:</div>
                    <div>{checked}</div>
                </div>
                <div>
                    <textarea
                        placeholder={placeholder}
                        value={this.state[valKey]}
                        maxLength='20'
                        onChange={e => this.setState({[valKey]:e.target.value})}
                    ></textarea>
                    <i className='e-counter'>{this.state[valKey].length}/20</i>
                </div>
                <div>
                    <button type='button' className='e-btn cancel' onClick={this.handleClose}>取消</button>
                    &emsp;&emsp;&emsp;&emsp;
                    <button type='button' className='e-btn confirm' onClick={this.handleConfirm}>确定</button>
                </div>
            </div>
        );
    }
}