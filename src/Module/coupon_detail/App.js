/**
 * 卡券详情界面组件
 * @author yangyunlong
 */

import React from 'react';
import Crumb from '../UI/crumb/App';
import './App.css';

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data:[]};
    }

    componentDidMount() {
        if (tool.isSet(this.props.param.result)) return this.setState({data:this.props.param.result});
        axios.post(api.U('coupon_detail'), api.D({token:this.props.token,mrid:this.props.param.id,type:this.props.param.type}))
        .then(response => {
            api.V(response.data) && this.setState({data:response.data.result});
        });
    }

    render() {
        let type = 1 == this.props.param.type ? '充值卡' : '优惠券',
            html = this.state.data.map( (obj, index) => 
            <tr className='m-text-c bd-lightgrey' key={obj.id}>
                <td>{index + 1}</td>
                <td>{type}</td>
                <td>{obj.end_time}</td>
                <td>{obj.sn}</td>
                <td>{obj.uname}</td>
                <td>{obj.umobile}</td>
                <td>{1 == obj.is_used ? obj.use_time : null}</td>
            </tr>
        );
        return (
            <div>
                <Crumb data={[{key:0,value:'卡券中心',view:'coupon'},{key:1,value:'卡券详情'}]} callback={this.props.changeView}/>
                <div className='m-container coupon-detail'>
                    <div>下载&emsp;&emsp;</div>
                    <table className='m-table'>
                        <thead><tr className='m-text-c bd-lightgrey m-bg-white'><th>序号</th><th>类型</th><th>有效日期</th><th>卡号</th><th>使用人姓名</th><th>手机号</th><th>使用日期</th></tr></thead>
                        <tbody>{html}</tbody>
                    </table>
                </div>
            </div>
        );
    }
}