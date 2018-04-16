/**
 * 换卡界面组件
 * @author yangyunlong
 */
import React from 'react';
import SelectSearch from '../../Elem/SelectSearch';


export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data:[]};
        this.onSearch = this.onSearch.bind(this);
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


    render() {
        let html = this.state.data.map(obj => 
            <tr key={obj.id}>
                <td>{obj.id}</td>
                <td>{obj.cmaster}</td>
                <td>{obj.umobile}</td>
                <td>{obj.recharge_number}</td>
                <td>{obj.sex}</td>
                <td>{obj.birthday}</td>
                <td>{obj.cname}</td>
                <td>{obj.cbalance}</td>
                <td>{obj.cdiscount}</td>
                <td>{obj.order_count}</td>
                <td>{0 == obj.use_type && <span className='e-blue e-pointer' data-view='change_card_confirm' data-param={obj.id} onClick={this.props.changeView}>换卡</span>}</td>
            </tr>
        );
        return (
            <div className='e-box'>
                <div style={{height:'56px', lineHeight:'56px'}}>
                    <div className='left'>已为您找到<span style={{color:'red',fontSize:'14px'}}>{this.state.data.length}</span>条数据</div>
                    <div className='right'><SelectSearch option={['订单号/流水号', '会员卡号/充值卡号', '手机号']} callback={this.onSearch}/></div>
                </div>
                <table className='e-table border'>
                    <thead><tr>
                        <th style={{minWidth:'55px'}}>序号</th>
                        <th style={{minWidth:'80px'}}>姓名</th>
                        <th style={{minWidth:'123px'}}>手机</th>
                        <th style={{minWidth:'127px'}}>卡号</th>
                        <th style={{minWidth:'68px'}}>性别</th>
                        <th style={{minWidth:'106px'}}>生日</th>
                        <th style={{minWidth:'83px'}}>卡类型</th>
                        <th style={{minWidth:'100px'}}>金额</th>
                        <th style={{minWidth:'65px'}}>折扣</th>
                        <th style={{minWidth:'88px'}}>未取衣物</th>
                        <th style={{minWidth:'83px'}}>操作</th>
                    </tr></thead>
                    <tbody>{html}</tbody>
                </table>
            </div>
        );
    }
}