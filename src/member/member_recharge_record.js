/**
 * 会员充值报表组件
 * @author yangyunlong
 */
import React, {Component} from 'react';


export default class MemberRechargeRecord extends Component{
    constructor(props) {
        super(props);
        this.state = {
            start:func.currentDate('date'),end:func.currentDate('date'),
            rechargeAmount:0,giveAmount:0,page:1,limit:20,count:1,
            data:[]
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
        this.getData(null,page);
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
                page:page,
                limit:state.limit
            })
        )
        .then(response => {
            let result = response.data.data;
            this.setState({
                rechargeAmount:result.recharged_total,
                giveAmount:result.given_total,
                count:result.page_count,
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
            html = state.data.map((obj, index) => 
                <tr className='ui-tr-d ui-fieldset' key={index}>
                    <td>{obj.ucode}</td><td>{Number(obj.recharge_time).dateFormat()}</td><td>&yen;{obj.recharge_amount}</td><td>&yen;{obj.give}</td>
                </tr>
            );
        }
        return (
            <div>
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
                        <div style={{paddingRight:'50px'}}>累计充值金额：<span style={{fontSize:'24px'}}>{state.rechargeAmount}</span></div>
                        <div>累计赠送金额：<span style={{fontSize:'24px'}}>&yen;{state.giveAmount}</span></div>
                    </div>
                    <table className='ui-table'>
                        <thead><tr className='ui-tr-h ui-fieldset'><th>会员卡号</th><th>时间</th><th>充值金额</th><th>赠送金额</th></tr></thead>
                        <tbody>
                            {html}
                        </tbody>
                    </table>
                    <Page count={state.count} current={state.page} callback={this.togglePage}/>
                </section>
            </div>
        );
    }
}