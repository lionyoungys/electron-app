/**
 * 返现记录组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import Crumb from '../Module/UI/crumb/App';

const style = {
    minHeight:'47px',lineHeight:'47px',fontSize:'16px',
    background:'#f5f5f5',padding:'0 20px',display:'inline-block'
};
class Award extends Component {
    constructor(props) {
        super(props);
        this.state = {amount:'0',number:'0',record:[]};
    }

    componentDidMount() {
        axios.post(api.U('award'),api.D({token:this.props.token}))
        .then((response) => {
            if (api.V(response.data)) {
                let result = response.data.result;
                this.setState({amount:result.back_balance,number:result.share_total,record:result.list});
            } 
            console.log(response.data);
        });
    }

    render() {
        let props = this.props,
            state = this.state,
            html = state.record.map((obj, index) => 
                <tr className='m-text-c' key={index}>
                    <td>{obj.uname}</td>
                    <td>{obj.update_time}</td>
                    <td className='m-red'>{obj.value}</td>
                </tr>
            );
        return (
            <div>
                <Crumb data={[{value:'返现记录',key:0}]} callback={this.props.changeView}/>
                <section className='ui-container'>
                    <header className='m-text-c'>
                        <div style={style}>
                            邀请好友成功下单且订单达成，即享受该单支付金额的
                            <span className='m-red'>1%</span>返现奖励。
                        </div>
                    </header>
                    <div className='ui-content'>
                        <div className='ui-box-between' style={{width:'100%'}}>
                            <div>
                                <span style={{fontSize:'16px'}}>返现余额（元）：</span>
                                <span style={{fontSize:'31px',color:'red'}}>{state.amount}</span>
                            </div>
                            <div>
                                <span style={{fontSize:'16px'}}>已邀请人数（人）：</span>
                                <span style={{fontSize:'31px'}}>{state.number}</span>
                            </div>
                        </div>
                    </div>
                    <div className='ui-content'>
                        <table className='m-table tr-b'>
                            <thead>
                                <tr className='m-bg-white'><th>姓名</th><th>时间</th><th>金额</th></tr>
                            </thead>
                            <tbody>
                                {html}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        );
    }
}


export default Award;