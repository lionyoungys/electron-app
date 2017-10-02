/**
 * 订单处理组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import '../static/api';
import Crumbs, {Tabs,Search} from '../static/UI';
class Order extends Component {
    constructor(props) {
        super(props);
        this.state = {choose:0,data:null};
        this.handleClick = this.handleClick.bind(this);
        //选项卡参数
        this.tabs = [
            {key:0,text:'待处理'},
            {key:1,text:'待收件'},
            {key:2,text:'待清洗'},
            {key:3,text:'清洗中'},
            {key:4,text:'待送达'}
        ];
        //表格头部模型
        this.theadsModel = [
            <tr className='ui-tr-h'>
                <td>订单号</td>
                <td>预约上门时间</td>
                <td>姓名</td>
                <td>电话</td>
                <td>地址</td>
                <td>时间</td>
                <td>处理</td>
            </tr>,
            <tr className='ui-tr-h'>
                <td>订单号</td>
                <td>项目</td>
                <td>工艺加价</td>
                <td>件数</td>
                <td>总价</td>
                <td>姓名／电话</td>
                <td>地址</td>
                <td>时间</td>
                <td>操作</td>
            </tr>
        ];
        //表格头部内容
        this.theads = [
            this.theadsModel[0],
            this.theadsModel[0],
            this.theadsModel[1],
            this.theadsModel[1],
            this.theadsModel[1]
        ];
        //订单进程列表对应状态
        this.process = [this.willDispose,this.willTake,this.willClean,this.cleaning,this.willDelivery];
    }
    componentDidMount() {
        axios.post(api.U('orderHandle'),api.data({token:this.props.token,state:0}))
        .then((response) => {
            let result = response.data,
                data = this.process[0](result.data);
            this.setState({data:data});
            console.log(result);
        });
    }
    handleClick(e) {
        let state = e.target.dataset.key;
        axios.post(api.U('orderHandle'),api.data({token:this.props.token,state:state}))
        .then((response) => {
            let result = response.data,
                data = this.process[state](result.data);
            this.setState({choose:state,data:data});
            console.log(result);
        });
    }
    handleSearch(e) {
        console.log(e.target.dataset.word);
    }
    //待处理
    willDispose(data) {
        let items = data.map((obj) => 
            <tr key={obj.id} className='ui-tr-d'>
                <td>{obj.ordersn}</td>
                <td className='ui-red'>{obj.time}</td>
                <td>{obj.name}</td>
                <td>{obj.phone}</td>
                <td>{obj.adr}</td>
                <td>{obj.create_time}</td>
                <td>
                    <div className='ui-box-between'>
                        <input data-id={obj.id} type='button' value='取消订单' className='ui-btn ui-btn-cancel'/>
                        <input data-id={obj.id} type='button' value='确认订单' className='ui-btn ui-btn-confirm'/>
                    </div> 
                </td>
            </tr>
        );
        return items;
    }
    //待收件
    willTake(data) {
        let items = data.map((obj) => 
            <tr key={obj.id} className='ui-tr-d'>
                <td>{obj.ordersn}</td>
                <td className='ui-red'>{obj.time}</td>
                <td>{obj.name}</td>
                <td>{obj.phone}</td>
                <td>{obj.adr}</td>
                <td>{obj.create_time}</td>
                <td>
                    <div className='ui-box-between'>
                        <input data-id={obj.id} type='button' value='取消订单' className='ui-btn ui-btn-cancel'/>
                        <input data-id={obj.id} type='button' value='添加项目' className='ui-btn ui-btn-confirm'/>
                    </div> 
                </td>
            </tr>
        );
        return items;
    }
    //待清洗
    willClean() {
        return null;
    }
    //清洗中
    cleaning() {
        return null;
    }
    //待送达
    willDelivery() {
        return null;
    }

    render() {
        let state = this.state;
        return (
            <div>
                <Crumbs crumbs={[{text:'订单处理',key:1}]} callbackParent={this.props.changeView}/>
                <section className='ui-container'>
                    <div className='ui-box-between'>
                        <Tabs tabs={this.tabs} choose={state.choose} callbackParent={this.handleClick}/>
                        <Search placeholder='请输入订单号' callbackParent={this.handleSearch}/>
                    </div>
                    <div className='ui-content'>
                        <table className='ui-table ui-table-b'>
                            <thead>{this.theads[state.choose]}</thead>
                            <tbody>{state.data}</tbody>
                        </table>
                    </div>
                </section>
            </div>
        );
    }
}

export default Order;