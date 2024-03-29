/**
 * 线上订单添加项目组件
 * @author yangyunlong
 */
import React from 'react';
import Clothes from '../UI/clothes/App';
import Problem from '../UI/problem/App';
import Item from '../UI/item/App';
import ItemInfo from '../UI/item_info/App';
import ItemCost from '../UI/item_cost/App';
import './App.css';

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            category:[],
            item:[],
            index:0,
            itemAmount:0,
            clothesShow:false,
            clothes:[],
            type:null,
            data:[],
            amount:0,
            handleIndex:null,
            trace:null,
            freightData:{},
            freightPrice:0
        };
        this.handleTabClick = this.handleTabClick.bind(this);
        this.handleClothesClick = this.handleClothesClick.bind(this);
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
        this.handleSnChange = this.handleSnChange.bind(this);
        this.handleProblemSubmit = this.handleProblemSubmit.bind(this);
        this.handleCraftDes = this.handleCraftDes.bind(this);
        this.handleCraftPrice = this.handleCraftPrice.bind(this);
        this.handleKeepPrice = this.handleKeepPrice.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.reloadAmount = this.reloadAmount.bind(this);
        this.copy = this.copy.bind(this);
    }
    componentDidMount() {
        axios.post(api.U('take_piece'),api.D({token:this.props.token,oid:this.props.param}))
        .then(response => {
            if (api.V(response.data)) {
                let result = response.data.result,
                    len = result.length,
                    tempLen = 0,
                    tempItem = null,
                    itemCount = 0;
                for (let i = 0;i < len;++i) {
                    this.state.category.push({key:i,value:result[i].cate_name});
                    this.state.item.push(result[i].items);
                    tempLen = result[i].items.length;
                    for (let j = 0;j < tempLen;++j) {
                        itemCount = result[i].items[j].item_count;
                        if (itemCount > 0) {
                            for (let c = 0;c < itemCount;++c) {
                                tempItem = tool.getObjectByValue(result[i].items[j]);
                                tempItem.problem = {options:[],content:tempItem.item_flaw};
                                tempItem.forecast = {options:[],content:tempItem.item_forecast};
                                this.state.data.push( tempItem );
                            }
                        }
                    }
                }
                this.setState({
                    category:this.state.category,
                    item:this.state.item,
                    data:this.state.data,
                    freightData:response.data.freight
                });
                this.reloadAmount();
            }
        });
    }
    copy(e) {
        let item = tool.getObjectByValue(this.state.data[e.target.dataset.index]);
        item.clean_sn = '';
        this.state.data.push(item);
        this.setState({data:this.state.data});
        this.reloadAmount();
    }
    reloadAmount() {
        let data = this.state.data,
            len = data.length, 
            freightData = this.state.freightData,
            freightPrice = 0,
            itemAmount = 0,
            amount = 0;
        for (let i = 0;i < len;++i) {
            amount = tool.sum(
                amount,
                data[i].item_real_price,
                (tool.isSet(data[i].keep_price) ? data[i].keep_price : 0),
                (tool.isSet(data[i].craft_price) ? data[i].craft_price: 0)
            );
            itemAmount = tool.sum(itemAmount, data[i].item_real_price);
        }
        let validation = (0 != freightData.freight_free_num && 0 != freightData.freight_free_amount),
            validation2 = (len < freightData.freight_free_num && itemAmount < freightData.freight_free_amount);
        if (validation && validation2) freightPrice = freightData.freight_price;
        this.setState({amount:tool.sum(amount, freightPrice), itemAmount:itemAmount, freightPrice:freightPrice});
    }
    handleDeleteClick(dom, index) {
        if (tool.isSet(dom)) {
            dom.onclick = (e => {
                this.state.data.splice(index, 1);
                this.setState({data:this.state.data,handleIndex:null});
                this.reloadAmount();
                e.stopPropagation()
            });
        }
    }
    handleTabClick(e) {this.setState({index:e.target.dataset.key,clothesShow:true})}
    handleClothesClick(index) {
        let item = tool.getObjectByValue(this.state.item[this.state.index][index]);
        item.problem = {options:[],content:item.item_flaw};
        item.forecast = {options:[],content:item.item_forecast};
        let takeTime = tool.date('Y年m月d日', Math.floor( ( (new Date()).valueOf() + (item.item_cycle * 1000 * 60 * 60 * 24) ) / 1000))
        item.take_time = takeTime + '09:00~12:00';
        this.state.data.push(item);
        this.setState({
            data:this.state.data,
            clothesShow:false,
            trace:'color',
            type:'color',
            handleIndex:(this.state.data.length - 1)
        });
        this.reloadAmount();
    }
    handleSnChange(e) {
        if (null !== this.state.handleIndex) {
            this.state.data[this.state.handleIndex].clean_sn = e.target.value;
            this.setState({data:this.state.data});
        }
    }
    handleCraftDes(e) {
        if (null !== this.state.handleIndex) {
            this.state.data[this.state.handleIndex].craft_des = e.target.value;
            this.setState({data:this.state.data});
        }
    }
    handleCraftPrice(e) {
        if (null !== this.state.handleIndex) {
            let value = e.target.value;
            if (isNaN(value)) return;
            this.state.data[this.state.handleIndex].craft_price = value;
            this.setState({data:this.state.data});
            this.reloadAmount();
        }
    }
    handleKeepPrice(e) {
        if (null !== this.state.handleIndex) {
            let value = e.target.value;
            if (isNaN(value)) return;
            this.state.data[this.state.handleIndex].keep_amount = value;
            this.state.data[this.state.handleIndex].keep_price = ( Math.floor(value * 100 / 200) / 100 );
            this.setState({data:this.state.data});
            this.reloadAmount();
        }
    }
    handleProblemSubmit(value, options) {
        if (null !== this.state.handleIndex) {
            this.state.data[this.state.handleIndex][this.state.type] = {options:options,content:value};
            let type = null;
            if ('color' == this.state.trace && 'color' == this.state.type) type = 'problem';
            this.setState({data:this.state.data,type:type,trace:type});
        }
    }
    handleSubmit() {
        let data = this.state.data,
            len = data.length;
        if (len < 1) return;
        let request = [],
            temp = {};
        for (let i = 0;i < len;++i) {
            if (!tool.isSet(data[i].clean_sn)) return alert('尚有项目未填写衣物编码!');
            if (!tool.isSet(data[i].color)) return alert('尚有项目未选择颜色!');
            if (!tool.isSet(data[i].problem)) return alert('尚有项目未选择问题!');
            temp = {
                item_id:data[i].id,
                clean_sn:data[i].clean_sn,
                color:JSON.stringify(data[i].color),
                problem:JSON.stringify(data[i].problem),
                forecast:( tool.isSet(data[i].forecast) ? JSON.stringify(data[i].forecast) : JSON.stringify({options:[],content:''}) ),
                keep_price:( tool.isSet(data[i].keep_price) ? data[i].keep_price : 0),
                craft_price:( tool.isSet(data[i].craft_price) ? data[i].craft_price : 0 ),
                craft_des:( tool.isSet(data[i].craft_des) ? data[i].craft_des : '' )
            };
            request.push(temp);
        }
        axios.post(api.U('item_submit'), api.D({token:this.props.token,oid:this.props.param,items:JSON.stringify(request)}))
        .then(response => {
            if (api.V(response.data)) {
                this.props.changeView({view:'online',param:{checked:'to_take'}});
            } else {
                alert(response.data.msg);
            }
        });
    }

    render() {
        let tabs = this.state.category.map(obj => 
                <span
                    key={obj.key}
                    data-key={obj.key}
                    className='m-tab checked'
                    onClick={this.handleTabClick}
                >{obj.value}</span>
            );
        let html = this.state.data.map((obj, index) => 
                <tr
                    key={index}
                    className={'m-text-c m-pointer' + ( this.state.handleIndex == index ? ' oai-checked' : '' )}
                    onClick={() => this.setState({handleIndex:index})}
                >
                    <td>{obj.item_name}</td>
                    <td>{obj.clean_sn}</td>
                    <td>{obj.item_real_price}</td>
                    <td>{obj.keep_price}</td>
                    <td>{obj.craft_price}</td>
                    <td>
                        <button
                            type='button'
                            className='m-btn confirm'
                            data-index={index}
                            onClick={this.copy}
                        >复制</button>
                        &nbsp;
                        <button
                            type='button'
                            className='m-btn editor'
                            ref={dom => this.handleDeleteClick(dom, index)}
                            data-index={index} 
                        >删除</button>
                    </td>
                </tr>
            );
        let name = '',sn = '', color = '', problem = '', forecast = '',keep_price = '',keep_amount = '',craft_price = '',craft_des = '';
        if (null !== this.state.handleIndex) {
            let item = this.state.data[this.state.handleIndex];
            name = item.item_name;
            sn = tool.isSet(item.clean_sn) ? item.clean_sn : '';
            color = tool.isSet(item.color) ? tool.objToString(item.color): '';
            problem = tool.isSet(item.problem) ? tool.objToString(item.problem): '';
            forecast = tool.isSet(item.forecast) ? tool.objToString(item.forecast): '';
            keep_price = tool.isSet(item.keep_price) ? item.keep_price : '';
            keep_amount = tool.isSet(item.keep_amount) ? item.keep_amount : '';
            craft_price = tool.isSet(item.craft_price) ? item.craft_price : '';
            craft_des = tool.isSet(item.craft_des) ? item.craft_des : '';
        }
        return (
            <div>
                <div className='m-container'>
                    <div>{tabs}</div>
                    <div className='m-box oai-tab-box'>
                        <Item name={name} sn={sn} onChange={this.handleSnChange}/>
                        <ItemInfo
                            color={color}
                            problem={problem}
                            forecast={forecast}
                            handleColor={() => ( null !== this.state.handleIndex && this.setState({type:'color'}) )}
                            handleProblem={() => ( null !== this.state.handleIndex && this.setState({type:'problem'}) )}
                            handleForecast={() => ( null !== this.state.handleIndex && this.setState({type:'forecast'}) )}
                        />
                        <ItemCost
                            keep_price={keep_amount}
                            craft_price={craft_price}
                            craft_des={craft_des}
                            handleKeepPrice={this.handleKeepPrice}
                            handleCraftPrice={this.handleCraftPrice}
                            handleCraftDes={this.handleCraftDes}
                        />
                    </div>
                    <div className='m-box'>
                        <table className='m-table tr-b'>
                            <thead><tr className='m-text-c m-bg-white'>
                                <th>名称</th><th>衣物编码</th><th>价格</th><th>保值清洗费</th><th>工艺加价</th><th>操作</th>
                            </tr></thead>
                            <tbody>{html}</tbody>
                        </table>
                    </div>
                    <div className='m-box'>
                        共&nbsp;<span className='m-red'>{this.state.data.length}</span>&nbsp;件
                        &emsp;
                        运费：<span className='m-red'>{this.state.freightPrice}</span>
                        &emsp;
                        项目价格：<span className='m-red'>{this.state.itemAmount}</span>
                        &emsp;
                        总价：<span className='m-red'>{this.state.amount}</span>
                    </div>
                    <div className='m-box'>
                        <button type='button' className='m-btn confirm middle' onClick={this.handleSubmit}>确认收件</button>
                    </div>
                </div>
                <Clothes
                    show={this.state.clothesShow}
                    title={(this.state.category.length > 0 ? this.state.category[this.state.index].value : null)}
                    data={(this.state.item.length > 0 ? this.state.item[this.state.index] : [])}
                    onClick={this.handleClothesClick}
                    onCloseRequest={() => this.setState({clothesShow:false})}
                />
                <Problem
                    color={color}
                    problem={problem}
                    forecast={forecast}
                    type={this.state.type}
                    onCloseRequest={() => this.setState({type:null})}
                    onConfirmRequest={this.handleProblemSubmit}
                />
            </div>
        );
    }
}
