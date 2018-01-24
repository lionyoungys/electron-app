/**
 * 线上订单添加项目组件
 * @author yangyunlong
 */
import React from 'react';
import Crumb from '../UI/crumb/App';
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
            clothesShow:false,
            clothes:[],
            type:null,
            data:[],
            handleId:null,
            handleIndex:null
        };
        this.handleTabClick = this.handleTabClick.bind(this);
        this.handleClothesClick = this.handleClothesClick.bind(this);
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
        this.handleUploadClick = this.handleUploadClick.bind(this);
        this.handleSnChange = this.handleSnChange.bind(this);
        this.colorConfirm = this.colorConfirm.bind(this);
        this.problemConfirm = this.problemConfirm.bind(this);
        console.log(this.props.param);
    }
    componentDidMount() {
        axios.post(api.U('take_piece'),api.D({token:this.props.token,oid:this.props.param}))
        .then(response => {
            if (api.V(response.data)) {
                let result = response.data.result,
                    len = result.length,
                    tempLen = 0,
                    itemCount = 0;
                console.log(result);
                for (let i = 0;i < len;++i) {
                    this.state.category.push({key:i,value:result[i].cate_name});
                    this.state.item.push(result[i].items);
                    tempLen = result[i].items.length;
                    for (let j = 0;j < tempLen;++j) {
                        itemCount = result[i].items[j].item_count;
                        if (itemCount > 0) {
                            for (let c = 0;c < itemCount;++c) {
                                this.state.data.push(result[i].items[j]);
                            }
                        }
                    }
                }
                this.setState({category:this.state.category,item:this.state.item,data:this.state.data});
            }
        });
    }

    handleTabClick(e) {this.setState({index:e.target.dataset.key,clothesShow:true})}
    handleClothesClick(index) {
        let item = this.state.item[this.state.index][index];
        this.state.data.push(item);
        this.setState({data:this.state.data,clothesShow:false});
        console.log(item);
    }
    handleUploadClick(e) {

    }
    handleDeleteClick(e) {
        this.state.data.splice(e.target.dataset.index, 1);
        this.setState({data:this.state.data,handleId:null,handleIndex:null});
    }
    handleSnChange(e) {
        if (null !== this.state.handleIndex) {
            this.state.data[this.state.handleIndex].clean_sn = e.target.value;
            this.setState({data:this.state.data});
        }
    }
    colorConfirm(value, options) {
        console.log(value);
        console.log(options);
    }
    problemConfirm(value, options) {
        console.log(value);
        console.log(options);
    }

    render() {
        let state = this.state,
            title = (state.category.length > 0 ? state.category[state.index].value : null),
            data = (state.item.length > 0 ? state.item[state.index] : []),
            problemHandle = null === this.state.type ? null : this[this.state.type + 'Confirm'],
            tabs = this.state.category.map(obj => 
                <span
                    key={obj.key}
                    data-key={obj.key}
                    className='m-tab checked'
                    onClick={this.handleTabClick}
                >{obj.value}</span>
            ),
            html = this.state.data.map((obj, index) => 
                <tr
                    key={index}
                    className={'m-text-c m-pointer' + ( this.state.handleIndex == index ? ' oai-checked' : '' )}
                    onClick={() => this.setState({handleId:obj.id, handleIndex:index})}
                >
                    <td>{obj.item_name}</td>
                    <td>{obj.clean_sn}</td>
                    <td>{obj.item_real_price}</td>
                    <td>{obj.keep_price}</td>
                    <td>{obj.craft_price}</td>
                    <td>
                        <button type='button' className='m-btn confirm' data-index={index} data-id={obj.id} onClick={this.handleUploadClick}>添加图片</button>
                        &nbsp;&nbsp;
                        <button type='button' className='m-btn editor'data-index={index} data-id={obj.id} onClick={this.handleDeleteClick}>删除</button>
                    </td>
                </tr>
            );
        let name = '',sn = '', color = '', problem = '', forecast = '',keep_price = '',craft_price = '',craft_des = '';
        if (null !== this.state.handleIndex) {
            let item = this.state.data[this.state.handleIndex];
            name = item.item_name;
            sn = tool.isSet(item.clean_sn) ? item.clean_sn : '';
            color = tool.isSet(item.color) ? tool.objToString(item.color): '';
            problem = tool.isSet(item.problem) ? tool.objToString(item.problem): '';
            forecast = tool.isSet(item.forecast) ? tool.objToString(item.forecast): '';
            keep_price = tool.isSet(item.keep_price) ? item.keep_price : '';
            craft_price = tool.isSet(item.craft_price) ? item.craft_price : '';
            craft_des = tool.isSet(item.craft_des) ? item.craft_des : '';
        }
        return (
            <div>
                <Crumb data={[{key:0,value:'待收件',view:'online',param:{checked:'to_take'}},{key:1,value:'添加项目'}]} callback={this.props.changeView}/>
                <div className='m-container'>
                    <div>{tabs}</div>
                    <div className='m-box oai-tab-box'>
                        <Item name={name} sn={sn} onChange={this.handleSnChange}/>
                        <ItemInfo
                            color={color}
                            problem={problem}
                            forecast={forecast}
                        />
                        <ItemCost/>
                    </div>
                    <div className='m-box'>
                        <table className='m-table tr-b'>
                            <thead><tr className='m-text-c m-bg-white'>
                                <th>名称</th><th>衣物编码</th><th>价格</th><th>保值清洗费</th><th>工艺加价</th><th>操作</th>
                            </tr></thead>
                            <tbody>{html}</tbody>
                        </table>
                    </div>
                    <div className='m-box' onClick={() => this.setState({type:'problem'})}>problem</div>
                    <div className='m-box' onClick={() => this.setState({type:'color'})}>color</div>
                    <div className='m-box' onClick={() => this.setState({type:'forecast'})}>forecast</div>
                </div>
                <Clothes
                    show={state.clothesShow}
                    title={title}
                    data={data}
                    onClick={this.handleClothesClick}
                    onCloseRequest={() => this.setState({clothesShow:false})}
                />
                <Problem
                    type={this.state.type}
                    onCloseRequest={() => this.setState({type:null})}
                    onConfirmRequest={problemHandle}
                />
            </div>
        );
    }
}