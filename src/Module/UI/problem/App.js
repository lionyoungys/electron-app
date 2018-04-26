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
        this.getVal = this.getVal.bind(this);
        this.hasOption = this.hasOption.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleConfirm = this.handleConfirm.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }
    // 获取当前值
    getVal() {
        let value = this.state[this.props.type];
        if (null === value) {
            if ('string' === typeof this.props[this.props.type]) {
                value = this.props[this.props.type];
            } else {
                value = '';
            } 
        }
        return value;
    }
    // 判断是否有该选项
    hasOption(option) {
        let value = this.getVal();
        return -1 !== value.indexOf('；' + option + '；') || 0 === value.indexOf(option + '；');
    }

    handleConfirm() {
        let value = this.getVal(),
            options = [],
            match, index, match2;
        (
            'color' === this.props.type
            ?
            color
            : 
            ('problem' === this.props.type ? problem : forecast)
        ).map(obj => {
            match = '；' + obj.value + '；';
            match2 = obj.value + '；';
            index = value.indexOf(match);
            
            if (-1 !== index) {
                options.push(obj.value);
                value = value.replace(new RegExp(value.substr(index, match.length)), '；');
            } else if (0 === value.indexOf(match2)) {
                options.push(obj.value);
                value = value.replace(new RegExp(value.substr(0, match2.length)), '');
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
            value = this.getVal();

        let match = '；' + text + '；',
            index = value.indexOf(match);
        if (-1 !== index) return this.setState({[this.props.type]:value.replace(new RegExp(value.substr(index, match.length)), '；')});

        let match2 = text + '；';
        if (0 === value.indexOf(match2)) return this.setState({[this.props.type]:value.replace(new RegExp(value.substr(0, match2.length)), '')});

        // 若不符合前两个判断则为追加
        let len = value.length,
            setVal;
        if (len > 0 && value.lastIndexOf('；') != (len - 1)) {
            setVal = (value + '；' + text + '；');
        } else {
            setVal = (value + text + '；');
        }
        setVal.length < 21 && this.setState({[this.props.type]:setVal});
    }

    render() {
        let options = null,
            title = null,
            value = this.getVal();

        if ('color' === this.props.type) {
            options = color.map(obj => <div key={obj.key} className={this.hasOption(obj.value) ? 'checked' : null} onClick={this.handleClick}>{obj.value}</div>);
            title = '颜色';
        } else if ('problem' === this.props.type) {
            options = problem.map(obj => <div key={obj.key} className={this.hasOption(obj.value) ? 'checked' : null} onClick={this.handleClick}>{obj.value}</div>);
            title = '瑕疵';
        } else if ('forecast' === this.props.type) {
            options = forecast.map(obj => <div key={obj.key} className={this.hasOption(obj.value) ? 'checked' : null} onClick={this.handleClick}>{obj.value}</div>);
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