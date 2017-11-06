/**
 * 问题描述
 * @author yangyunlong
 */
import React, {Component} from 'react';
import '../static/api';
import Crumbs,{QCmenu,QCtextarea} from '../static/UI';
import {questionConfig} from '../static/config';

class Question extends Component {
    constructor(props) {
        console.log(questionConfig);
        super(props);
        this.params = this.props.param.paramToObject();    //参数列表
        this.orderId = this.params.orderId;    //订单ID
        this.id = this.params.id;    //项目ID
        this.question = this.params.question;    //项目内容
        this.redirectParam = 'id='+this.orderId+'&from='+this.params.from;
        this.state = {chosenArr:'' == this.question ? [] : this.question.split(',')};
        this.crumbs = [
            {text:'订单处理',key:0,e:'order'},
            {text:'衣物检查',key:1,e:'check',param:this.redirectParam},
            {text:'问题描述',key:2}
        ];
        if ('undefined' !== typeof this.params.from && 'offline' == this.params.from) {
            this.crumbs = [
                {text:'收衣',key:0,e:'take'},
                {text:'添加项目',key:1,e:'item',param:this.redirectParam},
                {text:'工艺加价',key:2,e:'offline_craft',param:this.redirectParam},
                {text:'衣物检查',key:3,e:'check',param:this.redirectParam},
                {text:'问题描述',key:4}
            ];
        }

        this.toggleOption = this.toggleOption.bind(this);    //选项选中取消操作
        this.cancelChecked = this.cancelChecked.bind(this);    //取消选中操作
        this.confirm = this.confirm.bind(this);
        this.filtration = this.filtration.bind(this);
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

    filtration() {
        let retArr = [],retLen = 0,
            tempArr,tempLen,tempLen2,tempIndex,
            options = questionConfig.options,
            len = options.length;
        let stateLen = this.state.chosenArr.length;
        if (stateLen < 1) return '';
        retLen = this.state.chosenArr.length;
        for (let i = 0;i < retLen;++i) {
            retArr.push(this.state.chosenArr[i]);
        }
        for (let i = 0;i < len;++i) {
            tempLen = options[i].length;
            for (let j = 0;j < tempLen;++j) {
                tempArr = options[i][j].list;
                tempLen2 = tempArr.length;
                for (let n = 0;n < tempLen2;++n) {
                    tempIndex = tempArr[n].inArray(retArr);
                    if (-1 !== tempIndex) {
                        retArr.splice(tempIndex, 1);
                    }
                }
            }
        }
        return retArr;
    }


    confirm(value) {
        let state = this.state,
            props = this.props;
        if (state.length < 0) return;
        let question = state.chosenArr.toString();
        if ('' == question) {
            question += value;
        } else {
            question += ',' + value;
        }
        axios.post(api.U('questionSubmit'),api.data({token:props.token,id:this.id,item_note:question}))
        .then((response) => {
            console.log(response.data);
            if (api.verify(response.data)) {
                props.changeView({element:'check',param:this.redirectParam});
            }
        });
    }


    render() {
        let props = this.props,
            state = this.state,
            value = this.filtration(),
            html = questionConfig.options.map((obj,index) =>
                <QCmenu 
                    key={index} 
                    header={questionConfig.headers[index]} 
                    options={obj}
                    chosenArr={state.chosenArr}
                    callback={this.toggleOption}
                />
            );
        let tempArr = state.chosenArr.filtration(value),
            chosenHtml = tempArr.map(obj =>
                <div className='ui-chosen-item' key={obj}>
                    {obj}<em className='ui-chosen-item-cancel' onClick={this.cancelChecked}></em>
                </div>
            );
        console.log(state.chosenArr);
        return (
            <div>
                <Crumbs crumbs={this.crumbs} callback={props.changeView}/>
                <div className='ui-container'>
                    <QCtextarea 
                        callback={this.confirm} 
                        value={value.toString()}
                        title='您可输入具体问题或选择问题'
                        placeholder='请输入具体问题'
                    />
                    <div className='ui-box' style={{paddingTop:'20px'}}>
                        <div className='ui-question-choose-word'>已选择:</div>
                        <div className='ui-question-choose-bar'>{chosenHtml}</div>
                    </div>
                    <div className='ui-box-column' style={{paddingTop:'21px'}}>{html}</div>
                </div>
            </div>
        );
    }
}

export default Question;