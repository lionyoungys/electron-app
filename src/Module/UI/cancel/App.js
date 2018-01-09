/**
 * 取消原因弹窗组件
 * @author yangyunlong
 */
import React from 'react';
import './App.css';


//多选弹出框    show=true/false title=标题 button=按钮内容 是否展示 checkboxs=[{text:text,key:key}]
export default class extends React.Component {
    constructor(props) {
        super(props);
        this.checkedList = [];
        this.checkedList2 = [];
        this.onClose = this.onClose.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    onClose() {
        this.checkedList = [];
        this.checkedList2 = [];
        this.props.onClose();
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
    handleClick(e) {
        let node = e.target,
            text = e.target.innerText;
        if (node.classList.contains('ui-checked')) {    //判断是否选中状态
            let index = text.inArray(this.checkedList),
                index2 = text.inObjectArray(this.checkedList2,'text');
            this.checkedList.splice(index,1);    //清除选中
            this.checkedList2.splice(index2,1);
        } else {
            this.checkedList.push(text);    //添加选中
            this.checkedList2.push({key:node.dataset.id,text:text});
        }
        node.classList.toggle('ui-checked');
    }
    render() {
        let props = this.props,
            state = this.state;
        if (!props.show) return null;
        let items = props.checkboxs.map((obj) => 
            <div className='ui-alert-line' key={obj.key}>
                <span 
                    className={-1 !== obj.text.inArray(this.checkedList) ? 'ui-checkbox ui-checked' : 'ui-checkbox'} 
                    onClick={this.handleClick}
                    data-id={obj.key}
                >{obj.text}</span>
            </div>
        );
        return (
            <section className='ui-alert-bg'>
                <div className='ui-alert-checkbox'>
                    <div className='ui-alert-title'>
                        {props.title}<em className='right ui-close' onClick={this.onClose}></em>
                    </div>
                    {items}
                    <div className='ui-botton-area'>
                        <input 
                            type='button' 
                            value={props.button} 
                            onClick={this.onConfirm} 
                            className='ui-btn ui-btn-large ui-btn-confirm' 
                        />
                    </div>
                </div>
            </section>
        );
    }
}