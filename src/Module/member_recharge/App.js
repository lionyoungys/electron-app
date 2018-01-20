/**
 * 会员充值报表组件
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
            start:tool.currentDate('date'),
            end:tool.currentDate('date'),
            recharge:0,
            give:0,
            pageCount:1,
            page:1,
            data:[],
            limit:10
        };
        this.query = this.query.bind(this);
        this.handlePage = this.handlePage.bind(this);
        this.handleQuery = this.handleQuery.bind(this);
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

    handlePage(page) {this.setState({page:page});this.query(page);}
    handleQuery() {this.setState({page:1});this.query(1)}

    query(page) {
        axios.post(
            api.U('member_recharge'),
            api.D({
                token:this.props.token,
                start:this.state.start,
                end:this.state.end,
                page:( tool.isSet(page) ? page : this.state.page ),
                limit:this.state.limit
            })
        )
        .then(response => {
            let result = response.data.result;
            this.setState({give:result.give,recharge:result.recharge,pageCount:result.page_count,data:result.record});
        });
    }

    render () {
        let html = this.state.data.map((obj, index) =>
                <tr key={index} className='m-text-c'>
                    <td>{obj.umobile}</td><td>{obj.log_time}</td><td>{obj.amount}</td><td>{obj.give}</td>
                </tr>
            );
        return (
            <div>
                <Crumb data={[{key:0,value:'会员管理',view:'member'},{key:1,value:'会员充值报表'}]} callback={this.props.changeView}/>
                <div className='m-container'>
                    <div className='m-text-r'>
                        开始时间：<input type='text' value={this.state.start} ref={input => this.input = input} className='m-input-small m-select-postfix m-text-c' readOnly/>
                        &emsp;
                        结束时间：<input type='text'  value={this.state.end} ref={input => this.input2 = input} className='m-input-small m-select-postfix m-text-c' readOnly/>
                        &emsp;
                        <button type='button' className='m-btn confirm' onClick={this.handleQuery}>查询</button>
                        &emsp;&emsp;
                        <span className='m-blue'>下载</span>
                    </div>
                    <div className='m-box'>
                        累计充值金额：<span style={{fontSize:'22px'}}>{this.state.recharge}</span>
                        &emsp;&emsp;
                        累计赠送金额：<span style={{fontSize:'22px'}}>&yen;{this.state.give}</span>
                    </div>
                    <div className='m-box'>
                        <table className='m-table tr-b'>
                            <thead><tr className='m-bg-white'><th>会员手机号</th><th>时间</th><th>充值金额</th><th>赠送金额</th></tr></thead>
                            <tbody>{html}</tbody>
                        </table>
                    </div>
                    <div className='m-box'><Page count={this.state.pageCount} current={this.state.page} callback={this.handlePage}/></div>
                </div>
            </div>
        );
    }
}