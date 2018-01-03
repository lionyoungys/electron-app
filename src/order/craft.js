/**
 * 工艺加价组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import '../api';
import Check from './check';
import Crumbs, {Tabs, LayerDate} from '../static/UI';

class Craft extends Component{
    constructor(props) {
        super(props);
        this.params = this.props.param.paramToObject();
        this.id = this.params.id;
        this.state = {
            total:0,amount:0,freight:0,count:0,service:0,items:[],
            tempId:null,Date:[],hasChange:false,tempId:null
        };
        this.crumbs = [
            {text:'订单处理',key:0,e:'order'},
            {text:'添加项目',key:1,e:'item',param:this.props.param},
            {text:'工艺加价',key:2}
        ];    //面包屑参数
        //判断来源
        if ('undefined' !== typeof this.params.from && 'offline' == this.params.from) {
            this.crumbs = [
                {key:0,text:'收衣',e:'take'},
                {text:'添加项目',key:1,e:'item',param:this.props.param},
                {text:'工艺加价',key:2}
            ];
        }
        this.callback = this.callback.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.chooseDate = this.chooseDate.bind(this);
        this.onConfirmRequest = this.onConfirmRequest.bind(this);
    }
    componentDidMount() {
        let props = this.props;
        axios.post(api.U('editorPrice'),api.data({token:props.token,id:this.id}))
        .then((response) => {
            let result = response.data.data;
            this.setState({
                total:result.total,
                amount:result.amount,
                freight:result.freight,
                count:result.total_num,
                service:result.fuwu,
                items:result.list
            });
            console.log(result);
        });
    }

    callback() {
        let verify = true,
            state = this.state,
            props = this.props;
        state.items.map(obj => {
            if ('' == obj.clean_number) {
                verify = false;  
            } else {
                axios.post(
                    api.U('updateItemInfo'),
                    api.D({
                        token:this.props.token,
                        item_id:obj.id,
                        special:obj.special,
                        special_comment:obj.special_comment,
                        hedging:obj.hedging,
                        take_time:obj.take_time,
                        clean_number:obj.clean_number
                    })
                )
            }
        });
        return verify;
    }

    chooseDate(e) {
        console.log(e.target.dataset.id);
        let id = e.target.dataset.id;
        axios.post(api.U('getDateTime'),api.D({token:this.props.token}))
        .then(response => {
            this.setState({isShow:true,Date:response.data.data,tempId:id});
            console.log(response.data.data);
        });
    }

    onConfirmRequest(value, id) {
        let items = this.state.items;
        let index = id.inObjectArray(items, 'id');
        items[index].take_time = value;
        this.setState({isShow:false, items:items, hasChange:true});
    }

    handleChange(e) {
        let data = e.target.dataset,
            items = this.state.items;
        let index = data.id.inObjectArray(items, 'id');
        items[index][data.key] = e.target.value;
        this.setState({items:items,hasChange:true});
    }

    render() {
        let state = this.state,
            props = this.props,
            style = {flexDirection:'row-reverse'},
            style2 = {paddingRight:'56px',fontSize:'16px',lineHeight:'42px'},
            html = state.items.map((obj) => 
            <tr className='ui-tr-d' key={obj.id}>
            <td>{obj.g_name}</td>
            <td>
                <input
                    type='text'
                    value={obj.clean_number}
                    data-key='clean_number'
                    data-id={obj.id}
                    onChange={this.handleChange}
                />
            </td>
            <td>{obj.price}</td>
            <td>
                <input
                    type='text'
                    value={obj.hedging}
                    data-key='hedging'
                    data-id={obj.id}
                    onChange={this.handleChange}
                />
            </td>
            <td>{Math.floor(obj.hedging * 100 / 200) / 100}</td>
            <td>
                <input
                    type='text'
                    value={obj.special}
                    data-key='special'
                    data-id={obj.id}
                    onChange={this.handleChange}
                />
            </td>
            <td>
                <input
                    type='text'
                    value={obj.take_time}
                    readOnly
                />
                <span 
                   style={{fontSize:'16px',color:'#09b1b0'}}
                   onClick={this.chooseDate}
                   data-id={obj.id}
                >修改</span>
            </td>
            <td>
                <input
                    type='text'
                    value={obj.special_comment}
                    data-key='special_comment'
                    data-id={obj.id}
                    onChange={this.handleChange}
                    maxLength='20'
                />
            </td>
        </tr>
            );
        return (
            <div>
                <Crumbs crumbs={this.crumbs} callback={this.props.changeView}/>
                <section className='ui-container'>
                    <div className='ui-content'>
                        <table className='ui-table-b'>
                            <thead><tr className='ui-tr-h ui-fieldset'>
                                <th>名称</th>
                                <th>衣物编码</th>
                                <th>价格</th>
                                <th>保值金额</th>
                                <th>保值清洗费</th>
                                <th>特殊工艺加价</th>
                                <th>取衣时间</th>
                                <th>备注</th>
                            </tr></thead>
                            <tbody>{html}</tbody>
                        </table>
                    </div>
                    <div className='ui-content' style={style}>
                        <div>
                            <input 
                                type='button' 
                                value='-/+' 
                                className='ui-btn ui-btn-tab' 
                                data-param={props.param} 
                                data-e='item'
                                onClick={props.changeView}
                            />
                        </div>
                        <div style={{lineHeight:'42px',paddingRight:'32px',fontSize:'20px'}}>
                            总额：<span className='ui-red'>&yen;{state.total}</span>
                        </div>
                        <div style={style2}>运费：<span className='ui-red'>{state.freight}</span></div>
                        <div style={style2}>价格：<span className='ui-red'>{state.amount}</span></div>
                        <div style={style2}>共<span className='ui-red'>&nbsp;{state.count}&nbsp;</span>件</div>
                    </div>
                </section>
                <Check orderId={this.id} changeView={props.changeView} from='online' callback={this.callback} token={props.token}/>
                <div style={{height:'80px'}}></div>
                <LayerDate 
                    show={state.isShow} 
                    onCloseRequest={() => this.setState({isShow:false})}
                    Date={state.Date}
                    id={state.tempId}
                    onConfirmRequest={this.onConfirmRequest}
                />
            </div>
        );
    }
}

export default Craft;