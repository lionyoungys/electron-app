/**
 * 订单搜索组件
 * @author yangyunlong
 */

import React from 'react';
import Search from '../UI/search/App';
import Page from '../UI/page/App';
import Empty from '../../Elem/Empty';
import './App.css';

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.props.onRef(this);
        this.state = {isOnline:1,checked:'today',number:'',onSearch:false,data:[],page:1,limit:10,pageCount:1,show:false};
        this.tab = [{value:'今天',key:'today'},{value:'昨天',key:'yesterday'},{value:'3日内',key:'3days'},{value:'7日内',key:'7days'},{value:'全部',key:'all'}];
        this.handleTab = this.handleTab.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.query = this.query.bind(this);
        this.handlePage = this.handlePage.bind(this);
        this.redirect = this.redirect.bind(this);
    }

    componentDidMount() {this.query();}
    query(param) {
        let body = {
            token:this.props.token,
            number:this.state.number,
            is_online:this.state.isOnline,
            date:this.state.checked,
            page:this.state.page,
            limit:this.state.limit
        };
        if ('object' === typeof param) {
            if (tool.isSet(param.number)) body.number = param.number;
            if (tool.isSet(param.is_online)) body.is_online = param.is_online;
            if (tool.isSet(param.date)) body.date = param.date;
            if (tool.isSet(param.page)) body.page = param.page;
            if (tool.isSet(param.limit)) body.page = param.limit;
        }
        api.post('order_search', body, (response, verify) => {
            if (verify) {
                if (response.data.result.length > 0) {
                    this.setState({data:response.data.result,pageCount:response.data.page_count,show:false});
                } else {
                    this.setState({data:[],pageCount:1,show:true});
                }
            } else {
                this.setState({data:[],pageCount:1,show:true});
            }
        })
    }

    handleTab(isOnline) {
        this.setState({isOnline:isOnline,page:1,onSearch:false});
        this.query({is_online:isOnline,number:'',page:1});
    }

    handleClick(e) {
        let date = e.target.dataset.key;
        this.setState({checked:date,page:1,onSearch:false});
        this.query({date:date,number:'',page:1});
    }
    handleSearch(value) {
        if (!isNaN(value)) {
            this.setState({number:value,page:1,onSearch:true});
            this.query({number:value,page:1});
        }
    }
    handlePage(page) {
        this.setState({page:page});
        let param = {page:page};
        if (!this.state.onSearch) param.number = '';
        this.query(param);
    }

    getRowByItem(data, key) {
        return data.map((obj, index) => 
            <p key={index}>
                {'status' === key ? tool.itemStatus(obj[key]) : ('item_price' === key ? <span>&yen;{obj[key]}</span> : obj[key])}
            </p>
        );
    }

    redirect(e) {
        this.props.changeView({view:'detail',param:{value:'订单查询',view:'order_search',id:e.target.dataset.id}});
    }

    render() {
        let tabs = this.tab.map(obj => 
            <span
                key={obj.key}
                data-key={obj.key}
                className={'m-tab' + (this.state.checked == obj.key ? ' checked': '')}
                onClick={this.handleClick}
            >{obj.value}</span>
        );
        let html = this.state.data.map(obj => 
            <tr key={obj.id} className='online-tr'>
                    <td>{obj.ordersn}</td>
                    <td>{this.getRowByItem(obj.items, 'clean_sn')}</td>
                    <td>{this.getRowByItem(obj.items, 'item_name')}</td>
                    <td>{this.getRowByItem(obj.items, 'item_price')}</td>
                    <td>{this.getRowByItem(obj.items, 'status')}</td>
                    <td>
                        上门服务费：&yen;{obj.freight_price}<br/>
                        特殊工艺加价：&yen;{obj.craft_price}<br/>
                        保值清洗费：&yen;{obj.keep_price}<br/>
                        优惠金额：&yen;{obj.reduce_price}<br/>
                    </td>
                    <td>
                        {obj.items.length}件<br/>
                        &yen;{
                            (Math.floor(obj.amount * 100)
                            +
                            Math.floor(obj.freight_price * 100)
                            +
                            Math.floor(obj.craft_price * 100)
                            +
                            Math.floor(obj.keep_price * 100))
                            / 100
                        }
                    </td>
                    <td>
                        姓名：{obj.uname}<br/>
                        电话：{obj.umobile}<br/>
                        地址：{obj.uaddress}<br/>
                    </td>
                    <td className='e-blue'>{tool.orderStatus(obj.ostatus)}</td>
            </tr>
        );
        return (
            <div className='e-box'>
                    <div className='order-search-type'>
                        <span className={this.state.isOnline ? 'choose' : null} onClick={() => this.handleTab(1)}>线上订单</span>
                        <span className={this.state.isOnline ? null : 'choose'} onClick={() => this.handleTab(0)}>线下订单</span>
                    </div>
                    <div className='order-search-tab'>
                        <div>{tabs}</div>
                        <Search placeholder='请输入订单号/手机号' callback={this.handleSearch} onChange={value => !isNaN(value) && this.setState({number:value})}/>
                    </div>
                        <table className='e-table border' style={{marginBottom:'20px', display:(this.state.show ? 'none' : null)}}>
                            <thead>
                                <tr>
                                    <th>订单号</th>
                                    <th>衣物编码</th>
                                    <th>名称</th>
                                    <th>价格</th>
                                    <th>衣物状态</th>
                                    <th>工艺加价</th>
                                    <th>合计</th>
                                    <th>客户信息</th>
                                    <th>状态</th>
                                </tr>
                            </thead>
                            <tbody>{html}</tbody>
                        </table>
                    <Page count={this.state.pageCount} current={this.state.page} callback={this.handlePage}/>
                    <Empty show={this.state.show}/>
            </div>
        );
    }
}