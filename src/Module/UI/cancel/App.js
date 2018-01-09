/**
 * 取消原因弹窗组件
 * @author yangyunlong
 */
import React from 'react';
import Checkbox from '../checkbox/App';
import './App.css';


//多选弹出框    show=true/false title=标题 button=按钮内容 是否展示 checkboxs=[{text:text,key:key}]
export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {checked:[]};
        this.checkedList = [];
        this.checkedList2 = [];
        this.onCloseRequest = this.onCloseRequest.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    onCloseRequest() {
        this.checkedList = [];
        this.checkedList2 = [];
        this.props.onCloseRequest();
    }
    onConfirm() {
        if (func.isSet(this.props.detail)) {
            this.props.callback(this.checkedList2);
        } else {
            this.props.callback(this.checkedList);
        }
        this.checkedList = [];
        this.checkedList2 = [];
    }
    handleClick(value, boolean) {
        let checked = this.state.checked;
        let index = value.inArray(checked);
        if (boolean) {    //判断是否选中状态
            checked.splice(index,1);    //清除选中
            this.setState({checked:checked});
        } else {
            checked.push(value);    //添加选中
            this.setState({checked:checked});
        }
    }
    render() {
        if (!this.props.show) return null;
        let items = this.props.checkboxs.map((obj) => 
            <div key={obj.key}>
                <Checkbox onClick={this.handleClick} boolean={-1 !== obj.value.inArray(this.state.checked)}>{obj.value}</Checkbox>
            </div>
        );
        return (
            <div className='m-layer-bg'>
                <div className='cancel'>
                    <i className='fa fa-times-circle close' onClick={this.onCloseRequest}></i>
                    <div>{this.props.title}</div>
                    <div>{items}</div>
                    <div>
                        <input 
                            type='button' 
                            value={this.props.button} 
                            onClick={this.onConfirm} 
                            className='m-btn m-btn-large m-btn-confirm' 
                        />
                    </div>
                </div>
            </div>
        );
    }
}