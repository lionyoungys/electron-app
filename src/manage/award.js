/**
 * 返现记录组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import '../api';
import Crumbs from '../static/UI';

class Award extends Component {
    constructor(props) {
        super(props);
        this.state = {amount:'0',number:'0',record:[]};
    }

    componentDidMount() {
        axios.post(api.U('award'),api.data({token:this.props.token}))
        .then((response) => {
            let result = response.data.data;
            this.setState({
                amount:result.totalFee,
                number:result.personalNumber,
                record:result.record
            });
        });
    }

    render() {
        let props = this.props,
            state = this.state,
            html = state.record.map((obj) => 
                <tr className='ui-tr-d ui-b' key={obj.id}>
                    <td>{obj.username}</td>
                    <td>{obj.time}</td>
                    <td className='ui-red'>{obj.reward}</td>
                </tr>
            );
        const style = {
            minHeight:'47px',lineHeight:'47px',fontSize:'16px',
            background:'#f5f5f5',padding:'0 20px',display:'inline-block'
        };
        return (
            <div>
                <Crumbs crumbs={[{text:'返现记录',key:0}]} callback={props.changeView}/>
                <section className='ui-container'>
                    <header style={{textAlign:'center'}}>
                        <div style={style}>
                            邀请好友成功下单且订单达成，即享受该单支付金额的
                            <span className='ui-red'>1%</span>返现奖励。
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
                        <table className='ui-table'>
                            <thead className='ui-fieldset'>
                                <tr className='ui-tr-h'><th>姓名</th><th>时间</th><th>金额</th></tr>
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