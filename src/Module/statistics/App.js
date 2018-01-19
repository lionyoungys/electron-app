/**
 * 线下业务统计组件
 * @author yangyunlong
 */
import React from 'react';
import Crumb from '../UI/crumb/App';
import Page from '../UI/page/App';
import './App.css';

export default class extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            checked:0,
            page:1,
            sum:0,
            pageCount:1,
            record:[],
            start:tool.currentDate('date'),
            end:tool.currentDate('date')
        };
        this.tab = [{value:'收银统计',key:0,api:'finance'},{value:'未付款统计',key:1,api:'to_pay'},{value:'未结单统计',key:2,api:'to_done'}];
        this.query = this.query.bind(this);    //数据请求方法
        this.updatePage = this.updatePage.bind(this);
        this.redirect = this.redirect.bind(this);
        this.handleTab = this.handleTab.bind(this);
    }

    componentDidMount() {
        laydate.render({
            elem:this.input,
            value:new Date(),
            min:'2016-01-01',max:0,
            btns: ['now', 'confirm'],
            theme:'#ff6e42',
            done:(value) => {this.setState({start:value})}
        });
        laydate.render({
            elem:this.input2,
            value:new Date(),
            min:'2016-01-01',max:0,
            btns: ['now', 'confirm'],
            theme:'#ff6e42',
            done:(value) => {this.setState({end:value})}
        });
        this.query();
    }

    query(checked, page) {
        axios.post(
            api.U(this.tab[(tool.isSet(checked) ? checked : this.state.checked)].api),
            api.D({token:this.props.token,start:this.state.start,end:this.state.end,page:(tool.isSet(page) ? page : this.state.page),limit:10})
        )
        .then(response => {
            if (api.V(response.data)) {
                let result = response.data.result;
                if (0 == this.state.changeView) {
                    this.setState({sum:result.sum,pageCount:result.page_count,record:result.record});
                } else {
                    this.setState({record:result,pageCount:1,page:1});
                }
            }
        });
    }

    handleTab(e) {
        let key = e.target.dataset.key;
        if (key != this.state.changeView) {
            this.setState({checked:key});
            this.query(key);
        }
    }
    updatePage(page) {
        let state = this.state;
        state.pages[state.choose] = page;
        this.setState({pages:state.pages});
        this.query();
    }
    redirect(e) {
        this.props.changeView({element:'offline_order_detail',param:{id:e.target.dataset.id}});
    }

    render() {
        let tab = this.tab.map(obj => 
            <span
                key={obj.key}
                className={obj.key == this.state.checked ? 'checked' : null}
                data-key={obj.key}
                onClick={this.handleTab}
            >{obj.value}</span>
        );
        const inputStyle = {marginRight:'40px',border:'1px solid #ccc',height:'34px',lineHeight:'34px',fontSize:'16px',textAlign:'center'};
        let props = this.props,
            state = this.state,
            choose = state.choose;
        const ths = <tr className='ui-tr-h'>
                        <th>时间</th>
                        <th>平台会员卡支付</th>
                        <th>微信支付</th>
                        <th>支付宝支付</th>
                        <th>专店会员卡支付</th>
                        <th>现金支付</th>
                        <th>营业额</th>
                        <th>实收额</th>
                    </tr>;
        const ths2 = <tr className='ui-tr-h'>
                        <th>时间</th>
                        <th>姓名</th>
                        <th>订单号</th>
                        <th>金额</th>
                        <th>操作</th>
                     </tr>;
        let html = null;
        if (0 == choose) {
            html = state.data[choose].map(obj => 
                <tr className='ui-tr-d' key={obj.id}>
                    <td>{obj.now_date}</td>
                    <td>{obj.platform_card}</td>
                    <td>{obj.wechat}</td>
                    <td>{obj.alipay}</td>
                    <td>{obj.merchant_card}</td>
                    <td>{obj.cash}</td>
                    <td>{obj.total}</td>
                    <td>{obj.actual_total}</td>
                </tr>
            );
        } else {
            html = state.data[choose].map((obj, index) =>
                <tr className='ui-tr-d' key={index}>
                    <td>{obj.date}</td>
                    <td className='ui-os-row'>
                        {[] = obj.orders.map(obj2 => <div key={obj2.id}>{obj2.username}</div>)}
                    </td>
                    <td className='ui-os-row'>
                        {[] = obj.orders.map(obj2 => <div key={obj2.id}>{obj2.ordersn}</div>)}
                    </td>
                    <td className='ui-os-row'>
                        {[] = obj.orders.map(obj2 => <div key={obj2.id}>{obj2.amount}</div>)}
                    </td>
                        <td className='ui-os-row'>
                        {
                            [] = obj.orders.map(
                                obj2 => 
                                    <div 
                                        className='ui-default' 
                                        data-id={obj2.id} 
                                        key={obj2.id} 
                                        onClick={this.redirect}
                                    >查看详情</div>
                            )
                        }
                    </td>
                </tr>
            );
        }
        return (
            <div>
                <Crumb data={[{key:0,value:'业务统计'}]} callback={this.props.changeView}/>
                <div className='m-container'>
                    <div className='statistics-tab'>{tab}</div>
                    <div className='m-box statistics-box'>
                        <div>
                            {
                                0 == this.state.checked ? 
                                (<span>总收入：<span style={{fontSize:'22px',color:'#333'}}>&yen;{state.total}</span></span>) 
                                : 
                                (<span className='m-blue'>下载</span>) 
                            }
                        </div>
                        <div className='m-text-r'>
                            开始：<input type='text' value={this.state.start} ref={input => this.input = input} className='m-input-small m-select-postfix m-text-c' readOnly/>
                            &emsp;
                            结束：<input type='text'  value={this.state.end} ref={input => this.input2 = input} className='m-input-small m-select-postfix m-text-c' readOnly/>
                            &emsp;
                            <button type='button' className='m-btn confirm' onClick={this.query}>查询</button>
                        </div>
                    </div>
                    <div className='m-box'>
                        <table className='m-table'>
                            <thead>
                                {
                                    0 == this.state.checked ?
                                    (<tr className='m-bg-white bd-lightgrey'>
                                        <th>时间</th>
                                        <th>平台卡支付</th>
                                        <th>微信支付</th>
                                        <th>支付宝支付</th>
                                        <th>专店卡支付</th>
                                        <th>现金支付</th>
                                        <th>营业额</th>
                                        <th>实收额</th>
                                    </tr>) 
                                    :
                                    (<tr className='m-bg-white bd-lightgrey'>
                                        <th>时间</th>
                                        <th>姓名</th>
                                        <th>订单号</th>
                                        <th>金额</th>
                                        <th>操作</th>
                                    </tr>)
                                }
                            </thead>
                            <tbody>{html}</tbody>
                        </table>
                    </div>
                </div>
                <div className='ui-os-box2'>
                    <div>
                        <p 
                            style={{display:(0 == choose ? 'block' : 'none'),fontSize:'16px'}}
                        >营业总收入：<span style={{fontSize:'24px',color:'#333'}}>&yen;{state.total}</span></p>
                    </div>
                </div>
                <div style={{padding:'0 20px'}}>
                    <table className='ui-table-b'>
                        <thead>{0 == choose ? ths : ths2}</thead>
                        <tbody>{html}</tbody>
                    </table>
                </div>
                <Page 
                    count={state.pageCount[choose]}
                    current={this.state.page}
                    callback={this.updatePage}
                />
            </div>
        );
    }
}