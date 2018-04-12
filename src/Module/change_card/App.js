/**
 * 换卡界面组件
 * @author yangyunlong
 */
import React from 'react';
import './App.css';


export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {ordersn:'', number:'', mobile:'', data:[], index:0, show:false, postData:{}};
        this.handleClick = this.handleClick.bind(this);
        this.query = this.query.bind(this);
    }
    handleClick(e) {
        this.setState({show:true,index:e.target.dataset.index});
    }
    query() {

    }
    render() {
        return (
            <div className='e-box'>
                <p>
                    订单号/流水号&emsp;&emsp;&emsp;
                    <input type='text' value={this.state.ordersn} onChange={e => this.setState({ordersn:e.target.value})}/>
                </p>
                <p>
                    会员卡号/充值卡号&emsp;
                    <input type='text' value={this.state.number} onChange={e => this.setState({number:e.target.value})}/>
                </p>
                <p>
                    手机号&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&nbsp;
                    <input type='text' value={this.state.mobile} onChange={e => this.setState({mobile:e.target.value})}/>
                    &emsp;
                    <button type='button' className='e-btn confirm' onClick={this.query}>查询</button>
                </p>
                <hr/>
                <h1>已为您找到{this.state.data.length}条数据</h1>
                <table className='e-table border'>
                    <thead><tr>
                        <th>序号</th>
                        <th>姓名</th>
                        <th>手机</th>
                        <th>卡号</th>
                        <th>性别</th>
                        <th>生日</th>
                        <th>卡类型</th>
                        <th>金额</th>
                        <th>折扣</th>
                        <th>未取衣物</th>
                        <th>认领状态</th>
                        <th>操作</th>
                    </tr></thead>
                    <tbody>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td className='e-blue e-pointer' data-index='0' onClick={this.handleClick}>换卡</td>
                        </tr>
                    </tbody>
                </table>
                <div className='change-card-toast' style={{display:(this.state.show ? null : 'none')}}>
                    <div>
                        <table className='e-table border'><tbody>
                            <tr><th colSpan='2'>老卡</th></tr>
                            <tr><td>姓名</td><td>ddddd</td></tr>
                            <tr><td>手机</td><td>ddddd</td></tr>
                            <tr><td>卡号</td><td>ddddd</td></tr>
                            <tr><td>性别</td><td>ddddd</td></tr>
                            <tr><td>生日</td><td>ddddd</td></tr>
                            <tr><td>卡类型</td><td>ddddd</td></tr>
                            <tr><td>余额</td><td>ddddd</td></tr>
                            <tr><td>折扣</td><td>ddddd</td></tr>
                            <tr><td>未取衣物</td><td>ddddd</td></tr>
                        </tbody></table>
                        <div className='e-blue'>&gt;&gt;换卡后&gt;&gt;</div>
                        <table className='e-table border'><tbody>
                            <tr><th colSpan='2'>新卡</th></tr>
                            <tr><td>姓名</td><td><input type='text'/></td></tr>
                            <tr><td>手机</td><td><input type='text'/></td></tr>
                            <tr><td>卡号</td><td>ddddd</td></tr>
                            <tr><td>性别</td><td><input type='text'/></td></tr>
                            <tr><td>生日</td><td><input type='text'/></td></tr>
                            <tr><td>会员类型</td><td>ddddd</td></tr>
                            <tr><td>初始余额</td><td>ddddd</td></tr>
                            <tr><td>老卡余额转入</td><td><input type='text'/></td></tr>
                            <tr><td>折扣</td><td><input type='text'/></td></tr>
                            <tr><td>未取衣物</td><td>ddddd</td></tr>
                        </tbody></table>
                    </div>
                    <div>
                        <h2>换卡后余额</h2>
                        <div>
                            <button type='button' className='e-btn cancel' onClick={() => this.setState({show:false})}>取消</button>
                            &emsp;
                            <button type='button' className='e-btn confirm'>确认</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}