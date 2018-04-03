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
        this.state = {isOnline:1,checked:'today',number:'',onSearch:false,data:[],page:1,limit:10,pageCount:1,show:false};
        this.tab = [{value:'今天',key:'today'},{value:'昨天',key:'yesterday'},{value:'3日内',key:'3days'},{value:'7日内',key:'7days'},{value:'全部',key:'all'}];
        this.handleTab = this.handleTab.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleQuery = this.handleQuery.bind(this);
        this.itemsToHtml = this.itemsToHtml.bind(this);
        this.handlePage = this.handlePage.bind(this);
        this.redirect = this.redirect.bind(this);
    }

    componentDidMount() {this.handleQuery();}
    handleQuery(param) {
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
        this.handleQuery({is_online:isOnline,number:'',page:1});
    }

    handleClick(e) {
        let date = e.target.dataset.key;
        this.setState({checked:date,page:1,onSearch:false});
        this.handleQuery({date:date,number:'',page:1});
    }
    handleSearch(value) {
        if (!isNaN(value)) {
            this.setState({number:value,page:1,onSearch:true});
            this.handleQuery({number:value,page:1});
        }
    }
    handlePage(page) {
        this.setState({page:page});
        let param = {page:page};
        if (!this.state.onSearch) param.number = '';
        this.handleQuery(param);
    }
    itemsToHtml(items) {
        return items.map((obj, index) => 
            <div key={index} className='m-between-box online'>
                <span>{obj.item_name}</span>
                <span>&yen;{obj.item_price}</span>
            </div>
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
            <tr className='bd-lightgrey' key={obj.id}>
                <td className='m-blue-h' data-id={obj.id} onClick={this.redirect}>{obj.ordersn}</td>
                <td>{this.itemsToHtml(obj.items)}</td>
                <td>
                    <div className='m-between-box online'><span>上门服务费</span><span>&yen;{obj.freight_price}</span></div>
                    <div className='m-between-box online'><span>特殊工艺加价</span><span>&yen;{obj.craft_price}</span></div>
                    <div className='m-between-box online'><span>保值清洗费</span><span>&yen;{obj.keep_price}</span></div>
                    <div className='m-between-box online'><span>优惠金额</span><span>&yen;{obj.reduce_price}</span></div>
                </td>
                <td>{obj.items.length}件</td>
                <td className='m-red'>&yen;{obj.pay_amount}</td>
                <td>{obj.uname}</td>
                <td>{obj.umobile}</td>
                <td>{obj.uaddress}</td>
                <td>{obj.otime}</td>
                <td className='m-blue'>{tool.orderStatus(obj.ostatus)}</td>
            </tr>
        );
        return (
            <div>
                <div className='m-container'>
                    <div className='order-search-type'>
                        <span className={this.state.isOnline ? 'choose' : null} onClick={() => this.handleTab(1)}>线上订单</span>
                        <span className={this.state.isOnline ? null : 'choose'} onClick={() => this.handleTab(0)}>线下订单</span>
                    </div>
                    <div className='m-box order-search-tab'>
                        <div>{tabs}</div>
                        <Search placeholder='请输入订单号' callback={this.handleSearch}/>
                    </div>
                    <div className='m-box' style={{marginBottom:'20px', display:(this.state.show ? 'none' : 'block')}}>
                        <table className='m-table'>
                            <thead>
                                <tr className='bd-lightgrey m-bg-white'>
                                    <th>订单号</th>
                                    <th>项目</th>
                                    <th>工艺加价</th>
                                    <th>件数</th>
                                    <th>总价</th>
                                    <th>姓名</th>
                                    <th>电话</th>
                                    <th>地址</th>
                                    <th>时间</th>
                                    <th>状态</th>
                                </tr>
                            </thead>
                            <tbody>{html}</tbody>
                        </table>
                    </div>
                    <Page count={this.state.pageCount} current={this.state.page} callback={this.handlePage}/>
                    <Empty show={this.state.show}/>
                </div>
            </div>
        );
    }
}