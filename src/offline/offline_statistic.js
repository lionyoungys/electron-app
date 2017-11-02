/**
 * 线下业务统计组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import '../static/api';
import Crumbs  from '../static/UI';

export default class OfflineStatistic extends Component{
    constructor(props) {
        super(props);
        this.state = {choose:0,total:0,start:func.currentDate('date'),end:func.currentDate('date')};
        this.toggleOption = this.toggleOption.bind(this);
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

    toggleOption(e) {
        this.setState({choose:e.target.dataset.index});
    }

    render() {
        const inputStyle = {marginRight:'40px',border:'1px solid #ccc',height:'34px',lineHeight:'34px',fontSize:'16px',textAlign:'center'};
        let props = this.props,
            state = this.state;
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
        if (0 == state.choose) {
            html = <tr className='ui-tr-d'>
                       <td>时间</td>
                       <td>平台会员卡支付</td>
                       <td>微信支付</td>
                       <td>支付宝支付</td>
                       <td>专店会员卡支付</td>
                       <td>现金支付</td>
                       <td>营业额</td>
                       <td>实收额</td>
                   </tr>;
        } else {
            html = <tr className='ui-tr-d'>
                       <td>时间</td>
                       <td className='ui-os-row'>
                           <div>dfdfdff</div>
                           <div>dfdfdff</div>
                           <div>dfdfdff</div>
                       </td>
                       <td className='ui-os-row'>
                           <div>232343434343</div>
                           <div>232343434343</div>
                           <div>232343434343</div>
                       </td>
                       <td className='ui-os-row'>
                           <div>123</div>
                           <div>232</div>
                           <div>232</div>
                        </td>
                       <td className='ui-os-row'>
                           <div className='ui-default'>查看详情</div>
                           <div className='ui-default'>查看详情</div>
                           <div className='ui-default'>查看详情</div>
                        </td>
                    </tr>;
        }
        return (
            <div>
                <Crumbs crumbs={[{key:0,text:'业务统计'}]} callback={props.changeView}/>
                <div className='ui-os-box'>
                    <div 
                        className={0 == state.choose ? 'choose' : ''}
                        data-index='0'
                        onClick={this.toggleOption}
                    >收银统计</div>
                    <div 
                        className={1 == state.choose ? 'choose' : ''}
                        data-index='1'
                        onClick={this.toggleOption}
                    >未付款统计</div>
                    <div 
                        className={2 == state.choose ? 'choose' : ''}
                        data-index='2'
                        onClick={this.toggleOption}
                    >未结单统计</div>
                </div>
                <div className='ui-os-box2'>
                    <div>
                        <p 
                            style={{display:(0 == state.choose ? 'block' : 'none'),fontSize:'16px'}}
                        >营业总收入：<span style={{fontSize:'24px',color:'#333'}}>&yen;{state.total}</span></p>
                    </div>
                    <div>
                        开始时间：
                        <input type='text' ref={input => this.input = input} style={inputStyle} readOnly/>
                        结束时间：
                        <input type='text' ref={input => this.input2 = input} style={inputStyle} readOnly/>
                        <input type='button' value='查询' className='ui-btn ui-btn-confirm ui-btn-middle'/>
                    </div>
                </div>
                <div style={{padding:'0 20px'}}>
                    <table className='ui-table-b'>
                        <thead>{0 == state.choose ? ths : ths2}</thead>
                        <tbody>{html}</tbody>
                    </table>
                </div>
            </div>
        );
    }
}