/**
 * 会员消费报表组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import '../static/api';
import Crumbs,{Page} from '../static/UI';

export default class MemberConsume extends Component{
    constructor(props) {
        super(props);
        this.state = {
            start:func.currentDate('date'),end:func.currentDate('date'),
            count:0,total:0,page_count:1,page:1,data:[],limit:20
        };
        this.getData = this.getData.bind(this);
        this.togglePage = this.togglePage.bind(this);
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
        this.getData();
    }

    togglePage(page) {
        this.setState({page:page});
        this.getData(null, page);
    }

    getData(e, page) {
        let state = this.state;
        if (!func.isSet(page)) page = state.page;
        axios.post(
            api.U('memberConsumeRecord'),
            api.D({
                token:this.props.token,
                start_time:state.start,
                end_time:state.end,
                type:1,
                page:page,
                limit:state.limit
            })
        )
        .then(response => {
            let result = response.data.data;
            this.setState({
                total:result.order_total_amount,
                count:result.order_count,
                page_count:result.page_count,
                data:result.record
            });
            console.log(result);
        });
    }

    render () {
        const inputStyle = {marginRight:'40px',border:'1px solid #ccc',height:'34px',lineHeight:'34px',fontSize:'16px',textAlign:'center'};
        let props = this.props,
            state = this.state,
            html = null;
        if (state.data.length > 0) {
            html = state.data.map((obj) => 
                <tr className='ui-tr-d ui-fieldset' key={obj.id}>
                    <td>{obj.ucode}</td><td>{obj.ordersn}</td><td>&yen;{obj.create_time}</td><td>&yen;{obj.pay_amount}</td>
                </tr>
            );
        }
        return (
            <div>
                <Crumbs crumbs={[{key:0,text:'会员管理',e:'member_manage'},{key:1,text:'会员消费报表'}]} callback={props.changeView}/>
                <section className='ui-container'>
                    <div className='ui-box-between'>
                        <div></div>
                        <div>
                            开始时间：
                            <input type='text' ref={input => this.input = input} style={inputStyle} readOnly/>
                            结束时间：
                            <input type='text' ref={input => this.input2 = input} style={inputStyle} readOnly/>
                            <input type='button' value='查询' className='ui-btn ui-btn-confirm ui-btn-middle' onClick={this.getData}/>
                        </div>
                    </div>
                    <div className='ui-box' style={{fontSize:'18px',padding:'20px 0'}}>
                        <div style={{paddingRight:'50px'}}>累计订单数：<span style={{fontSize:'24px'}}>{state.count}</span></div>
                        <div>累计订单总额：<span style={{fontSize:'24px'}}>&yen;{state.total}</span></div>
                    </div>
                    <table className='ui-table'>
                        <thead><tr className='ui-tr-h ui-fieldset'><th>会员卡号</th><th>交易单号</th><th>时间</th><th>金额</th></tr></thead>
                        <tbody>
                            {html}
                        </tbody>
                    </table>
                    <Page count={state.page_count} current={state.page} callback={this.togglePage}/>
                </section>
            </div>
        );
    }
}