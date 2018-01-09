/**
 * 取消原因弹窗组件
 * @author yangyunlong
 */
import React from 'react';
import Checkbox from '../checkbox/App';
import './App.css';


//多选弹出框    show=true/false是否展示 title=标题 btnValue=按钮内容 多选数据 data=[{key:key,value:value}] onCloseRequest(),onConfirmRequest([value])
export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {checked:[]};
        this.onCloseRequest = this.onCloseRequest.bind(this);
        this.onConfirmRequest = this.onConfirmRequest.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    onCloseRequest() {
        this.setState({checked:[]});
        this.props.onCloseRequest();
    }
    onConfirmRequest() {
        if (this.state.checked.length > 0) {
            this.props.onConfirmRequest(this.state.checked);
            this.setState({checked:[]});
        }
    }
    handleClick(value, isChecked) {
        let checked = this.state.checked;
        if (isChecked) {    //判断是否选中状态
            let index = value.inArray(checked);
            checked.splice(index,1);    //清除选中
            this.setState({checked:checked});
        } else {
            checked.push(value);    //添加选中
            this.setState({checked:checked});
        }
    }
    render() {
        if (!this.props.show) return null;
        let options = this.props.data.map((obj) => 
            <div key={obj.key}>
                <Checkbox onClick={this.handleClick} checked={-1 !== obj.value.inArray(this.state.checked)}>{obj.value}</Checkbox>
            </div>
        );
        return (
            <div className='m-layer-bg'>
                <div className='cancel'>
                    <i className='fa fa-times-circle close' onClick={this.onCloseRequest}></i>
                    <div>{this.props.title}</div>
                    <div>{options}</div>
                    <div>
                        <input 
                            type='button' 
                            value={this.props.btnValue} 
                            onClick={this.onConfirmRequest} 
                            className='m-btn m-btn-large m-btn-confirm' 
                        />
                    </div>
                </div>
            </div>
        );
    }
}