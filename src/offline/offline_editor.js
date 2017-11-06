/**
 * 线下工艺加价编辑组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import '../static/api';
import Crumbs from '../static/UI';

export default class OfflineEditor extends Component{
    constructor(props) {
        super(props);
        this.params = this.props.param;
        this.redirectParam = 'id=' + this.params.order_id + '&from=offline'
        this.crumbs = [
            {key:0,text:'收衣',e:'take'},
            {text:'添加项目',key:1,e:'item',param:this.redirectParam},
            {text:'工艺加价',key:2,e:'offline_craft',param:this.redirectParam},
            {text:'编辑',key:3}
        ];
        this.state = {code:'',hedging:'',comment:'',special:'',takeDate:''};
        this.chooseDate = this.chooseDate.bind(this);
    }

    chooseDate() {
        axios.post(api.U('getDateTime'),api.D({token:this.props.token}))
        .then(response => {
            console.log(response.data);
        });
    }

    render() {
        let props = this.props,
            state = this.state;
        return (
            <div>
                <Crumbs crumbs={this.crumbs} callback={props.changeView}/>
                <section className='ui-container'>
                    <div className='ui-oe-row'>衣物编码</div>
                    <div>
                       <input 
                           className='ui-oe-input' 
                           type='text' 
                           value={state.code}
                           placeholder='您可输入衣物编码/扫一扫'
                           onChange={e => this.setState({code:e.target.value})}
                       />
                    </div>
                    <div className='ui-oe-row'>特殊工艺加价</div>
                    <div style={{marginBottom:'21px'}}>
                        <label>特殊工艺加价：</label>
                        <div className='ui-oe-box'>
                            <input 
                                type='text' 
                                value={state.special} 
                                onChange={e => this.setState({special:e.target.value})}
                            />
                            <em>元</em>
                        </div>
                    </div>
                    <div>
                        <label>&emsp;&emsp;&emsp;&emsp;备注：</label>
                        <div className='ui-oe-box2'>
                            <textarea 
                                maxLength='20' 
                                value={state.comment} 
                                onChange={e => this.setState({comment:e.target.value})}
                            ></textarea>
                            <em className='ui-textarea-postfix'>{state.comment.length}/20</em>
                        </div>
                    </div>
                    <div className='ui-oe-row'>保值金额</div>
                    <div>
                        <div className='ui-oe-box'>
                            <input 
                                type='text' 
                                value={state.hedging} 
                                onChange={e => this.setState({hedging:e.target.value})}
                            />
                            <em>元</em>
                        </div>
                    </div>
                    <div className='ui-oe-row'>取衣时间</div>
                    <div>
                        <input 
                           className='ui-oe-input' 
                           type='text' 
                           value={state.takeDate}
                           style={{marginRight:'19px'}}
                           readOnly
                       />
                       <span 
                           style={{fontSize:'16px',color:'#09b1b0'}}
                           onClick={this.chooseDate}
                        >修改</span>
                    </div>
                    <div style={{marginTop:'41px'}}>
                        <input type='button' value='确定' className='ui-btn ui-btn-confirm ui-btn-large'/>
                    </div>
                </section>
            </div>
        );
    }
}