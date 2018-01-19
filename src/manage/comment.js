/**
 * 用户评价组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import '../api';
import Crumb from '../Module/UI/crumb/App';
import {Starts} from '../static/UI';

export default class Comment extends Component {
    constructor(props) {
        super(props);
        this.state = {list:[]};
    }

    componentDidMount() {
        axios.post(api.U('comment'), api.D({token:this.props.token}))
        .then((response) => {
            api.V(response.data) && this.setState({list:response.data.result});
        });
    }

    render() {
        let props = this.props,
            state = this.state,
            html = state.list.map((obj) =>
                <Row key={obj.id} object={obj} token={props.token}/>
            );
        return (
            <div>
                <Crumb data={[{value:'用户评价',key:0}]} callback={props.changeView}/>
                <section className='ui-container'>
                    {html}
                </section>
            </div>
        );
    }
}

class Row extends Component {
    constructor(props) {
        super(props);
        this.state = {info:this.props.object,cancel:true,word:''};
        this.toggleCancel = this.toggleCancel.bind(this);    //回复取消状态切换
        this.handleChange = this.handleChange.bind(this);    //文字内容编辑
        this.handleAnswer = this.handleAnswer.bind(this);    //回复处理
    }

    toggleCancel() {this.setState({cancel:!this.state.cancel});}
    handleChange(e) {this.setState({word:e.target.value});}
    handleAnswer() {
        let state = this.state;
        axios.post(
            api.U('comment'), 
            api.D({
                token:this.props.token,
                id:state.info.id,
                mer_content:state.word
            })
        )
        .then((response) => {
            if (api.verify(response.data)) {
                state.info.manswer = state.word;
                this.setState({info:state.info,word:'',cancel:!state.cancel});
            }
        });
    }


    render () {
        let props = this.props,
            state = this.state,
            info = state.info;
        const answer = null == info.manswer ? false :true;
        return (
            <div className='ui-appraise-box'>
                <div className='ui-appraise-row'>
                    <div>
                        <span>{info.uname}</span>
                            &emsp;<Starts number='5' lighter={info.level}/>&emsp;
                        <span className='ui-red'>{info.level}分</span>
                    </div>
                    {
                        answer ? 
                        null
                        :
                        <input 
                            type='button' 
                            value={state.cancel?'回复':'取消'} 
                            className='m-btn cancel middle'
                            onClick={this.toggleCancel}
                        />
                    }
                </div>
                <div className='ui-appraise-row2'>{tool.currentDate( 'datetime', (info.ctime * 1000) )}</div>
                <div className='ui-appraise-row3'>
                    {info.ucomment}
                </div>
                {
                    answer ?
                    <div className='ui-appraise-row4'>
                        <span className='ui-default'>商家回复：</span>{info.manswer}
                    </div>
                    :
                    null
                }
                {
                    answer || state.cancel ? 
                    null
                    :
                    <div className='ui-appraise-row5'>
                        <div className='ui-appraise-textarea'>
                            <span>商家回复：</span>
                            <textarea maxLength='50' value={state.word} onChange={this.handleChange}></textarea>
                            <em className='ui-textarea-postfix'>{state.word.length}/50</em>
                        </div>
                        <input 
                            type='button' 
                            value='确认' 
                            className='ui-btn ui-btn-confirm ui-btn-large'
                            onClick={this.handleAnswer}
                        />
                    </div>
                }
            </div>
        );
    }
}
