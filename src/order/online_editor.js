/**
 * 线下工艺加价编辑组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import '../api';
import Crumbs from '../static/UI';

export default class OnlineEditor extends Component{
    constructor(props) {
        super(props);
        this.params = this.props.param;
        console.log(this.params);
        //this.params = {order_id:'1875',id:'5170'}
        //console.log(this.params);
        
        this.crumbs = [
            {text:'订单处理',key:0,e:'order'},
            {text:'添加项目',key:1,e:'item',param:this.params.params},
            {text:'工艺加价',key:2,e:'craft',param:this.params.params},
            {text:'编辑价格',key:3}
        ];    //面包屑参数
        this.state = {code:'',hedging:'',comment:'',special:''};
        this.done = this.done.bind(this);
    }


    done() {
        let state = this.state;
        if ('' !== state.code) {
            axios.post(
                api.U('updateItemInfo'),
                api.D({
                    token:this.props.token,
                    item_id:this.params.id,
                    special:state.special,
                    special_comment:state.comment,
                    hedging:state.hedging,
                    clean_number:state.code
                })
            )
            .then(response => {
                console.log(response.data);
                if (api.verify(response.data)) {
                    this.props.changeView({element:'craft',param:this.params.params});
                }
            });
        }
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
                    <div style={{marginTop:'41px'}}>
                        <input type='button' value='确定' className='ui-btn ui-btn-confirm ui-btn-large' onClick={this.done}/>
                    </div>
                </section>
            </div>
        );
    }
}