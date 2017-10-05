/**
 * 添加项目组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import '../static/api';
import Crumbs, {Tabs,Math} from '../static/UI';
class Item extends Component {
    constructor(props) {
        super(props);
        this.state = {choose:0,tabs:[],data:[],items:[],count:0};
        this.crumbs = [{text:'订单处理',key:0,e:'order'},{text:'添加项目',key:1}];    //面包屑参数
        this.handleClick = this.handleClick.bind(this);    //切换tab方法
    }
    componentDidMount() {    //获取项目列表
        let token = this.props.token,
            orderId = this.props.param;
        axios.post(api.U('getItems'),api.data({token:token,orderid:orderId}))
        .then((response) => {
            let result = response.data.data,
                len = result.length;
            var tempLen,j,count = 0,tempTabs = [],tempData = [],tempItems = [];
            for (var i = 0;i < len;++i) {
                tempTabs.push({key:i,text:result[i].type_name});    //获取所有选项卡
                tempData.push(result[i].type);    //获取所有选项卡对应的数据
                tempLen = result[i].type.length;
                for (j = 0;j < tempLen;++j) {
                    if (0 != result[i].type[j].state_type) {
                        count += result[i].type[j].num * 1;    //获取已选择件数的总数
                        tempItems.push({    //获取所有已选择的项目
                            orderid:orderId,
                            type:result[i].type[j].id,
                            price:result[i].type[j].price,
                            itemcount:result[i].type[j].num
                        });
                    }
                    
                }
            }
            this.setState({tabs:tempTabs,data:tempData,items:tempItems,count:count});
            console.log(tempData);
        });
    }
    //切换tab方法
    handleClick(e) {this.setState({choose:e.target.dataset.key});}
    render() {
        let props = this.props,
            state = this.state,
            html = null;
        if (state.data.length > 0) {
            html = state.data[state.choose].map((obj) => 
                <Row 
                    key={obj.id} 
                    id={obj.id} 
                    name={obj.name} 
                    price={obj.price} 
                    number={(() => {
                        let index = obj.id.inObjectArray(state.items,'type');
                        if (-1 !== index) return state.items[index].itemcount;
                        return 0;
                    })()}
                />
            );
        }
        return (
            <div>
                <Crumbs crumbs={this.crumbs} callback={props.changeView}/>
                <section className='ui-container'>
                    <div className='ui-box-between'>
                        <Tabs tabs={state.tabs} choose={state.choose} callback={this.handleClick}/>
                        <div className='ui-box-between'>
                            <div style={{height:'42px',lineHeight:'42px',minWidth:'106px',width:'auto'}}>
                                已选择&nbsp;<span className='ui-red'>{state.count}</span>&nbsp;件
                            </div>
                            <input type='button' value='下一步，工艺加价' className='ui-btn ui-btn-tab'/>
                        </div>
                    </div>
                    <section className='ui-content'>
                        <table className='ui-table'>
                            <thead><tr className='ui-tr-h ui-fieldset'>
                                <td>名称</td><td>所属分类</td><td>价格</td><td>件数</td>
                            </tr></thead>
                            <tbody className='ui-fieldset'>
                                {html}
                            </tbody>
                        </table>
                    </section>
                </section>
            </div>
        );
    }
}
class Row extends Component {
    constructor(props) {
        super(props);
        this.state = {number:this.props.number,isChoosing:0 == this.props.number ? false : true};
        this.toggleChecked = this.toggleChecked.bind(this);    //复选框选中取消方法
        this.onMath = this.onMath.bind(this);    //计算件数方法
    }
    //复选框选中取消方法
    toggleChecked(e) {
        let target = e.target;
        if (target.classList.contains('ui-checked')) {
            this.setState({number:0});
        } else {
            //选中样式
            this.setState({number:1});
        }
        target.classList.toggle('ui-checked');
    }
    //计算件数方法
    onMath(isAdd) {
        let number = this.state.number * 1,nowNumber;
        if (isAdd) {    //添加操作
            nowNumber = number + 1;
            this.setState({number:nowNumber});
            if (1 == nowNumber) this.setState({isChoosing:true});
        } else {    //减少操作
            if (number < 1) return;
            nowNumber = number - 1;
            this.setState({number:nowNumber});
            if (0 == nowNumber) this.setState({isChoosing:false});
        }
    }
    render() {
        let props = this.props,
            state = this.state;
        return (
            <tr className='ui-tr-d'>
            <td style={{textAlign:'left',paddingLeft:'24px'}}>
                <span 
                    className={'ui-checkbox' + (state.isChoosing ? ' ui-checked' : '')} 
                    onClick={this.toggleChecked}
                >{props.name}</span>
            </td>
            <td>{props.category}</td>
            <td className='ui-red'>{props.price}</td>
            <td><Math callback={this.onMath}>{state.number}</Math></td>
        </tr>
        );
    }
}
export default Item;