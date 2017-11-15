/**
 * 订单查询组件
 * @author yangyunlong
 */

import React, {Component} from 'react';
import '../static/api';
import Crumbs, {Tabs,Search} from '../static/UI';

export default class OrderSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {choose:1,count:0,data:[]};
        //选项卡参数
        this.tabs = [
            {key:1,text:'今天'},
            {key:2,text:'昨天'},
            {key:3,text:'3日内'},
            {key:4,text:'7日内'},
            {key:5,text:'全部'}
        ];
        this.changeTab = this.changeTab.bind(this);    //选项卡切换
        this.handleSearch = this.handleSearch.bind(this);    //搜索操作
        this.changeViewMiddleWare = this.changeViewMiddleWare.bind(this);
    }

    componentDidMount() {
        axios.post(
            api.U('orderSearch'),
            api.data({
                token:this.props.token,
                state:this.state.choose
            })
        )
        .then((response) => {
            let result = response.data.data;
            this.setState({data:result});
            console.log(result);
        });
    }

    changeTab(e) {
        let key = e.target.dataset.key;
        axios.post(
            api.U('orderSearch'),
            api.data({
                token:this.props.token,
                state:key
            })
        )
        .then((response) => {
            let result = response.data.data;
            console.log(result);
            this.setState({choose:key,data:result});
        });
    }

    handleSearch(word) {
        axios.post(
            api.U('orderHandleSearch'),
            api.data({
                token:this.props.token,
                state:this.state.choose,
                condition:word
            })
        )
        .then((response) => {
            let result = response.data.data;
            this.setState({data:result});
            console.log(result);
        });
    }

    getStatus(code) {
        switch(code) {
            case '0':return '待处理';
            case '1':return '待收件';
            case '2':return '待清洗';
            case '3':return '清洗中';
            case '4':return '待送达';
            case '5':return '已送达';
            case '6':return '订单完成';
            case '11':return '已取消';
            case '12':return '用户取消';
            case '13':return '上挂中';
            case '14':return '用户已取';
            default:return '';
        }
    }

    getItemList(data) {
        if ('undefined' === typeof data) return null;
        let retArr = data.map((obj, index) => 
                <div className='ui-box-between' key={index}>
                    <span>{obj.g_name}</span>
                    <span>{obj.price}</span>
                </div>
            );
        return retArr;
    }

    changeViewMiddleWare(e) {
        let target = e.target,
            status = target.dataset.state;
        if ((status > 0 && status <= 6) || 13 == status || 14 == status) {
            this.props.changeView({element:'order_detail',param:target.dataset.param});
        }
    }

    render() {
        let props = this.props,
            state = this.state,
            html = state.data.map((obj) => 
                <tr className='ui-tr-d' key={obj.id}>
                    <td 
                        className='ui-mv-default' 
                        onClick={this.changeViewMiddleWare} 
                        data-state={obj.state}
                        data-param={'id=' + obj.id}
                    >
                        {obj.ordersn}
                    </td>
                    <td>{this.getItemList(obj.item)}</td>
                    <td>
                        <div className='ui-box-between'>
                            <span>上门服务费</span><span>&yen;{obj.freight}</span>
                        </div>
                        <div className='ui-box-between'>
                            <span>特殊工艺加价</span><span>&yen;{obj.special}</span>
                        </div>
                        <div className='ui-box-between'>
                            <span>保值清洗费</span><span>&yen;{obj.hedging}</span>
                        </div>
                        <div className='ui-box-between'>
                            <span>优惠金额</span><span>&yen;{obj.coupon_price}</span>
                        </div>
                    </td>
                    <td>{obj.sum}</td>
                    <td className='ui-default2'>{obj.amount}</td>
                    <td>{obj.name}<br/>{obj.phone}</td>
                    <td>{obj.adr}</td>
                    <td>{obj.update_time}</td>
                    <td className='ui-default'>{this.getStatus(obj.state)}</td>
                </tr>
            );
        return (
            <div>
                <Crumbs crumbs={[{key:0, text:'订单查询'}]} callback={props.changeView}/>
                <div className='ui-container'>
                    <section className='ui-box-between'>
                        <Tabs tabs={this.tabs} choose={state.choose} callback={this.changeTab}/>
                        <Search placeholder='请输入订单号' callback={this.handleSearch}/>
                    </section>
                    <section className='ui-content'>
                        <table className='ui-table-b'>
                            <thead>
                                <tr className='ui-tr-h'>
                                    <th>订单号</th>
                                    <th>项目</th>
                                    <th>工艺加价</th>
                                    <th>件数</th>
                                    <th>总价</th>
                                    <th>姓名／电话</th>
                                    <th>地址</th>
                                    <th>时间</th>
                                    <th>状态</th>
                                </tr>
                            </thead>
                            <tbody>{html}</tbody>
                        </table>
                    </section>
                </div>
            </div>
        );
    }
}