/**
 * 换卡界面组件
 * @author yangyunlong
 */
import React from 'react';
import SelectSearch from '../../Elem/SelectSearch';
import './App.css';


export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data:[], show:false, tempData:{}};
        this.handleClick = this.handleClick.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.query = this.query.bind(this);
    }
    handleClick(e) {
        api.post('member_card_detail', {token:this.props.token,id:e.target.dataset.id}, (response, verify) => {
            verify ? this.setState({show:true, tempData:response.data.result}) : alert(response.data.msg);
        })
    }
    onSearch(value, selected) {
        if ('' === value) return;
        let type = '订单号/流水号' === selected ? 1 : ('会员卡号/充值卡号' === selected ? 2 : 3);
        api.post('member_cards', {token:this.props.token, type:type, number:value}, (response, verify) => {
            if (verify) {
                response.data.result.length > 0 && this.setState({data:response.data.result});
            } else {
                alert(response.data.msg);
            }
        })
    }
    query() {

    }
    render() {
        let tempData = this.state.tempData,
            html = this.state.data.map(obj => 
            <tr key={obj.id}>
                <td>{obj.id}</td>
                <td>{obj.uname}</td>
                <td>{obj.umobile}</td>
                <td>{obj.recharge_number}</td>
                <td>{obj.sex}</td>
                <td>{obj.birthday}</td>
                <td>{obj.cname}</td>
                <td>{obj.cbalance}</td>
                <td>{obj.cdiscount}</td>
                <td>{obj.order_count}</td>
                <td className='e-blue e-pointer' data-id={obj.id} onClick={this.handleClick}>换卡</td>
            </tr>
        );
        return (
            <div className='e-box'>
                <p>
                    <SelectSearch
                        option={['订单号/流水号', '会员卡号/充值卡号', '手机号']}
                        callback={this.onSearch}
                    />
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
                        <th>操作</th>
                    </tr></thead>
                    <tbody>{html}</tbody>
                </table>
                <div className='change-card-toast' style={{display:(this.state.show ? null : 'none')}}>
                    <div>
                        <table className='e-table border'><tbody>
                            <tr><th colSpan='2'>老卡</th></tr>
                            <tr><td>姓名</td><td>{tempData.cmaster}</td></tr>
                            <tr><td>手机</td><td>{tempData.umobile}</td></tr>
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