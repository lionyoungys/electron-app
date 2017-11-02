/**
 * 会员充值报表组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import '../static/api';
import Crumbs from '../static/UI';

export default class MemberRechargeRecord extends Component{
    constructor(props) {
        super(props);
        this.state = {
            start:func.currentDate('date'),end:func.currentDate('date'),
            rechargeAmount:0,giveAmount:0
        };
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
    }

    render () {
        const inputStyle = {marginRight:'40px',border:'1px solid #ccc',height:'34px',lineHeight:'34px',fontSize:'16px',textAlign:'center'};
        let props = this.props,
            state = this.state;
        return (
            <div>
                <Crumbs crumbs={[{key:0,text:'会员管理',e:'member_manage'},{key:1,text:'会员充值报表'}]} callback={props.changeView}/>
                <section className='ui-container'>
                    <div className='ui-box-between'>
                        <div></div>
                        <div>
                            开始时间：
                            <input type='text' ref={input => this.input = input} style={inputStyle} readOnly/>
                            结束时间：
                            <input type='text' ref={input => this.input2 = input} style={inputStyle} readOnly/>
                            <input type='button' value='查询' className='ui-btn ui-btn-confirm ui-btn-middle'/>
                        </div>
                    </div>
                    <div className='ui-box' style={{fontSize:'18px',padding:'20px 0'}}>
                        <div style={{paddingRight:'50px'}}>累计充值金额：<span style={{fontSize:'24px'}}>{state.rechargeAmount}</span></div>
                        <div>累计赠送金额：<span style={{fontSize:'24px'}}>&yen;{state.giveAmount}</span></div>
                    </div>
                    <table className='ui-table'>
                        <thead><tr className='ui-tr-h ui-fieldset'><th>会员卡号</th><th>时间</th><th>充值金额</th><th>赠送金额</th></tr></thead>
                        <tbody>
                            <tr className='ui-tr-d ui-fieldset'><td>234234433</td><td>343434</td><td>&yen;34344</td><td>&yen;343</td></tr>
                        </tbody>
                    </table>
                </section>
            </div>
        );
    }
}