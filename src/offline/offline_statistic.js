/**
 * 线下业务统计组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import {Page} from '../static/UI';

export default class OfflineStatistic extends Component{
    constructor(props) {
        super(props);
        this.state = {
            choose:0,total:0,pages:[1,1,1],pageCount:[1,1,1],data:[[],[],[]],
            start:func.currentDate('date'),end:func.currentDate('date'),
        };
        this.apis = ['financeStatistic','noPayStatistic','noDoneStatistic'];
        this.toggleOption = this.toggleOption.bind(this);
        this.dataRequest = this.dataRequest.bind(this);    //数据请求方法
        this.updatePage = this.updatePage.bind(this);
        this.redirect = this.redirect.bind(this);
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
        this.dataRequest();
    }

    dataRequest() {
        let state = this.state,
            choose = state.choose;
        axios.post(
            api.U(this.apis[choose]),
            api.D({
                token:this.props.token,
                start_time:state.start,
                end_time:state.end,
                page:state.pages[choose]
            })
        )
        .then(response => {
            let result = response.data.data;
            state.pageCount[choose] = result.page_count;
            if (0 == choose) {
                state.data[choose] = result.record;
            } else {
                state.data[choose] = result.orders;
            }
            let baseSet = {pageCount:state.pageCount,data:state.data};
            if (func.isSet(result.total_amount)) {
                baseSet.total = result.total_amount;
            }
            this.setState(baseSet);
        });
    }
    //切换选项
    toggleOption(e) {this.setState({choose:e.target.dataset.index});}
    updatePage(page) {
        let state = this.state;
        state.pages[state.choose] = page;
        this.setState({pages:state.pages});
        this.dataRequest();
    }
    redirect(e) {
        this.props.changeView({element:'offline_order_detail',param:{id:e.target.dataset.id}});
    }

    render() {
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
                <div className='ui-os-box'>
                    <div 
                        className={0 == choose ? 'choose' : ''}
                        data-index='0'
                        onClick={this.toggleOption}
                    >收银统计</div>
                    <div 
                        className={1 == choose ? 'choose' : ''}
                        data-index='1'
                        onClick={this.toggleOption}
                    >未付款统计</div>
                    <div 
                        className={2 == choose ? 'choose' : ''}
                        data-index='2'
                        onClick={this.toggleOption}
                    >未结单统计</div>
                </div>
                <div className='ui-os-box2'>
                    <div>
                        <p 
                            style={{display:(0 == choose ? 'block' : 'none'),fontSize:'16px'}}
                        >营业总收入：<span style={{fontSize:'24px',color:'#333'}}>&yen;{state.total}</span></p>
                    </div>
                    <div>
                        开始时间：
                        <input type='text' ref={input => this.input = input} style={inputStyle} readOnly/>
                        结束时间：
                        <input type='text' ref={input => this.input2 = input} style={inputStyle} readOnly/>
                        <input type='button' value='查询' className='ui-btn ui-btn-confirm ui-btn-middle' onClick={this.dataRequest}/>
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
                    current={state.pages[choose]}
                    callback={this.updatePage}
                />
            </div>
        );
    }
}