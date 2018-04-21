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
        this.state = {color:null, problem:null, forecast:null}
        this.handleClick = this.handleClick.bind(this);
        this.handleConfirm = this.handleConfirm.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleConfirm() {
        let value = this.state[this.props.type],
            options = [];
        if (null === value) {
            if ('string' === typeof this.props[this.props.type]) {
                value = this.props[this.props.type];
            } else {
                value = '';
            } 
        }
        (
            'color' === this.props.type
            ?
            color
            : 
            ('problem' === this.props.type ? problem : forecast)
        ).map(obj => {
            if (-1 !== value.indexOf(obj.value)) {
                options.push(obj.value);
                value = value.replace(obj.value + '；', '').replace(obj.value, '');
            }
        });
        if ('' !== value || options.length > 0) {
            this.props.onConfirmRequest(value, options);
            this.setState({color:null,problem:null,forecast:null});
        }
    }

    handleClose() {
        this.props.onCloseRequest();
        this.setState({color:null,problem:null,forecast:null});
    }

    handleClick(e) {
        let text = e.target.innerText,
            value = this.state[this.props.type];
        if (null === value) {
            if ('string' === typeof this.props[this.props.type]) {
                value = this.props[this.props.type];
            } else {
                value = '';
            } 
        }
        if (-1 === value.indexOf(text)) {
            let setVal = (value + text + '；');
            setVal.length < 21 && this.setState({[this.props.type]:setVal});
        } else {
            this.setState({[this.props.type]:value.replace(text + '；', '').replace(text, '')});
        }
    }

    render() {
        let options = null,
            title = null,
            value = this.state[this.props.type];
        if (null === value) {
            if ('string' === typeof this.props[this.props.type]) {
                value = this.props[this.props.type];
            } else {
                value = '';
            } 
        }
        if ('color' === this.props.type) {
            options = color.map(obj => <div key={obj.key} className={-1 === value.indexOf(obj.value) ? null : 'checked'} onClick={this.handleClick}>{obj.value}</div>);
            title = '颜色';
        } else if ('problem' === this.props.type) {
            options = problem.map(obj => <div key={obj.key} className={-1 === value.indexOf(obj.value) ? null : 'checked'} onClick={this.handleClick}>{obj.value}</div>);
            title = '瑕疵';
        } else if ('forecast' === this.props.type) {
            options = forecast.map(obj => <div key={obj.key} className={-1 === value.indexOf(obj.value) ? null : 'checked'} onClick={this.handleClick}>{obj.value}</div>);
            title = '洗后预估';
        } else {
            return null;
        }
        'object' === typeof this.input && null !== this.input && this.input.focus();
        return (
            <div className='e-shade'>
                <div className='problem'>
                    <div>{title}</div>
                    <div>请输入{title}：</div>
                    <div>
                        <input
                            type='text'
                            maxLength='20'
                            placeholder={'也可输入具体' + title}
                            value={value}
                            onChange={e => {
                                let value = e.target.value;
                                value.length < 21 && this.setState({[this.props.type]:value});
                            }}
                            ref={input => this.input = input}
                        />
                        <i className='e-counter'>{value.length}/20</i>
                    </div>
                    <div>{options}</div>
                    <div>
                        <button type='button' className='e-btn cancel' onClick={this.handleClose}>取消</button>
                        &emsp;&emsp;&emsp;&emsp;
                        <button type='button' className='e-btn confirm' onClick={this.handleConfirm}>确定</button>
                    </div>
                </div>
            </div>
        );
    }
}