/**
 * 订单支付组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import '../static/api';
import Crumbs from '../static/UI';

class Pay extends Component {
    constructor(props) {
        super(props);
        this.crumbs = [
            {text:'收衣',key:0,e:'take'},
            {text:'添加项目',key:1,e:'item',param:this.props.param},
            {text:'工艺加价',key:2,e:'craft',param:this.props.param},
            {text:'衣物检查',key:3,e:'check',param:this.props.param},
            {text:'订单支付',key:4}
        ];
        this.state = {amount:'0',discount:'0',realAmount:'0'};
    }

    render() {
        let state = this.state;
        return (
            <div>
                <Crumbs crumbs={this.crumbs} callback={this.props.changeView}/>
                <div className='ui-pay-amount'>
                    <div>
                        <span className='ui-pay-prefix'>应收：</span>
                        <span style={{fontSize:'24px'}}>&yen;{state.amount}</span>
                    </div>
                    <div>
                        <span className='ui-pay-prefix'>品项折扣：</span>
                        <span style={{fontSize:'24px',color:'#fe5c4c'}}>&minus;&yen;{state.discount}</span>
                    </div>
                    <div>
                        <span className='ui-pay-prefix'>实收：</span>
                        <span style={{fontSize:'30px',color:'#ff0000'}}>&yen;{state.realAmount}</span>
                    </div>
                </div>
                <div style={{padding:'36px 20px 0'}}>
                    <div style={{fontSize:'20px',color:'#999999',paddingLeft:'13px'}}>选择支付方式</div>
                    <div style={{padding:'54px 0 33px 110px',borderBottom:'1px dashed #cccccc'}}>
                        
                    </div>
                    <div className='ui-pay-row'></div>
                    <div className='ui-pay-row'></div>
                    <div className='ui-pay-row'></div>
                    <div className='ui-pay-row'></div>
                    <div style={{padding:'45px 0 0 110px'}}>
                        <input 
                            type='button' 
                            value='立即支付' 
                            className='ui-btn ui-btn-confirm ui-btn-large'
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default Pay;