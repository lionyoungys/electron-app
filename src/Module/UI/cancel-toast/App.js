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
        this.state = {checked:[],details:[]};
        this.onCloseRequest = this.onCloseRequest.bind(this);
        this.onConfirmRequest = this.onConfirmRequest.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    onCloseRequest() {
        this.setState({checked:[],details:[]});
        this.props.onCloseRequest();
    }
    onConfirmRequest() {
        if (this.state.checked.length > 0) {
            this.props.onConfirmRequest(this.state.checked, this.state.details);
            this.setState({checked:[],details:[]});
        }
    }
    handleClick(object, isChecked) {
        let checked = this.state.checked,
            details = this.state.details;
        if (isChecked) {    //判断是否选中状态
            let index = object.value.inArray(checked);
            checked.splice(index,1);    //清除选中
            details.splice(index,1);
            
        } else {
            checked.push(object.value);    //添加选中
            details.push(object);
        }
        this.setState({checked:checked,details:details});
    }
    render() {
        if (!this.props.show) return null;
        let options = this.props.data.map((obj) => 
            <div key={obj.key}>
                <Checkbox value={obj} onClick={this.handleClick} checked={-1 !== obj.key.inObjectArray(this.state.details, 'key')}>{obj.value}</Checkbox>
            </div>
        );
        return (
            <div className='m-layer-bg'>
                <div className='cancel-toast'>
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