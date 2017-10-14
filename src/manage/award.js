/**
 * 返现记录组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import '../static/api';
import Crumbs from '../static/UI';

class Award extends Component {
    constructor(props) {super(props);}

    render() {
        let props = this.props;
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
                            <span className='ui-red'>0.5%</span>返现奖励。
                        </div>
                    </header>
                    <div className='ui-content'>
                        <div className='ui-box-between'>
                            <div><span style={{fontSize:'16px'}}></span></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}


export default Award;