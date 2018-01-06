/**
 * 收件组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import Crumb from '../UI/crumb/App';
import Search from '../UI/search/App';
import './App.css';
import '../api';

export default class extends Component {
    constructor(props) {
        super(props);
        this.state = {id:'',name:'',mobile:'',time:'',orders:[],platform:{},merchant:{}};
        this.search = this.search.bind(this);
        this.next = this.next.bind(this);
    }
    search(value) {
        if (value.match(/^1\d{10}$/) !== null) {
            axios.post(api.U('member'), api.D({token:this.props.token,number:value}))
            .then(response => {
                let result = response.data.result;
                if (api.V(response.data)) {                    
                    this.setState({
                        id:result.id,
                        name:result.uname,
                        mobile:result.umobile,
                        time:result.last_time,
                        orders:result.orders,
                        platform:result.platform_card,
                        merchant:result.merchant_card                 
                    });
                } else {
                    this.props.changeView({view:'addMember',param:{mobile:value}});
                }
            });
        }        
    }
   next() {
    //  if ('' == this.state.id) return;
    //  axios.post(api.U('createOrder'),api.data({token:this.props.token}))
    //  .then((response) => {
    //  	console.log(response)
    //      let orderId = response.data.data.order_id;
         
    //  });
    //    // this.props.changeView({element:'item',param:'id=' + orderId + '&from=offline'});
    //     props.changeView({element:'item'})
    }

    render () {
        let props = this.props,
            state = this.state,
            orders = state.orders.map((obj) =>
                <div className='ui-take-order-row' key={obj}>{obj}</div>
            );
        return (
            <div>
                <Crumb data={[{key:0,value:'收件'}]} callback={props.changeView}/>
                <div style={{textAlign:'center',paddingTop:'42px'}}>
                    <Search placeholder='请输入会员手机号' callback={this.search}/>
                </div>
                <div style={{color:'#fd592d',fontSize:'22px',textAlign:'center',paddingTop:'47px'}}>
                    请核对以下会员信息，确认无误后收衣下单
                </div>
                <div className='ui-take-info-container'>
                    <div className='ui-take-info-box'>
                        <div className='ui-take-info-title'>客户信息:</div>
                        <div className='ui-take-info-row'>客户姓名:{state.name}</div>
                        <div className='ui-take-info-row'>手机号:{state.mobile}</div>
                        <div className='ui-take-info-row'>上次到店:{state.time}</div>
                        <div className='ui-take-info-row ui-take-info-orders'>
                            <div>未取订单:</div><div>{orders}</div>
                        </div>
                    </div>
                    <div className='ui-take-info-box'>
                        <div className='ui-take-info-title'>会员卡信息:</div>                        
                        <div className='ui-take-info-row'>会员类型:{state.platformCard}</div>
                        <div className='ui-take-info-row'>会员卡余额:&yen;{'' == state.platformMoney ? 0 : state.platformMoney}</div>
                    </div>
                    <div className='ui-take-info-box'>
                        <div className='ui-take-info-title'>专店会员卡信息:</div>                        
                        <div className='ui-take-info-row'>会员类型:{state.platformCard}</div>
                        <div className='ui-take-info-row'>会员卡余额:&yen;{'' == state.platformMoney ? 0 : state.platformMoney}</div>
                    </div>
                </div>
                <div style={{paddingTop:'58px',textAlign:'center'}}>
                    <input 
                        type='button' 
                        value='收衣下单' 
                        className='ui-btn ui-btn-confirm ui-btn-large'
                        onClick={this.next}
                    />
                </div>
            </div>
        );
    }
}