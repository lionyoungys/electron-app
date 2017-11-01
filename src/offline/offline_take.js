/**
 * 线下取衣组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import '../static/api';
import Crumbs,{Search} from '../static/UI';

export default class OfflineTake extends Component{
    constructor(props) {
        super(props);
    }

    onSearchRequest(word) {

    }

    render() {
        const noPadding = {padding:'0'};
        let props = this.props,
            state = this.state;
            
        return (
            <div>
                <Crumbs crumbs={[{key:0,text:'取衣'}]} callback={props.changeView}/>
                <section className='ui-container'>
                    <div className='ui-box-between' style={{paddingBottom:'16px'}}>
                        <div></div>
                        <Search placeholder='请输入客户手机号' callback={this.onSearchRequest}/>
                    </div>
                    <table className='ui-table-b' style={{fontSize:'14px'}}>
                        <thead><tr className='ui-tr-h'>
                            <th>订单号</th><th>项目</th><th>状态</th>
                            <th>挂号</th><th>件数/价格</th><th>姓名/手机号</th>
                            <th>时间</th><th>支付状态</th><th>操作</th>
                        </tr></thead>
                        <tbody>
                            <tr className='ui-tr-d'>
                                <td>234567890123456789</td>
                                <td className='ui-ot-items-box' style={noPadding}>
                                    <div>羊毛背心</div>
                                    <div>羊毛背心</div>
                                    <div>羊毛背心</div>
                                </td>
                                <td className='ui-ot-items-box' style={noPadding}>
                                    <div>已收衣</div>
                                    <div>已收衣</div>
                                    <div>已收衣</div>
                                </td>
                                <td className='ui-ot-items-box' style={noPadding}>
                                    <div>111</div>
                                    <div>1111</div>
                                    <div>11111</div>
                                </td>
                                <td>件数：5<br/>总额：&yen;</td>
                                <td>姓名：嘿嘿嘿<br/>手机号：18833337777</td>
                                <td>2017-09-08 10:10:10</td>
                                <td>未支付</td>
                                <td>
                                    <input type='button' value='单件取衣' className='ui-btn ui-btn-confirm'/>
                                    <div style={{height:'10px'}}></div>
                                    <input type='button' value='取衣付款' className='ui-btn ui-btn-confirm'/>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </section>
            </div>
        );
    }
}