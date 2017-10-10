/**
 * 问题描述
 * @author yangyunlong
 */
import React, {Component} from 'react';
import '../static/api';
import Crumbs,{QCmenu} from '../static/UI';
import {questionConfig} from '../static/config';

class Question extends Component {
    constructor(props) {
        console.log(questionConfig);
        super(props);
        this.params = this.props.param.paramToObject();    //参数列表
        this.orderId = this.params.orderId;    //订单ID
        this.id = this.params.id;    //项目ID
        this.question = this.params.question;    //项目内容
        this.state = {chosenArr:'' == this.question ? [] : this.question.split(',')};
        this.crumbs = [
            {text:'订单处理',key:0,e:'order'},
            {text:'衣物检查',key:1,e:'check',param:'id='+this.orderId},
            {text:'问题描述',key:3}
        ];
        this.toggleOption = this.toggleOption.bind(this);    //选项选中取消操作
        this.cancelChecked = this.cancelChecked.bind(this);    //取消选中操作
        this.confirm = this.confirm.bind(this);
    }

    toggleOption(isChoose,value) {
        if (isChoose) {
            this.state.chosenArr.push(value);
        } else {
            let index = value.inArray(this.state.chosenArr);
            this.state.chosenArr.splice(index,1);
        }
        this.setState({chosenArr:this.state.chosenArr});
    }

    cancelChecked(e) {
        let value = e.target.parentNode.innerText,
            index = value.inArray(this.state.chosenArr);
        this.state.chosenArr.splice(index,1);
        this.setState({chosenArr:this.state.chosenArr});
    }

    confirm() {
        let state = this.state,
            props = this.props;
        if (state.length < 0) return;
        axios.post(api.U('questionSubmit'),api.data({token:props.token,id:this.id,item_note:state.chosenArr.toString()}))
        .then((response) => {
            console.log(response.data);
            if (api.verify(response.data)) {
                props.changeView({element:'check',param:'id=' + this.orderId});
            }
        });
    }


    render() {
        let props = this.props,
        state = this.state,
        chosenHtml = state.chosenArr.map((obj) =>
            <div className='ui-chosen-item' key={obj}>
                {obj}<em className='ui-chosen-item-cancel' onClick={this.cancelChecked}></em>
            </div>
        ),
        html = questionConfig.options.map((obj,index) =>
            <QCmenu 
                key={index} 
                header={questionConfig.headers[index]} 
                options={obj}
                chosenArr={state.chosenArr}
                callback={this.toggleOption}
            />
        );
        console.log(state.chosenArr);
        return (
            <div>
                <Crumbs crumbs={this.crumbs} callback={props.changeView}/>
                <div className='ui-container'>
                    <div className='ui-box'>
                        <div className='ui-question-choose-word'>已选择:</div>
                        <div className='ui-question-choose-bar'>{chosenHtml}</div>
                        <input type='button' value='确认' className='ui-btn-tab' onClick={this.confirm}/>
                    </div>
                    <div className='ui-box-column' style={{paddingTop:'21px'}}>{html}</div>
                </div>
            </div>
        );
    }
}

export default Question;