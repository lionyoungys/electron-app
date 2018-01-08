/**
 * 收件组件
 * @author yangyunlong
 */
import React from 'react';
import Crumb from '../UI/crumb/App';
import Search from '../UI/search/App';
import './App.css';

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {id:'',name:'',mobile:'',time:'',orders:[],platform:{cbalance:'',cname:''},merchant:{cbalance:'',cname:''}};
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
                    this.props.changeView({view:'register',param:{number:value}});
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
            orders = state.orders.map((obj) => <div key={obj}>{obj}</div>);
        return (
            <div>
                <Crumb data={[{key:0,value:'收件'}]} callback={props.changeView}/>
                <div style={{textAlign:'center',margin:'30px 0'}}>
                    <Search placeholder='请输入会员手机号' callback={this.search}/>
                </div>
                <div style={{color:'#fd592d',fontSize:'18px',textAlign:'center'}}>
                    请核对以下会员信息，确认无误后收衣下单
                </div>
                <div className='take'>
                    <div>
                        <div>客户信息：</div>
                        <div>客户姓名：{state.name}</div>
                        <div>手机号：{state.mobile}</div>
                        <div>上次到店：{state.time}</div>
                        <div>
                            未取订单：<div>{orders}</div>
                        </div>
                    </div>
                    <div>
                        <div>会员卡信息：</div>                        
                        <div>会员类型：{state.platform.cname}</div>
                        <div>会员卡余额：{'' == state.platform.cbalance ? '' : <span>&yen;{state.platform.cbalance}</span>}</div>
                    </div>
                    <div>
                        <div>专店会员卡信息：</div>                        
                        <div>会员类型：{state.merchant.cname}</div>
                        <div>会员卡余额：{'' == state.merchant.cbalance ? '' : <span>&yen;{state.merchant.cbalance}</span>}</div>
                    </div>
                </div>
                <div style={{textAlign:'center'}}>
                    <input 
                        type='button' 
                        value='收衣下单' 
                        className='m-btn m-btn-confirm m-btn-large'
                        onClick={this.next}
                    />
                </div>
            </div>
        );
    }
}