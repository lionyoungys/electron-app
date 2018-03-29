/**
 * 线下业务统计组件
 * @author yangyunlong
 */
const {dialog} = window.require('electron').remote;
const {ipcRenderer} = window.require('electron');
import React from 'react';
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
        this.adapter = this.adapter.bind(this);
        this.handlePage = this.handlePage.bind(this);
        this.redirect = this.redirect.bind(this);
        this.handleTab = this.handleTab.bind(this);
        this.download = this.download.bind(this);
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
        checked = (tool.isSet(checked) ? checked : this.state.checked);
        page = (tool.isSet(page) ? page : this.state.page);
        axios.post(
            api.U(this.tab[checked].api),
            api.D({token:this.props.token,start:this.state.start,end:this.state.end,page:page,limit:10})
        )
        .then(response => {
            if (api.V(response.data)) {
                let result = response.data.result;
                if (0 == checked) {
                    this.setState({sum:result.sum,pageCount:result.page_count,record:result.record,checked:checked,page:page});
                } else {
                    this.setState({record:result,pageCount:1,page:1,checked:checked,page:page});
                }
            }
        });
    }

    handleTab(e) {
        let key = e.target.dataset.key;
        if (key != this.state.changeView) {
            this.query(key);
        }
    }

    adapter() {
        if (this.state.record.length < 1) return null;
        if (0 == this.state.checked) {
            return this.state.record.map((obj, index) =>
                <tr className='bd-lightgrey' key={index}>
                    <td>{obj.eftime}</td>
                    <td>{obj.platform}</td>
                    <td>{obj.wechat}</td>
                    <td>{obj.alipay}</td>
                    <td>{obj.merchant}</td>
                    <td>{obj.cash}</td>
                    <td>{obj.total}</td>
                    <td>{obj.real_total}</td>
                </tr>
            );
        } else {
            return this.state.record.map(obj =>
                <tr className='bd-lightgrey' key={obj.date}>
                    <td>{obj.date}</td>
                    <td className='statistics-row'>
                        {[] = obj.list.map(obj2 => <div key={obj2.id}>{obj2.uname}</div>)}
                    </td>
                    <td className='statistics-row'>
                        {[] = obj.list.map(obj2 => <div key={obj2.id}>{obj2.ordersn}</div>)}
                    </td>
                    <td className='statistics-row'>
                        {[] = obj.list.map(obj2 => <div key={obj2.id}>{obj2.pay_amount}</div>)}
                    </td>
                    <td className='statistics-row'>
                        {[] = obj.list.map(obj2 => <div className='m-blue m-pointer' data-id={obj2.id} key={obj2.id} onClick={this.redirect}>查看详情</div>)}
                    </td>
                </tr>
            );
        }
    }
    handlePage(page) {this.query(null, page);}
    redirect(e) {this.props.changeView({view:'detail',param:{value:'业务统计',view:'statistics',id:e.target.dataset.id}});}
    download() {
        dialog.showOpenDialog(
            {properties: ['openDirectory']},
            (path) => {
                if ('undefined' === typeof path) return;
                ipcRenderer.send('download', {
                    url:`${api.U( ('download_' + this.tab[this.state.checked].api) )}?token=${this.props.token}&start=${this.state.start}&end=${this.state.end}`,
                    floder:path[0]
                });
            }
        );
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
        let html = this.adapter();

        return (
            <div>
                <div className='m-container'>
                    <div className='statistics-tab'>{tab}</div>
                    <div className='m-box statistics-box'>
                        <div>
                            {
                                0 == this.state.checked ? 
                                (<span>总收入：<span style={{fontSize:'22px',color:'#333'}}>&yen;{this.state.sum}</span></span>) 
                                : 
                                (<span className='m-blue m-pointer' onClick={this.download}>下载</span>) 
                            }
                        </div>
                        <div className='m-text-r'>
                            开始：<input type='text' value={this.state.start} ref={input => this.input = input} className='m-input-small m-select-postfix m-text-c' readOnly/>
                            &emsp;
                            结束：<input type='text'  value={this.state.end} ref={input => this.input2 = input} className='m-input-small m-select-postfix m-text-c' readOnly/>
                            &emsp;
                            <button type='button' className='m-btn confirm' onClick={() => this.query()}>查询</button>
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
                    {0 == this.state.checked ? <div className='m-blue m-pointer' style={{textAlign:'right',marginTop:'20px'}} onClick={this.download}>下载</div> : null}
                </div>
                <Page 
                    count={this.state.pageCount}
                    current={this.state.page}
                    callback={this.handlePage}
                />
            </div>
        );
    }
}