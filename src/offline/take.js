/**
 * 线下收衣组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import '../api';
import Crumbs, {Search} from '../static/UI';

class Take extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id:'',name:'',mobile:'',time:'',orders:[],
            platformCard:'',platformLevel:'',platformBalance:'',
            merchantCard:'',merchantLevel:'',merchantBalance:''
        };
        this.crumbs = [{key:0,text:'收衣'}];
        this.search = this.search.bind(this);
        this.next = this.next.bind(this);
    }
    search(word) {
        let props = this.props,
            reg = /^(\d|\w)+$/;
        if (word.match(reg) !== null) {
            axios.post(api.U('getUserInfo'), api.data({token:props.token,number:word}))
            .then((response) => {
            	console.log(response)
                let result = response.data.result;
                 
                if (api.verify(response.data)) {                    
                    this.setState({
                    	code:response.data.code,
                        id:result.id,
                        name:result.uname,mobile:result.umobile,time:result.last_time,orders:result.orders,  //orders：订单列表
                        platformCard:result.platform_card.cname,platformMoney:result.platform_card.cbalance,   //平台会员卡信息
                        platformCard:result.merchant_card.cname,platformMoney:result.merchant_card.cbalance    //商家会员卡信息                     
                    });
                } else {
                    props.changeView({element:'addMember',param:'mobile=' + word});
                }
            });
        }        
    }
    next() {
//      if ('' == this.state.id) return;
//      axios.post(api.U('createOrder'),api.data({token:this.props.token}))
//      .then((response) => {
//      	console.log(response)
//          let orderId = response.data.data.order_id;
//          
//      });
       // this.props.changeView({element:'item',param:'id=' + orderId + '&from=offline'});
        props.changeView({element:'item'})
    }

    render () {
        let props = this.props,
            state = this.state,
            orders = state.orders.map((obj) =>
                <div className='ui-take-order-row' key={obj}>{obj}</div>
            );
        return (
            <div>
                <Crumbs crumbs={this.crumbs} callback={props.changeView}/>
                <div style={{textAlign:'center',paddingTop:'42px'}}>
                    <Search placeholder='请输入手机号／会员卡号' callback={this.search}/>
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

export default Take;