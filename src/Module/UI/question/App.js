/**
 * 问题描述、颜色设置弹窗组件
 * @author yangyunlong
 */
import React from 'react';
import {color, question} from './Data';
import './App.css';
// title:标题文字    onCloseRequest:关闭弹窗    展示数据 type:color/question/null  onConfirmRequest(value,options);
export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {color:[], question:[], colorVal:'', questionVal:''}
        this.handleClick = this.handleClick.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleConfirm = this.handleConfirm.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }
    handleConfirm() {
        let value = this.state[this.props.type + 'Val'],
            options = this.state[this.props.type];
        if ('' !== value || options.length > 0) {
            this.props.onConfirmRequest(value, options);
            this.setState({color:[],question:[],colorVal:'',questionVal:''});
        }
        
    }

    handleClose() {
        this.setState({color:[],question:[],colorVal:'',questionVal:''});
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
        } else if ('question' === this.props.type) {
            options = question.map(obj => <div key={obj.key} onClick={this.handleClick}>{obj.value}</div>);
            title = '瑕疵';
        } else {
            return null;
        }
        let placeholder = ( '也可输入具体' + title ),
            valKey = ( this.props.type + 'Val' ),
            checked = this.state[this.props.type].map( obj => 
                <span className='m-tag-box' key={obj.key}>
                    {obj.value}
                    <i className='m-cancel-tag' data-key={obj.key} onClick={this.handleCancel}></i>
                </span>
            );
        return (
            <div className='question'>
                <div>{title}<i className="fa fa-times" onClick={this.handleClose}></i></div>
                <div>{options}</div>
                <div>
                    <div>已选择:</div>
                    <div>{checked}</div>
                </div>
                <div>
                    <div></div>
                    <div>
                        <div>
                            <textarea
                                placeholder={placeholder}
                                value={this.state[valKey]}
                                maxLength='20'
                                onChange={e => this.setState({[valKey]:e.target.value})}
                            ></textarea>
                            <i className='m-counter'>{this.state[valKey].length}/20</i>
                        </div>
                        <button
                            type='button'
                            className='m-btn m-btn-confirm m-btn-middle'
                            onClick={this.handleConfirm}
                        >确定</button>
                    </div>
                </div>
            </div>
        );
    }
}