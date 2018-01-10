/**
 * 问题描述、颜色设置弹窗组件
 * @author yangyunlong
 */
import React from 'react';
import {color, question} from './Data';
import './App.css';
// title:标题文字    onCloseRequest:关闭弹窗    展示数据 type:color/question/null    onClick(index):选中选项点击
export default class extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {this.props.onClick(e.target.dataset.index)}

    render() {
        let options = null,
            title = null;
        if ('color' === this.props.type) {
            options = color.map(obj => <div key={obj.key}>{obj.value}</div>);
            title = '颜色';
        } else if ('question' === this.props.type) {
            options = question.map(obj => <div key={obj.key}>{obj.value}</div>);
            title = '瑕疵';
        } else {
            return null;
        }
        return (
            <div className='question'>
                <div>{title}<i className="fa fa-times" onClick={this.props.onCloseRequest}></i></div>
                <div>{options}</div>
                <div></div>
            </div>
        );
    }
}